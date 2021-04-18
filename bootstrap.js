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
            let componentUnderTest = await component.load(moduleName);
            componentUnderTest = componentUnderTest[componentUnderTest.name];
            const results = {
                component: componentUnderTest,
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