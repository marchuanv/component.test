const component = require("component");
module.exports = (() => {
    return new Promise(async (resolve) => {
        await component.load({ moduleName:"component.request.handler" });
        await component.load({ moduleName:"component.request.handler.route" });
        await component.load({ moduleName:"component.request.handler.deferred" });
        const { request } = await component.load({ moduleName:"component.request" });
        let packageJson = require("./package.json");
        if (packageJson.lock === undefined){
            packageJson.lock = false;
        }
        await resolve({ proxy: ({ moduleName }) => {
            return new Promise((resolve) => {
                const id = setInterval(async () => {
                    if (packageJson.lock){
                        return;
                    }
                    clearInterval(id);
                    packageJson.lock = true;
                    packageJson.name = `${moduleName}.proxy`;
                    let packageJson2 = require(`./node_modules/${moduleName}/package.json`);
                    let originalParent = packageJson2.component.parentName;
                    packageJson2.component.parentName = packageJson.name;
                    await resolve({ run: async (callback) => {
                        await callback({ 
                            component,
                            request
                        });
                        packageJson2.component.parentName = originalParent;
                        packageJson.lock = false;
                    }});
                },1000);
            });
        }});
    });
})();