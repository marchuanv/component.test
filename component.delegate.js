const logging = require("logging");
logging.config.add("Delegating");
module.exports = { 
    retry: 0,
    pointers: [],
    register: ( context, name, callback ) => {
        const pointer = module.exports.pointers.find(p => p.context === context);
        if (pointer){
            pointer.callbacks.push( { name, func: callback });
        } else {
            module.exports.pointers.push({ context, callbacks: [ { name, func: callback }] });
        }
    },
    call: async ( { context, name }, params) => {

        const pointer = module.exports.pointers.find(p => p.context === context);
        if (!pointer){
            const error = `no pointers found for the ${context} module.`;
            logging.write("Delegating", error);
            return { error };
        }

        const callbacks =  pointer.callbacks;
        if (!callbacks || !Array.isArray(callbacks)){
            const error = `expected pointer 'callbacks' to be an array`;
            logging.write("Delegating",error);
            return { error };
        }

        let results = [];
        for(const callback of callbacks.filter(c => c.name === name || !name)){
            let error = "";
            try {
                const result = await callback.func(params);
                if (result){
                    results.push( { name: callback.name, result, error, success: true });
                } else {
                    results.push( { name: callback.name, result, error, success: false });
                }
            } catch (err) {
                error = err;
            }
            if (error && module.exports.retry <= 2 ){
                module.exports.retry = module.exports.retry + 1;
                logging.write("Delegating", `${callback.name} error after ${module.exports.retry} retries.`);
                const result = await module.exports.call( { context, name: callback.name }, params);
                if (result){
                    results.push( { name: callback.name, result, error, success: false });
                }
            } else if (error) {
                logging.write("Delegating", `${callback.name} failed with: ${error.message || error}.`);
                results.push( { name: callback.name, result: null, error, success: false });
            }
        }

        results = results.filter(x => x.success);
        if (results.length > 1){
            throw new Error(`functions registered for ${context} returned more than one valid results`);
        }
        return results[0]? results[0].result: null;
    }
};