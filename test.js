const testRunner = require("./component.test.runner");

( async () => {
    await testRunner.runTest({ componentName: "component.request.handler", requestPath: "/request"});
    await testRunner.runTest({ componentName: "component.request.handler.deferred", requestPath: "/deferred"});
    
    //Test with user headers
    // await testRunner.runTest({ componentName: "component.request.handler.user", requestPath: "/user", username: "joe", statusCode: 200, statusMessage: "Success" });
    //Test without user headers
    // await testRunner.runTest({ componentName: "component.request.handler.user", requestPath: "/user", statusCode: 400, statusMessage: "Bad Request" });
    
    // //No Routes
    // await testRunner.runTest({ componentName: "component.request.handler.route", username: "joe", requestPath: "/test", statusCode: 404, statusMessage: "Not Found" });
    // //Register Test Route
    // await testRunner.runTest({ componentName: "component.request.handler.route", username: "joe", requestPath: "/test", isNewRouteroute: true });

    // //unsecure
    // await testRunner.runTest({ componentName: "component.request.handler.secure", username: "joe", requestPath: "/unsecure", isNewRouteroute: true });

    // //secure
    // await testRunner.runTest({ componentName: "component.request.handler.secure", username: "joe", passphrase: "secret1", requestPath: "/secure", isNewRouteroute: true });

    console.log("All Tests Passed");
})().catch((err) => {
    console.log(err);
});



// testRunner.runTest({ componentName: "component.request.handler.secure", requestPath: "/securerequest", username: "joe", passphrase: "secret1", inputData: "", isNewRouteroute: true });

// require("./component.request.handler.test.js");
// require("./component.request.handler.deferred.test.js");
// require("./component.request.handler.user.test.js");
// require("./component.request.handler.route.test.js");
// require("./component.request.handler.secure.test..js");
// require("./component.request.handler.unsecure.test.js");