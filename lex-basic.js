/** Wraps a variable so its value can be set or retrieved
*/
class VariableParam extends Param {
    constructor(val) {
        super('V', val)
    }
}

class MapParam extends Param {
    constructor(val) {
        super('Map', val)
    }
}


/** Defines an entry for retrieving a variable

( -- var )
*/
class VariableEntry extends Entry {
    constructor(word) {
        super(word)
        this.var_value = null
    }

    set_value(new_val) {
        this.var_value = new_val
    }

    get_value() {
        return this.var_value
    }

    execute(interp) {
        interp.push(new VariableParam(this))
    }
}


/** Adds a core lexicon to an interpreter
*/
function add_basic_lexicon(interp) {

    /** Multiplies two numbers
    (a b -- c)
    */
    interp.add_generic_entry("*", interp => {
        let param_b = interp.pop()
        let param_a = interp.pop()

        let result = param_a.value * param_b.value
        if (param_a.type == 'I') {
            interp.push(new IntParam(result))
        }
        else if (param_a.type == 'D') {
            interp.push(new DoubleParam(result))
        }
        else {
            interp.handle_error("Don't know how to handle type: " + param_a.type)
        }
    })


    /** Swaps top two elements
    (a b -- b a)
    */
    interp.add_generic_entry("swap", interp => {
        let param_b = interp.pop()
        let param_a = interp.pop()
        interp.push(param_b)
        interp.push(param_a)
    })


    /** Pops an element and throws it away
    (a -- )
    */
    interp.add_generic_entry("pop", interp => {
        interp.pop()
    })

    /** Duplicates an object
    (a -- a a)
    */
    interp.add_generic_entry("dup", interp => {
        let param_a = interp.peek(0)
        interp.push(param_a)
    })


    /** Creates a VariableEntry
    (name -- )
    */
    interp.add_generic_entry("variable", interp => {
        let param_name = interp.pop()
        interp.add_entry(new VariableEntry(param_name.value))
    })



    /** Adds two numbers
    (n1 n2 -- n1+n2)
    */
    interp.add_generic_entry("+", interp => {
        let param_n2 = interp.pop()
        let param_n1 = interp.pop()

        param_n1.value = param_n1.get_value() + param_n2.get_value()
        interp.push(param_n1)
    })




    /** Sets a variable value
        If the top of the stack is a sequence, we treat the first element as an
        object-valued variable and the remaining elements as selectors into that object.
        The selectors determine what field is updated.
    (value var -- )
    (value [ var selector_1 .. selector_n ] -- )
    */
    interp.add_generic_entry("!", interp => {
        let param_variable = interp.pop()
        let param_value = interp.pop()

        if (param_variable.type == "V") {
            param_variable.value.set_value(param_value)
        }
        else {
            let param_seq = param_variable

            let param_object = param_seq.value.shift()
            let object = param_object.value
            let fields = param_seq.value

            // Construct field selector
            let selector = fields.map(param_f => param_f.value).join(".")

            // Construct string to set value
            let value = param_value.value
            let exec_str = "object." + selector + " = value"
            eval(exec_str)
        }
    })


    /** Sets multiple fields of an object
    ([ v1 f1  v2 f2 ... vn fn ] obj -- )
    */
    interp.add_generic_entry("!!", interp => {
        let param_obj = interp.pop()
        let param_pairs = interp.pop()
        let values = param_pairs.value
        if (values.length % 2 != 0) {
            interp.handle_error("Val/field arguments to !! should have an even number of elements")
            return
        }

        let obj = param_obj.value
        for (let i=0; i < values.length; i += 2) {
            let val = values[i].get_value()
            let field = values[i+1].get_value()
            let cmd = "obj." + field + "= val"
            eval(cmd)
        }
    })



    /** Gets a variable value
    (Variable -- value)
    */
    interp.add_generic_entry("@", interp => {
        let param_variable = interp.pop()
        let result = param_variable.value.get_value()
        interp.push(result)
    })


    /** Creates a Map object from a sequence of 2n values
    (param_seq -- Map)
    */
    interp.add_generic_entry("Map", interp => {
        let param_seq = interp.pop()
        let values = param_seq.value
        if (values.length % 2 != 0) {
            interp.handle_error("Arguments to Map should have even number of elements")
            return
        }

        let result = new Map()
        for (let i=0; i < values.length; i += 2) {
            let key = values[i].get_value()
            let val = values[i+1].get_value()
            result[key] = val
        }
        interp.push(new MapParam(result))
    })


    /** Extracts raw value and pushes onto stack
    (param -- raw_value)
    */
    interp.add_generic_entry("raw_value", interp => {
        let param = interp.pop()
        interp.push(param.value)
    })


    /** Expands a macro
    NOTE: We rely on the macro to pop any macro arguments that it uses
    (string... string -- string... string)
    */
    interp.add_generic_entry(",", interp => {
        let param_string = interp.pop()
        let expanded = interp.macro_subst(param_string.value)
        interp.push(new StringParam(expanded, this))
    })


    /** Executes a string
    (string -- )
    */
    interp.add_generic_entry("execute", interp => {
        let param_string = interp.pop()
        interp.interpret_string(param_string.value)
    })


    /** console.log something
    (object -- )
    */
    interp.add_generic_entry("log", interp => {
        let param_object = interp.pop()
        console.log("LOG", param_object)
    })


    /** Print stack
    ( -- )
    */
    interp.add_generic_entry(".s", interp => {
        console.log(interp.stack)
    })


    // Define ARGn variables
    interp.interpret_string(`
        "ARG0" variable
        "ARG1" variable
        "ARG2" variable
        "ARG3" variable
        "ARG4" variable
        "ARG5" variable
        "ARG6" variable
        "ARG7" variable
    `)
}
