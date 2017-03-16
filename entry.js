class Entry {
    constructor(word) {
        this.word = word
        this.immediate = false
        this.complete = true
        this.params = []
    }

    add_entry_param(param) {
        this.params.push(param)
    }

    execute(interp) {
        console.error("The Entry base class cannot be executed!")
    }
}


class GenericEntry extends Entry {
    constructor(word, routine) {
        super(word)
        this.routine = routine
    }

    execute(interp) {
        this.routine(interp)
    }
}


class DefineEntry extends Entry {
    constructor(word) {
        super(word)
    }

    execute(interp) {
        let token = interp.get_token()

        let entry_new = new Definition(token.value)
        entry_new.complete = false
        interp.add_entry(entry_new)

        interp.mode = 'C'
    }
}


class EndDefineEntry extends Entry {
    constructor(word) {
        super(word)
        this.immediate = true
    }

    execute(interp) {
        let entry_latest = interp.get_latest_entry()
        entry_latest.complete = true
        entry_latest.add_entry_param(new PopReturnStackParam(interp))

        interp.mode = 'E'
    }
}


class Definition extends Entry {
    constructor(word) {
        super(word)
    }

    execute(interp) {
        interp.push_return_stack()
        interp.ip = 0
        let should_stop = false
        while(!should_stop) {
            let cur_param = this.params[interp.ip]
            interp.ip++
            should_stop = cur_param.execute()
        }
    }
}
