(async()=> {
    const component = require("component");
    await component.load({ moduleName:"component.request.handler.route" });
    console.log("test");
    //require("component.request.handler");
})();