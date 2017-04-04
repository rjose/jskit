/** A Param can be pushed onto the stack and can be compiled
    into an entry definition
*/
class Param {
    constructor(type, value, interp) {
        this.type = type
        this.value = value
        this.custom_type = ''
        this.interp = interp
    }

    /** Returns the wrapped value of a Param
    */
    get_value() {
        switch(this.type) {
            case 'I':
                return parseInt(this.value)

            case 'D':
                return parseFloat(this.value)

            default:
                return this.value
        }
    }

    /** The default action for a Param is to push itself onto the stack
    */
    execute() {
        this.interp.push(this)
    }
}


/** This wraps a Double in a Param
*/
class DoubleParam extends Param {
    constructor(val_double, interp) {
        super('D', val_double, interp)
    }
}


/** This wraps an Int in a Param
*/
class IntParam extends Param {
    constructor(val_int, interp) {
        super('I', val_int, interp)
    }
}


/** This wraps a String in a Param
*/
class StringParam extends Param {
    constructor(val_string, interp) {
        super('S', val_string, interp)
    }
}


/** This wraps an Entry in a Param
*/
class EntryParam extends Param {
    constructor(entry, interp) {
        super('E', entry, interp)
    }

    execute() {
        this.value.execute(this.interp)
    }
}

