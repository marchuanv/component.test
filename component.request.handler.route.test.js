const component = require("component");

let {package} = require("component.request.handler.route/component.test");
package.parentName = "component.test";

component.register({componentModule: module }).then( async ( { test } ) => {
    test.subscribe({ name: "3000/test1", overwriteDelegate: true }, () => {
        return {
            statusCode: 200,
            statusMessage: "Test Successful",
            headers: {}
        };
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
    if (results.statusCode !== 200 && results.statusMessage !== "Test Successful"){
        throw "routing for test 01 failed";
    }
});