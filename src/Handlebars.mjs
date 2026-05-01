import { SystemConsts } from "./SystemConsts.mjs";


export function registerFunctions() {

    Handlebars.registerHelper('SYSTEMID', function(key){
        return SystemConsts.SYSTEMID;
    });

    Handlebars.registerHelper('SYSTEMTEMPLATE', function(key){
        return SystemConsts.TEMPLATES_PATH;
    });

    Handlebars.registerHelper('times', function(n, block) {
        var accum = '';
        for(var i = 0; i < n; ++i)
            accum += block.fn({...this, index: i, index1: (i+1)});
        return accum;
    });


    Handlebars.registerHelper('fieldOrInput', function(name, options) {
        if(typeof name == "object")
        {
        name = name.string;
        }

        const value = options.hash.value ?? (foundry.utils.getProperty(options.data.root,name)??"") ;
        
        if(options.data.root.isVerrou) {
        return new Handlebars.SafeString('<span class="field-value">' + value + '</span>');
        } else { 
        if(options.hasOwnProperty("fn"))
        {
            return options.fn();  
        }
        return  new Handlebars.SafeString('<input type="' + (options.hash.type??"text") + '" name="' + name + '" value="' + value + '" class="'+(options.hash.class??"")+'" placeholder="'+(options.hash.placeholder??"")+'"/>');
        }    
    });

    Handlebars.registerHelper('ternary', function(condition, trueValue, falseValue) {
        if (condition) {
            return trueValue;
        } else {
            return falseValue;
        }
    });

    Handlebars.registerHelper("array", function(...args) {
        args.pop();
        return args;
    });
}