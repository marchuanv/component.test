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
            let componentUnderTestProxy = await component.load(module);
            componentUnderTestProxy = componentUnderTestProxy[componentUnderTestProxy.name];
            componentUnderTestProxy.config.dependencies = [];
            componentUnderTestProxy.config.dependencies.push({ moduleName: componentUnderTest.name });
            const results = {
                request: request.exports,
                component: componentUnderTestProxy,
                complete: () => {
                    lockTest = false;
                }
            };
            results[componentUnderTest.config.friendlyName] = componentUnderTest;
            await resolve(results);
        },1000);
    });
};
module.exports = { bootstrap };