class VariableParam extends Param {
    constructor(val) {
        super('V', val)
    }
}


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


    /** Creates a VariableEntry
    (name -- )
    */
    interp.add_generic_entry("variable", interp => {
        let param_name = interp.pop() 
        interp.add_entry(new VariableEntry(param_name.value))
    })


    /** Sets a variable value
    (value Variable -- )
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
}
