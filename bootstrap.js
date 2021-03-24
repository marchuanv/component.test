const component = require("component");
component.on({ eventName: "config", moduleName:"component.request.handler.route" },(config) => {
    config.routes = [
        { path: "/requesthandlertest" },
        { path: "/requesthandlerroutetest" },
        { path: "/requesthandlerdeferredtest" },
        { path: "/requesthandlerusertest" },
        { path: "/requesthandlerunsecuretest" }
    ];
});

module.exports = (() => {
    return new Promise(async (resolve) => {
        
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
                    module.path = module.path.replace(packageJson.name,`${moduleName}.proxy`);
                    packageJson.name = `${moduleName}.proxy`;

                    let config;
                    component.on({ eventName: "config", moduleName },(_config) => {
                        _config.originalParent = _config.parent;
                        _config.parent = [];
                        _config.parent.push(packageJson.name);
                        config = _config;
                    });

                    await resolve({ run: async (callback) => {
                        await component.register("component.request");
                        await component.register(moduleName);
                        const results = await component.register(module);
                        results.request = await component.load( { moduleName: "component.request" });
                        await component.load({ moduleName });
                        await callback(results);
                        config.parent = config.originalParent;
                        packageJson.lock = false;
                    }});

                },1000);
            });
        }});
    });
})();