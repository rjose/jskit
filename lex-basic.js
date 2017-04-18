/** Wraps a variable so its value can be set or retrieved
*/
class VariableParam extends Param {
    constructor(val) {
        super('V', val)
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


    /** Sets an object property
    (obj prop value -- )
    */
    interp.add_generic_entry("!prop", interp => {
        let param_value = interp.pop()
        let param_prop = interp.pop()
        let param_obj = interp.pop()

        let prop = param_prop.value
        let value = param_value.value

        param_obj.value[prop] = value
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
    (value var -- )
    */
    interp.add_generic_entry("!", interp => {
        let param_variable = interp.pop()
        let param_value = interp.pop()
        param_variable.value.set_value(param_value)
    })


    /** Gets a variable value
    (Variable -- value)
    */
    interp.add_generic_entry("@", interp => {
        let param_variable = interp.pop()
        let result = param_variable.value.get_value()
        interp.push(result)
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
