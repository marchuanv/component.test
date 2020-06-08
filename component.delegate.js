const logging = require("logging");
logging.config.add("Delegating");
module.exports = { 
    retry: 0,
    pointers: [],
    register: ( moduleName, callingModuleName, callback ) => {
        const pointer = module.exports.pointers.find(mod => mod.name === moduleName && mod.dependancy === callingModuleName);
        if (pointer){
            pointer.call = callback;
        } else {
            module.exports.pointers.push({ 
                name: moduleName, 
                dependancy: callingModuleName,
                call: callback
            });
        }
    },
    registerRetry: ( moduleName, callingModuleName, callback ) => {
        const pointer = module.exports.pointers.find(mod => mod.name === moduleName && mod.dependancy === callingModuleName);
        if (pointer){
            pointer.retry = callback;
        } else {
            module.exports.pointers.push({ 
                name: moduleName, 
                dependancy: callingModuleName,
                retry: callback
            });
        }
    },
    call: async (callingFunc, params) => {
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
            return module.exports.call(callingFunc, params);
        } else if (error) {
            logging.write("Delegating", `${callingFunc.name} failed with: ${error.message}.`);
            throw error;
        }
    }
};