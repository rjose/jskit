/** Wraps a DOM element
*/
class DOMParam extends Param {
    constructor(value) {
        super('H', value)
    }
}


function add_dom_lexicon(interp) {

    /** Looks up an element by its id
    (id_string -- element)
    */
    interp.add_generic_entry("elem", interp => {
        let param_id = interp.pop() 
        let element = document.getElementById(param_id.value)
        let param_object = new DOMParam(element)
        interp.push(param_object)
    })


    /** Converts a parameter to an li element
    (param -- element)
    */
    interp.add_generic_entry("as-li", interp => {
        let param = interp.pop() 
        let li_element = document.createElement("li")
        li_element.appendChild(document.createTextNode(param.type + ": " + param.value))
        interp.push(new DOMParam(li_element))
    })


    /** Replaces content of a container
    ([Element] container_element -- )
    */
    interp.add_generic_entry("replace", interp => {
        let param_container = interp.pop() 
        let param_sequence = interp.pop() 

        let container = param_container.value
        container.innerHTML = ""
        param_sequence.value.forEach(p => container.append(p.value))
    })


    /** Adds an event listener
    (element exec_string event -- )
    */
    interp.add_generic_entry("on", interp => {
        let param_event = interp.pop() 
        let param_exec_string = interp.pop() 
        let param_element = interp.pop() 

        let element = param_element.value

        let exec_string = param_exec_string.value
        exec_string = exec_string.replace(/'/g, '"')

        if (param_event.value == "keydown-enter") {
            element.addEventListener("keydown", kb_event => {
                if (kb_event.key == "Enter") {
                    interp.execute_string(exec_string)
                }
            })
        }
        else {
            element.addEventListener(param_event.value, event => {
                interp.execute_string(exec_string)
            })
        }
    })
}
