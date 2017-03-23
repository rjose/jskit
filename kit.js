class Interpreter {
    constructor() {
        this.stack = []
        this.return_stack = []
        this.dictionary = []
        this.mode = 'E'
        this.ip = 0
        this.input_string = ""
        this.input_string_stack = []

        this.build_dictionary()
    }

    build_dictionary() {
        this.add_entry(new DefineEntry(":"))
        this.add_entry(new EndDefineEntry(";"))
    }

    add_entry(entry) {
        this.dictionary.push(entry)
    }

    add_generic_entry(word, routine) {
        this.add_entry(new GenericEntry(word, routine))
    }

    handle_error(message) {
        this.stack = []
        this.return_stack = []
        this.mode = 'E'
        this.ip = 0
        console.error(message)
    }

    push(param) {
        this.stack.push(param)
    }

    peek(pos) {
        return this.stack[this.stack.length - pos - 1]
    }

    pop() {
        return this.stack.pop()
    }

    push_return_stack() {
        this.return_stack.push(this.ip)
    }

    pop_return_stack() {
        this.ip = this.return_stack.pop()
    }

    get_latest_entry() {
        return this.dictionary[this.dictionary.length-1];
    }

    find_entry(word) {
        for (let i=this.dictionary.length - 1; i >= 0; i--) {
            let entry = this.dictionary[i]
            if (entry.word == word && entry.complete) {
                return this.dictionary[i]
            }
        }
        return null
    }


    compile(token) {
        let entry_latest = this.dictionary[this.dictionary.length-1]
        switch(token.type) {
            case 'W':
                let entry = this.find_entry(token.value)
                if (!entry) {
                    this.handle_error("Unknown entry: " + token.value)
                    return
                }
                else if (entry.immediate) {
                    entry.execute(this)
                }
                else {
                    entry_latest.add_entry_param(new EntryParam(entry, this))
                }
                break;

            case 'I':
                entry_latest.add_entry_param(new PushLiteralParam(new IntParam(parseInt(token.value)), this))
                break;

            case 'D':
                entry_latest.add_entry_param(new PushLiteralParam(new DoubleParam(parseFloat(token.value)), this))
                break;

            case 'S':
                entry_latest.add_entry_param(new PushLiteralParam(new StringParam(token.value), this))
                break;

        }
    }



    push_input_string(str) {
        this.input_string_stack.push(this.input_string)
        this.input_string = str
    }

    pop_input_string() {
        this.input_string = this.input_string_stack.pop()
    }


    execute_string(str) {
        // Remove comments
        str = str.split(/#.*\n/).join(" ").trim()

        // Convert newlines to spaces
        str = str.replace(/\n/g, ' ')

        // TODO: Check in kit if this is what should be done
        this.push_input_string(str)

        let token = null
        while(token = this.get_token()) {
            if (this.mode == 'C') {
                this.compile(token)
                continue
            }

            // If executing...
            switch(token.type) {
                case 'D':
                    this.stack.push(new DoubleParam(token.value))
                    break;

                case 'I':
                    this.stack.push(new IntParam(token.value))
                    break;

                case 'S':
                    this.stack.push(new StringParam(token.value))
                    break;

                case 'W':
                    let entry = this.find_entry(token.value)
                    if (entry) {
                        entry.execute(this)
                    }
                    else {
                        this.handle_error("Can't find entry: " + token.value)
                    }
                    break;

                default:
                    this.handle_error("Can't handle token: " + token.value)
            }
        }

        this.pop_input_string()
    }


    get_token() {
        if (this.input_string == '') return null

       let match = null

       if (match = this.input_string.match(/^(-?\d+\.\d*)(.*)/)) {
          this.input_string = match[2].trim()
          return {type: 'D', value: match[1]}
       }
       else if (match = this.input_string.match(/^(-?\d+)(.*)/)) {
          this.input_string = match[2].trim()
          return {type: 'I', value: match[1]}
       }
       else if (match = this.input_string.match(/^"([^"]*)"(.*)/)) {
          this.input_string = match[2].trim()
          return {type: 'S', value: match[1]}
       }
       else if (match = this.input_string.match(/^(\S+)(.*)/)) {
          this.input_string = match[2].trim()
          return {type: 'W', value: match[1]}
       }

      console.log("Skipping", this.input_string)
      return null
    }
}


let _interp = new Interpreter()

add_basic_lexicon(_interp)
add_sequence_lexicon(_interp)
add_babylon_lexicon(_interp)

function $k(str) {
    _interp.execute_string(str)
}
