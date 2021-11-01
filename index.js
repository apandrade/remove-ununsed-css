const scrape = require('website-scraper');
const PuppeteerPlugin = require('website-scraper-puppeteer');
const { PurgeCSS } = require('purgecss');
var fs = require('fs');

const path = require('path');
const url = "www.oattravel.com";
const resultPath = `localServer/${url}`;
const purgedFileFolder = `${resultPath}/purgedCSS`
console.log(`Cleaning folder ${resultPath}`);
fs.rmdirSync(resultPath, { recursive: true });
console.log(`Start scraping ${url}`);
scrape({
    urls: [{url: `https://${url}/`, filename: 'index.html'}],
    directory: path.resolve(__dirname, resultPath),
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
    if(!result)
        throw new Error("The scraping result is null or empty");
    
    fs.mkdirSync(purgedFileFolder);
    console.log(`Ununsed css extraction started`);
    const purgeCSSResult = new PurgeCSS().purge({
        content: ['**/*.html'],
        css: ['**/*.css']
    });

    purgeCSSResult.then((purgedCssFiles) => {
        console.log(`Purged css files`);
        
        purgedCssFiles.forEach(item => { 
            const fileName = path.basename(item.file); 
            const purgedFilePath = `${purgedFileFolder}/${fileName}`;    
            fs.writeFile(purgedFilePath, item.css, function (err) {
                if (err) 
                throw err;
    
                console.log(purgedFilePath);
            });
        });
    })

}).catch((error) => {
    console.log(error);
});