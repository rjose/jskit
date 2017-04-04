/** Base class for dictionary entries
*/
class Entry {
    constructor(word) {
        this.word = word
        this.immediate = false
        this.params = []
    }

    add_entry_param(param) {
        this.params.push(param)
    }

    execute(interp) {
        console.error("The Entry base class cannot be executed!")
    }
}


/** An entry that can execute a routine
*/
class GenericEntry extends Entry {
    constructor(word, routine) {
        super(word)
        this.routine = routine
    }

    execute(interp) {
        this.routine(interp)
    }
}


/** An entry that begins a definition
*/
class StartDefinitionEntry extends Entry {
    constructor(word) {
        super(word)
    }

    execute(interp) {
        let token = interp.get_token()
        interp.latest_entry = new DefinitionEntry(token.value)
        interp.mode = 'C'
    }
}


class EndDefinitionParam extends Param {
    constructor(interp) {
        super('PopReturnStack', null)
        this.interp = interp
        this.end_definition = true
    }

    execute() {
        this.interp.pop_return_stack()
    }
}


/** An entry that ends a definition
*/
class EndDefinitionEntry extends Entry {
    constructor(word) {
        super(word)
        this.immediate = true
    }

    execute(interp) {
        interp.latest_entry.add_entry_param(new EndDefinitionParam(interp))
        interp.add_entry(interp.latest_entry)
        interp.latest_entry = null
        interp.mode = 'E'
    }
}



class DefinitionEntry extends Entry {
    constructor(word) {
        super(word)
    }

    execute(interp) {
        interp.push_return_stack(0)
        while(true) {
            let cur_param = this.params[interp.get_ip()]
            cur_param.execute()
            if (cur_param.end_definition) break

            interp.increment_ip()
        }
    }
}
