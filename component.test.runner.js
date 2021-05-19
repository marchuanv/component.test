const { bootstrap } = require("./bootstrap.js");
const utils = require("utils");
module.exports = {
    runTest: ({componentName}) => {
        return new Promise(async (resolve) => {
            const { test, complete,  MessageBusMessage, MessageBusSubscription, MessageBusMessageStatus } = await bootstrap(componentName);
            const messageBusSubscription = new MessageBusSubscription();
            const publishMessage = new MessageBusMessage({});

            messageBusSubscription.callback = (incomingMessageBusMessage) => {
                if (incomingMessageBusMessage.Id !== publishMessage.Id) {
                    throw new Error("test failed");
                }
                resolve();
                complete();
                incomingMessageBusMessage.status = MessageBusMessageStatus.Success;
                return incomingMessageBusMessage;
            };
            await test.subscribe(messageBusSubscription);
            await test.publish(publishMessage);
        });
    }
}