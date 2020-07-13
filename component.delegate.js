const logging = require("logging");
logging.config.add("Delegating");
module.exports = { 
    retry: 0,
    pointers: [],
    register: ( context, func ) => {
        const pointer = module.exports.pointers.find(p => p.context === context);
        if (pointer){
            pointer.func = func;
        } else {
            module.exports.pointers.push({ context, func });
        }
    },
    call: async (context, params) => {

        const pointer = module.exports.pointers.find(p => p.context === context);
        if (!pointer){
            logging.write("Delegating", `no pointers found for the ${context} module.`);
            return;
        }

        const callingFunc =  pointer.func;
        if (!callingFunc || typeof callingFunc !== 'function'){
            logging.write("Delegating", `expected parameter 'callingFunc' to be a function`);
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
            return module.exports.call(context, params);
        } else if (error) {
            logging.write("Delegating", `${callingFunc.name} failed with: ${error.message}.`);
            return error;
        }
    }
};