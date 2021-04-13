const { bootstrap } = require("./bootstrap.js");
bootstrap("component.request.handler.user").then( async ({ request, component, complete }) => {
    const newRequest = { port: 3000, path: "/requesthandlerusertest", method: "GET", headers: {},  data: "" };
    const testAuthorisationToken = "fake token, security layer should create this";
    component.subscribe(( { session }) => {
        session.token = testAuthorisationToken;
        return {
            statusCode: 200,
            statusMessage: "User Test Successful",
            headers: {}
        };
    });
    let results = await request.send(newRequest);
    if (results.statusCode !== 400) {
        console.log( `User Test Failed: ${results.data}`);
    } else {
        console.log(`User Test Passed`);
    }

    newRequest.headers = {
        username: "joe",
        fromport: 4000,
        fromhost: "localhost"
    };
    results = await request.send(newRequest);
    if (results.statusCode !== 200 || results.statusMessage !== "User Test Successful"){
        console.log( `User Test Failed: ${results.data}`);
    } else {
        console.log(`User Test Passed`);
    }

    newRequest.headers = {
        sessionId: results.headers.sessionid,
        token: testAuthorisationToken
    };
    results = await request.send(newRequest);
    if (results.statusCode !== 200 || results.statusMessage !== "User Test Successful"){
        console.log(`User Test Failed: ${results.data}`);
    } else {
        console.log(`User Test Passed`);
    }
    complete();
}).catch((err)=>{
    console.log(err);
});