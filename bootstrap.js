const component = require("component");
const { MessageBusMessage, MessageBusMessageStatus, MessageBusSubscription } = require("component");
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
                let componentUnderTest = await component.load(moduleName);
                componentUnderTest = componentUnderTest[componentUnderTest.name];
                test.config.dependencies.push({moduleName});
                await resolve({ test, componentUnderTest, complete: () => lockTest = false, MessageBusMessage, MessageBusMessageStatus, MessageBusSubscription });
            });
        },1000);
    });
};
module.exports = { bootstrap };