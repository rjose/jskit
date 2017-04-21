/** Wraps a Javascript object
*/
class JavascriptParam extends Param {
    constructor(value) {
        super('JS', value)
    }
}

function add_js_lexicon(interp) {

    interp.add_generic_entry("true", interp => {
        interp.push(new JavascriptParam(true))
    })

    interp.add_generic_entry("false", interp => {
        interp.push(new JavascriptParam(false))
    })


    /** Sets a field in an object
    (value seq -- )

       seq: [ object field1 ... fieldn ]
    */
    interp.add_generic_entry("!field", interp => {
        let param_seq = interp.pop()
        let param_value = interp.pop()

        let param_object = param_seq.value.shift()
        let object = param_object.value
        let fields = param_seq.value

        // Construct field selector
        let selector = fields.map(param_f => param_f.value).join(".")

        // Construct string to set value
        let value = param_value.value 
        let exec_str = "object." + selector + " = value"
        eval(exec_str)
    })


    /** Executes a javascript function on an object, pushing the result onto the stack
    (param_args param_selector -- js)

     param_selector: [ object field1 ... fieldn ]
    */
    interp.add_generic_entry("objcall", interp => {
        let param_selector = interp.pop() 
        let param_args = interp.pop() 

        let args = param_args.value
        let arg_values = args.map(arg => arg.get_value())

        let param_object = param_selector.value.shift()
        let object = param_object.value
        let fields = param_selector.value
        let selector = fields.map(param_f => param_f.value).join(".")
        let func_str = "object." + selector 

        // Build call string by dynamically referring to param arguments in args
        let call_str = func_str + "("
        for (let i=0; i < args.length; i++) {
            call_str += "arg_values[" + i + "]"
            if (i == args.length - 1) {
                call_str += ")"
            }
            else {
                call_str += ", "
            }
        }
        let res = eval(call_str)
        interp.push(new JavascriptParam(res))
    })


    /** Executes a javascript function, pushing the result onto the stack
    (param_args func_str -- js)
    */
    interp.add_generic_entry("jscall", interp => {
        let param_func_str = interp.pop() 
        let param_args = interp.pop() 

        let args = param_args.value
        let arg_values = args.map(arg => arg.get_value())

        // Build call string by dynamically referring to param arguments in args
        let call_str = param_func_str.value + "("
        for (let i=0; i < args.length; i++) {
            call_str += "arg_values[" + i + "]"
            if (i == args.length - 1) {
                call_str += ")"
            }
            else {
                call_str += ", "
            }
        }
        let obj = eval(call_str)
        interp.push(new JavascriptParam(obj))
    })


    /** Like jscall, but names resulting object with a variable
    (param_args func_str varname -- )
    */
    interp.add_generic_entry("jscall_mkvar", interp => {
        param_varname = interp.pop()
        interp.interpret_string("jscall")

        // Create variable with varname and set its value to the result of the jscall
        interp.push(param_varname)
        interp.interpret_string("variable " + param_varname.value + " !")
    })
}
