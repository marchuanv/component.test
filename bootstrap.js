const component = require("component");
module.exports = (() => {
    return new Promise(async (resolve) => {
        await component.load({ moduleName:"component.request.handler" });
        await component.load({ moduleName:"component.request.handler.route" });
        await component.load({ moduleName:"component.request.handler.deferred" });
        resolve();
    });
})();