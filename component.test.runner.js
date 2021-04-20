const { bootstrap } = require("./bootstrap.js");
const utils = require("utils");
module.exports = {
    runTest: ({componentName}) => {
        return new Promise(async (resolve, reject) => {
            const { test, complete } = await bootstrap(componentName);
            test.subscribe({ callback: async() => {
                return {
                    headers: {},
                    success: true,
                    data: {},
                    statusCode: 200,
                    statusMessage: "Success"
                };
            }});
            const results = await test.publish({ headers: {}, data: {} });
            if (results.success){
                await resolve( utils.getJSONString(results));
            } else {
                await reject( utils.getJSONString(results));
            }
            complete();
        });
    }
}

