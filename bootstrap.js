const component = require("component");
let lockTest = false;

const bootstrap = () => {
    return new Promise((resolve) => {
        const id = setInterval(async() => {
            if (lockTest){
                return;
            }
            clearInterval(id);
            lockTest = true;
            await resolve(async ({ moduleName }) => {
            
                const registeredRequest = await component.register("component.request");
                const request = await component.load( { moduleName: "component.request" });

                let packageJson = require("./package.json");
                module.path = module.path.replace(packageJson.name,`${moduleName}.proxy`);
                packageJson.name = `${moduleName}.proxy`;

                const registeredResults = {};
                const registeredModuleUnderTest = await component.register(moduleName);
                const registeredModulRouteseUnderTest = await component.register("component.request.handler.route");
                const registeredModuleUnderTestProxy = await component.register(module);

                Object.assign(registeredResults, registeredRequest);
                Object.assign(registeredResults, registeredModuleUnderTest);
                Object.assign(registeredResults, registeredModuleUnderTestProxy);
                
                await component.load({ moduleName });

                let originalParent;
                let friendlyName;
                for(const property in registeredModuleUnderTest){
                    friendlyName = property;
                };
                for(const property in registeredModulRouteseUnderTest){
                    registeredModulRouteseUnderTest[property].routes = [
                        { path: "/requesthandlertest" },
                        { path: "/requesthandlerroutetest" },
                        { path: "/requesthandlerdeferredtest" },
                        { path: "/requesthandlerusertest" },
                        { path: "/requesthandlerunsecuretest" }
                    ];
                };

                originalParent = registeredModuleUnderTest[friendlyName].parent;
                registeredModuleUnderTest[friendlyName].parent = [];
                registeredModuleUnderTest[friendlyName].parent.push(packageJson.name);
                
                return { request, component: registeredResults[`${friendlyName}Proxy`], complete: () => {
                    //Reset Config
                    registeredModuleUnderTest[friendlyName].parent = originalParent;
                    lockTest = false;
                }};
            });
        },1000);
    });
};
module.exports = { bootstrap };