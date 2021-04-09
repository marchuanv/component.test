const component = require("component");
let lockTest = false;

const bootstrap = (moduleName) => {
    return new Promise((resolve) => {
        const id = setInterval(async() => {
            if (lockTest){
                return;
            }
            lockTest = true;
            clearInterval(id);
            const { request } = await component.load("component.request");
            let packageJson = require("./package.json");
            module.path = module.path.replace(packageJson.name,`${moduleName}.proxy`);
            packageJson.name = `${moduleName}.proxy`;
            let componentUnderTest = await component.load(moduleName);
            componentUnderTest = componentUnderTest[componentUnderTest.name];

            if (componentUnderTest.name.indexOf("Route") > -1 ) {
                componentUnderTest.config.routes = [
                    { path: "/requesthandlertest", secure: false },
                    { path: "/requesthandlerroutetest", secure: false },
                    { path: "/requesthandlerdeferredtest", secure: false },
                    { path: "/requesthandlerusertest", secure: false },
                    { path: "/requesthandlerunsecuretest", secure: false },
                    { path: "/requesthandlersecuretest", secure: true },
                ];
            }
            let componentUnderTestProxy = await component.load(module);
            componentUnderTestProxy = componentUnderTestProxy[componentUnderTestProxy.name];
            componentUnderTestProxy.config.publishers = [];
            componentUnderTestProxy.config.publishers.push({ moduleName: componentUnderTest.name });
            await resolve({
                request: request.exports,
                component: componentUnderTestProxy,
                complete: () => {
                    lockTest = false;
                }
            });
        },1000);
    });
};
module.exports = { bootstrap };