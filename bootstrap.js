const component = require("component");

//configure test routes
component.register("component.request.handler.route").then(({ requestHandlerRoute }) => {
    requestHandlerRoute.routes = [
        { path: "/requesthandlertest", secure: false },
        { path: "/requesthandlerroutetest", secure: false },
        { path: "/requesthandlerdeferredtest", secure: false },
        { path: "/requesthandlerusertest", secure: false },
        { path: "/requesthandlerunsecuretest", secure: false },
        { path: "/requesthandlersecuretest", secure: true },
    ];
});

let lockTest = false;

const bootstrap = () => {
    return new Promise((resolve) => {
        const id = setInterval(async() => {
            if (lockTest){
                return;
            }
            lockTest = true;
            clearInterval(id);
            await resolve(async ({ moduleName }) => {
            
                await component.register("component.request");
                let packageJson = require("./package.json");
                module.path = module.path.replace(packageJson.name,`${moduleName}.proxy`);
                packageJson.name = `${moduleName}.proxy`;

                let originalSubscribers;
                const registeredModuleUnderTest = Object.values(await component.register(moduleName))[0];
                originalSubscribers = registeredModuleUnderTest.subscribers;
                registeredModuleUnderTest.subscribers = [];
                registeredModuleUnderTest.subscribers.push({ moduleName: packageJson.name });

                const registeredModuleUnderTestProxy = Object.values(await component.register(module))[0];
                registeredModuleUnderTestProxy.publishers.push({ moduleName: registeredModuleUnderTest.name  });
                
                for(const { moduleName } of registeredModuleUnderTest.publishers){
                    await component.load({ moduleName });
                };
                await component.load({ moduleName });
                const request = await component.load({ moduleName: "component.request" });
                
                return {
                    request,
                    component: registeredModuleUnderTestProxy,
                    complete: () => {
                        //Reset Config
                        registeredModuleUnderTest.subscribers = originalSubscribers;
                        lockTest = false;
                    }
                };
            });
        },1000);
    });
};
module.exports = { bootstrap };