const settingJson = require("../settings.json");
const config = JSON.parse(JSON.stringify(settingJson));
module.exports = config;