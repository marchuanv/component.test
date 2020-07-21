const logging = require("logging");
logging.config.add("Delegating");
module.exports = { 
    pointers: [],
    register: ( context, name, callback ) => {
        const pointer = module.exports.pointers.find(p => p.context === context);
        if (pointer){
            pointer.callbacks.push( { name, func: callback });
        } else {
            module.exports.pointers.push({ 
                context, 
                callbacks: [{ 
                    name, 
                    func: callback, 
                    retry: 1, 
                    timeout: 500,
                    result: null,
                    error: null
                }]
            });
        }
    },
    call: async ( { context, name }, params) => {

        const pointer = module.exports.pointers.find(p => p.context === context);
        if (!pointer){
            const error = `no pointers found for the ${context} module.`;
            logging.write("Delegating", error);
            return new Error(error);
        }

        const callbacks =  pointer.callbacks;
        if (!callbacks || !Array.isArray(callbacks)){
            const error = `expected pointer 'callbacks' to be an array`;
            logging.write("Delegating",error);
            return new Error(error);
        }

        const filteredCallbacks = callbacks.filter(c => c.name === name || !name);
        for(const callback of filteredCallbacks){
            try {
                callback.result = await callback.func(params);
                callback.timeout = 500;
                callback.retry = 1;
                callback.error = null;
            } catch (error) {
                logging.write("Delegating", `${callback.name} failed with: ${error.message || error}, retrying ${callback.retry} of 3`);
                callback.result = null;
                callback.error = error;
                if (callback.retry <= 2){
                    callback.retry = callback.retry + 1;
                    setTimeout(async () => {
                        await module.exports.call( { context, name: callback.name }, params);
                    }, callback.timeout);
                }
                callback.timeout = callback.timeout * 2;
            }
        }

        await Promise.all(filteredCallbacks.map(c => c.result));
        await Promise.all(filteredCallbacks.map(c => c.error));

        const filteredCallbacksCloned = JSON.parse(JSON.stringify(filteredCallbacks));
        filteredCallbacks.forEach(x => x.result = null );
        filteredCallbacks.forEach(x => x.error = null );

        const results = filteredCallbacksCloned.filter(r => r.result).map(r => r.result);
        const errors = filteredCallbacksCloned.filter(r => r.error).map(r => r.error);

        if (results.length > 1 || errors.length > 1 || (results.length  + errors.length) > 1 ){
            if (errors.length > 0){
                return errors[0];
            }
            const error = new Error(`expected at most one of all the functions registered for "${context}" to return results`);
            return {
                message: error.message,
                stack: error.stack,
            }
        }

        if (errors.length !== 0){
            return errors[0];
        }
      
        return results[0];
    }
};