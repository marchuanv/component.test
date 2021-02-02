const logging = require("logging");
logging.config.add("Delegating");
module.exports = { 
    pointers: [],
    register: ( context, name, callback ) => {
        if (!context || !name){
             return logging.write("Delegating", "failed to register, no context or name provided.");
        }
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
                    result: null
                }]
            });
            logging.write("Delegating", `Registered ${name} callback on ${context}`);
        }
    },
    call: async ( { context, name, wildcard }, params) => {
        if (!context){
             const error = "failed to invoke callback, no context provided.";
             logging.write("Delegating", error);
             return new Error(error);
        }
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
            return  new Error(error);
        }

        const filteredCallbacks = callbacks.filter(c => c.name.toString().startsWith(wildcard) || ( (wildcard === undefined || wildcard === "") && (c.name === name || !name )) );
        if (filteredCallbacks.length === 0){
            const error = `no callbacks`;
            logging.write("Delegating", error);
            return new Error(error);
        }

        for(const callback of filteredCallbacks){
            try {
                logging.write("Delegating", "invoking callback");
                callback.result = await callback.func(params);
                logging.write("Delegating", "callback invoked");
                callback.timeout = 500;
                callback.retry = 1;
            } catch (error) {
                logging.write("Delegating", `${callback.name} failed with: ${error.message || error}, retrying ${callback.retry} of 3`);
                callback.result = error;
                if (callback.retry <= 2){
                    callback.retry = callback.retry + 1;
                    setTimeout(async () => {
                        await module.exports.call( { context, name: callback.name }, params);
                    }, callback.timeout);
                }
                callback.timeout = callback.timeout * 2;
            }
        }
        
        //Errors before promises resolved
        for(const errorResult of filteredCallbacks.filter(cb => cb.result && cb.result.message && cb.result.stack)){
            return errorResult.result;
        };

        await Promise.all(filteredCallbacks.map(c => c.result));
        
        logging.write("Delegating", "callback(s) invoked");

        const filteredCallbacksCloned = JSON.parse(JSON.stringify(filteredCallbacks));
        filteredCallbacks.forEach(x => x.result = null );

        //Errors after promises resolved
        for(const errorResult of filteredCallbacksCloned.filter(cb => cb.result && cb.result.message && cb.result.stack)){
            return errorResult.result;
        };

        if (filteredCallbacksCloned.filter(cb => cb.result).length > 1){
            return new Error(`expected at most one of all the functions registered for "${context}" to return results`);
        }

        const firstCallbackWithResult = filteredCallbacksCloned.find(cb => cb.result);
        return  firstCallbackWithResult? firstCallbackWithResult.result : null;
    }
};
