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
            component.load("component.test").then(async ({test}) => {
                await component.load(moduleName);
                test.config.dependencies.push({moduleName});
                const results = { test, complete: () => lockTest = false };
                await resolve(results);
            });
        },1000);
    });
};
module.exports = { bootstrap };