(async()=> {
    const component = require("component");
    await component.load({ moduleName:"component.request.handler", gitUsername: "marchuanv" });
    console.log("test");
    //require("component.request.handler");
})();