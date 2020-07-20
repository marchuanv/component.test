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
            const error = `no pointers found for the ${context} module.`;
            logging.write("Delegating", error);
            return { error };
        }

        const callingFunc =  pointer.func;
        if (!callingFunc || typeof callingFunc !== 'function'){
            const error = `expected parameter 'callingFunc' to be a function`;
            logging.write("Delegating",error);
            return { error };
        }

        let error;
        let results;
        try {
            results = await callingFunc(params);
            if (results && results.error){
                error = results.error;
            } else if (results && !results.error){
               return results;
            }
        } catch (err) {
            error = err;
        }
        if (error && module.exports.retry <= 2 ){
            module.exports.retry = module.exports.retry + 1;
            logging.write("Delegating", `${callingFunc.name} error after ${module.exports.retry} retries.`);
            return module.exports.call(context, params);
        } else if (error) {
            logging.write("Delegating", `${callingFunc.name} failed with: ${error.message || error}.`);
            return { error };
        }
    }
};