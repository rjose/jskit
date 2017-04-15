/** Wraps a sequence
*/
class SequenceParam extends Param {
    constructor(value) {
        super('C', value)
        this.custom_type = "[?]"
    }
}


/** Indicates the beginning of a sequence
*/
class BeginSequenceParam extends Param {
    constructor(value) {
        super('C', value)
        this.custom_type = "["
    }
}


/** Adds lexicon for manipulating sequences of Param
*/
function add_sequence_lexicon(interp) {

    // --------------------------------------------------------------------
    /** Marks beginning of sequence
    ( -- BeginSequence)
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("[", interp => {
        interp.push(new BeginSequenceParam())
    })


    // --------------------------------------------------------------------
    /** Constructs sequence
    ( [ x1 x2 ... -- [?])
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("]", interp => {
        let value = []
        
        let param = interp.pop()
        while(!(param instanceof BeginSequenceParam)) {
            if (!param) {
                interp.handle_error("Could not find beginning of sequence")
                return
            }

            value.unshift(param)
            param = interp.pop()
        }
        interp.push(new SequenceParam(value))
    })


    // --------------------------------------------------------------------
    /** Pops sequence, copies it, and pushes reversed copy
    ( [?] -- [?] )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("reverse", interp => {
        let param_sequence = interp.pop()
        let copy = param_sequence.value.slice()
        copy.reverse()

        interp.push(new SequenceParam(copy))
    })


    // --------------------------------------------------------------------
    /** Appends a param to a sequence
    ( [?] x -- )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("append", interp => {
        let param_obj = interp.pop()
        let param_sequence = interp.pop()

        param_sequence.value.push(param_obj)
    })


    // --------------------------------------------------------------------
    /** Unshift a param to a sequence
    ( [?] x -- )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("unshift", interp => {
        let param_obj = interp.pop()
        let param_sequence = interp.pop()

        param_sequence.value.unshift(param_obj)
    })


    // --------------------------------------------------------------------
    /** Gets nth element of a sequence
    ( [?] n -- x_n)
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("nth", interp => {
        let param_n = interp.pop()
        let param_sequence = interp.pop()

        let x_n = param_sequence.value[param_n.value]
        interp.push(x_n)
    })


    // --------------------------------------------------------------------
    /** Deletes nth element of a sequence
    ( [?] n -- [?])
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("del", interp => {
        let param_n = interp.pop()
        let param_sequence = interp.pop()

        // Remove nth item
        param_sequence.value.splice(param_n.value, 1)

        interp.push(param_sequence)
    })


    // --------------------------------------------------------------------
    /** Zips two sequences together
    ( [?1] [?2] --[[?1 ?2]])
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("zip", interp => {
        let param_sequence2 = interp.pop()
        let param_sequence1 = interp.pop()

        let sequence1 = param_sequence1.value
        let sequence2 = param_sequence2.value

        let len = Math.min(sequence2.length, sequence1.length)
        let result = []
        for (let i=0; i < len; i++) {
            let v1 = sequence1[i]
            let v2 = sequence2[i]
            result.push(new SequenceParam([v1, v2]))
        }

        interp.push(new SequenceParam(result))
    })



    // --------------------------------------------------------------------
    /** Maps a string against elements of a sequence
    ( [a] str -- [b])
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("map", interp => {
        let param_string = interp.pop()
        let param_sequence = interp.pop()

        let string = param_string.value
        let sequence = param_sequence.value

        string = string.replace(/'/g, '"')

        let result = []
        sequence.forEach(param => {
            interp.push(param)
            interp.interpret_string(string)
            result.push(interp.pop())
        })
        interp.push(new SequenceParam(result))
    })

    // --------------------------------------------------------------------
    /** Creates a sequence of integers
    (n1 n2 -- [?])
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("to", interp => {
        let param_n2 = interp.pop()
        let param_n1 = interp.pop()

        let n1 = param_n1.value
        let n2 = param_n2.value
        let increment = n1 < n2 ? 1 : -1
        let cur = n1
        let result = []
        while (cur <= n2) {
            result.push(new IntParam(cur))
            cur++
        }
        interp.push(new SequenceParam(result))
    })


    // --------------------------------------------------------------------
    /** Pushes stack as a sequence of Params
    ( ... -- [Param])
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("push-stack", interp => {
        let result = []
        interp.stack.forEach(p => result.push(p))
        interp.push(new SequenceParam(result))
    })
}
