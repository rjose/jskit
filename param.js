class Param {
    constructor(type, value) {
        this.type = type
        this.value = value
        this.custom_type = ''
    }

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
}

class DoubleParam extends Param {
    constructor(val_double) {
        super('D', val_double)
    }
}


class IntParam extends Param {
    constructor(val_int) {
        super('I', val_int)
    }
}


class StringParam extends Param {
    constructor(val_string) {
        super('S', val_string)
    }
}

class EntryParam extends Param {
    constructor(entry, interp) {
        super('E', entry)
        this.interp = interp
    }

    execute() {
        this.value.execute(this.interp)
    }
}

class PushLiteralParam extends Param {
    constructor(value, interp) {
        super('P', value)
        this.interp = interp
    }

    execute() {
        this.interp.push(this.value)
    }
}

class PopReturnStackParam extends Param {
    constructor(interp) {
        super('P', null)
        this.interp = interp
    }

    execute() {
        this.interp.pop_return_stack()
        return true  // Should stop
    }
}
