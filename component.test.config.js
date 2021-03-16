const component = require("component");
module.exports = (() => {
    return new Promise(async (resolve) => {
        await component.load({ moduleName:"component.request.handler" });
        await component.load({ moduleName:"component.request.handler.route" });
        let testModule = require("component.request.handler.route/component.test");
        testModule.package.parentName = "component.test";
        resolve();
    });
})();