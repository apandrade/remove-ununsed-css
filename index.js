const scrape = require('website-scraper'),
      PuppeteerPlugin = require('website-scraper-puppeteer'),
      fs = require('fs'),
      path = require('path'),
      url = "www.oattravel.com",
      rootFolder = `localServer/${url}`,
      resultFolder = `${rootFolder}/cleanedCSS`,
      configureTasks = require('./gulp/configure-tasks'),
      gulp = require('gulp');

console.log(`Cleaning folder ${rootFolder}`);
fs.rmdirSync(rootFolder, { recursive: true });
console.log(`Start scraping ${url}`);

scrape({
    urls: [{url: `https://${url}/`, filename: 'index.html'}],
    directory: path.resolve(__dirname, rootFolder),
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
}).catch((error) => {
    console.log(error);
});