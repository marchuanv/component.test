const { bootstrap } = require("./bootstrap.js");
const utils = require("utils");
module.exports = {
    runTest: ({componentName}) => {
        return new Promise(async (resolve) => {
            const { test, complete,  MessageBusMessage } = await bootstrap(componentName);
            const publishMessage = new MessageBusMessage({});
            await test.publish(publishMessage);
            console.log("Test Executed. Published Message State:", JSON.stringify(publishMessage.clone(), null, 4));
            resolve();
            complete();
        });
    }
}