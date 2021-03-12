const component = require("component");
component.register({ componentModule: module, componentParentModuleName: "component.request.handler.deferred" }).then( async ({ requestHandlerDeferred }) => {
        
    await component.load({ moduleName:"component.request.handler.route" });


    requestHandlerDeferred.subscribe( { name: "3000/test1" }, () => {
        return { statusCode: 200, statusMessage: "Success", headers: {}, data: "test passed" };
    });

    requestHandlerDeferred.subscribe( { name: "3000/test2" }, () => {
        return { statusCode: 200, statusMessage: "Success", headers: {}, data: "test passed" };
    });

    const { request } = await component.load({ moduleName:"component.request" });

    let results = await request.send({ 
        host: "localhost",
        port: 3000,
        path: "/test1",
        method: "GET",
        headers: {}, 
        data: "",
        retryCount: 1
    });
    if (results.statusCode !== 200){
        throw "routing for test 01 failed";
    }

    results = await request.send({ 
        host: "localhost",
        port: 3000,
        path: "/test2",
        method: "GET",
        headers: {}, 
        data: "",
        retryCount: 1
    });
    if (results.statusCode !== 200){
        throw "routing for test 02 failed";
    }
});