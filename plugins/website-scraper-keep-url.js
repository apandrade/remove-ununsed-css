const { keepUrls } = require("../settings.json");
module.exports = class MyPlugin {
	apply(registerAction) {
		registerAction('getReference', async ({resource, parentResource, originalReference}) => {
            keepUrls.forEach((url) => {
                if(originalReference.includes(url))
                    return null;
            })
            return { reference: resource.url };
        })
	}
}