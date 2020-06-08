const logging = require("logging");
logging.config.add("Delegating");
module.exports = { 
    retry: 0,
    pointers: [],
    create: (moduleName, callback, callbackRetry) => {
        pointers.push({ moduleName, callback, callbackRetry });
    },
    call: async (callingFunc, rollbackFunc, params) => {
        if (!callingFunc || typeof callingFunc !== 'function'){
            logging.write("Delegating", `expected parameter 'callingFunc' to be a function`);
            return;
        }
        if (rollbackFunc && typeof rollbackFunc !== 'function'){
            logging.write("Delegating", `expected parameter 'rollbackFunc' to be a function`);
            return;
        }
        let error;
        try {
            return await callingFunc(params);
        } catch (err) {
            error = err;
        }
        if (error && module.exports.retry <= 2 ){
            module.exports.retry = module.exports.retry + 1;
            logging.write("Delegating", `${callingFunc.name} error after ${module.exports.retry} retries.`);
            logging.write("Delegating", `calling ${rollbackFunc.name}.`);
            try {
                await rollbackFunc(params);
            } catch (err) {
                logging.write("Delegating", `${rollbackFunc.name} failed with: ${err.message}.`);
                return;
            }
            return module.exports.call(callingFunc, rollbackFunc, params);
        } else if (error) {
            logging.write("Delegating", `${callingFunc.name} failed with: ${error.message}.`);
            throw error;
        }
    }
};