/** Interprets Forth strings
*/
class Interpreter {
    /** Creates an interpreter and initializes its state

    \param lexicons: Array of add lexicon functions
    */
    constructor(lexicons) {
        this.stack = []
        this.return_stack = []
        this.dictionary = []
        this.mode = 'E'
        this.input_string_stack = []
        this.latest_entry = null

        // Adds the key entries for defining new words
        this.add_entry(new StartDefinitionEntry(":"))
        this.add_entry(new EndDefinitionEntry(";"))

        // Add lexicons
        lexicons.forEach(lex => lex(this))
    }


    /** Adds a new entry to the dictionary
    */
    add_entry(entry) {
        this.dictionary.push(entry)
    }


    /** Helper function to add entries with user-specified routines
    */
    add_generic_entry(word, routine) {
        this.add_entry(new GenericEntry(word, routine))
    }


    /** If an error occurs, reset the state (other than the dictionary) and log a message
    */
    handle_error(message) {
        this.stack = []
        this.return_stack = []
        this.mode = 'E'
        this.input_string_stack = []
        console.error(message)
    }


    /** Pushes a Param onto the stack
    */
    push(param) {
        this.stack.push(param)
        //document.dispatchEvent(new Event("stack-change"))
    }


    /** Peeks at a position in the stack
    */
    peek(pos) {
        return this.stack[this.stack.length - pos - 1]
    }


    /** Pops a Param off the stack
    */
    pop() {
        let result = this.stack.pop()
        return result
    }


    /** Pushes an IP onto the return stack
    */
    push_return_stack(ip) {
        this.return_stack.push(ip)
    }


    /** Pops IP from return stack
    */
    pop_return_stack() {
        let result = this.return_stack.pop()
        return result
    }


    /** Returns current IP (top of return stack)
    */
    get_ip() {
        let len = this.return_stack.length
        if (len == 0) {
            handle_error("Return stack is empty")
            return
        }
        let result = this.return_stack[len-1]
        return result
    }


    /** Increments current IP (top of return stack)
    */
    increment_ip() {
        let len = this.return_stack.length
        if (len == 0) {
            handle_error("Return stack is empty")
            return
        }
        this.return_stack[len-1]++
    }


    push_input_string(str) {
        this.input_string_stack.push(str)
    }


    pop_input_string(str) {
        let result = this.input_string_stack.pop()
        return result
    }

    /** Finds the most recent entry in the dictionary matching the word
    */
    find_entry(word) {
        for (let i=this.dictionary.length - 1; i >= 0; i--) {
            let entry = this.dictionary[i]
            if (entry.word == word) {
                return this.dictionary[i]
            }
        }
        return null
    }


    /** Interprets a string
    */
    interpret_string(str) {
        // Remove comments
        str = str.split(/#.*\n/).join(" ").trim()

        // Convert newlines to spaces
        str = str.replace(/\n/g, ' ')

        // Set up to start interpreting the string
        this.push_input_string(str)

        let token = null
        while(token = this.get_token()) {
            if (this.mode == 'C') {
                this.compile_token(token)
            }
            else {
                this.execute_token(token)
            }
        }

        this.pop_input_string()
    }


    /** Compiles a token into the latest definition
    */
    compile_token(token) {
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
                    this.latest_entry.add_entry_param(new EntryParam(entry, this))
                }
                break;

            case 'I':
                this.latest_entry.add_entry_param(new IntParam(parseInt(token.value), this), this)
                break;

            case 'D':
                this.latest_entry.add_entry_param(new DoubleParam(parseFloat(token.value), this), this)
                break;

            case 'S':
                this.latest_entry.add_entry_param(new StringParam(token.value, this), this)
                break;

            default:
                this.handle_error("Can't handle token: " + token.value)
        }
    }



    /** Executes a token
    */
    execute_token(token) {
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


    /** Extracts next token from the string at the top of the input_string_stack

    The top of the input_string_stack is modified to remove the token. If no token
    could be parsed, this returns null
    */
    get_token() {
        // If no strings, return null
        let len = this.input_string_stack.length
        if (len == 0) return null

        // Get the top of the input_string stack
        let input_string = this.input_string_stack[len-1]
        if (input_string == '') return null

       let match = null
       let result = null

       if (match = input_string.match(/^(-?\d+\.\d*)(.*)/)) {
          input_string = match[2].trim()
          result = {type: 'D', value: match[1]}
       }
       else if (match = input_string.match(/^(-?\d+)(.*)/)) {
          input_string = match[2].trim()
          result = {type: 'I', value: match[1]}
       }
       else if (match = input_string.match(/^"([^"]*)"(.*)/)) {
          input_string = match[2].trim()
          result = {type: 'S', value: match[1]}
       }
       else if (match = input_string.match(/^(\S+)(.*)/)) {
          input_string = match[2].trim()
          result = {type: 'W', value: match[1]}
       }

      // Replace top of stack with new string
      this.input_string_stack[len-1] = input_string
      return result
    }

}
