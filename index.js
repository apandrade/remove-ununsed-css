const scrape = require('website-scraper'),
      PuppeteerPlugin = require('website-scraper-puppeteer'),
      fs = require('fs'),
      path = require('path'),
      config = require('./settings.json');
      rootFolder = `${config.path.server}/${config.path.root}`,
      resultFolder = `${rootFolder}/${config.path.result}`,
      fullPath = path.resolve(__dirname, rootFolder),
      configureTasks = require('./gulp/configure-tasks'),
      gulp = require('gulp');

console.log(`Cleaning folder ${rootFolder}`);
fs.rmdirSync(rootFolder, { recursive: true });
console.log(`Start scraping`);

scrape({
    urls: config.targets,
    directory: fullPath,
    plugins: [ 
        new PuppeteerPlugin({
            launchOptions: { 
                headless: true
            },
            scrollToBottom: {
                timeout: 10000, 
                viewportN: 10 
            }
        })
    ]
}).then((result) => {
    if(result.length == 0 || (result.length > 0 && !result[0].saved))
        throw new Error("Someting went wrong, the website couldn't be saved.");
    
    const gulpTasks =  configureTasks(rootFolder, resultFolder)
    gulpTasks.forEach(taskName => {
        console.log(`Running gulp task ${taskName}`);
        gulp.task(taskName)();
    });

    console.log(`Finished!`);
    console.log(`Result files: ${fullPath}`);
}).catch((error) => {
    console.log(error);
});