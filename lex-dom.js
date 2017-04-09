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


    /** Creates a new element
    (tag -- element)
    */
    interp.add_generic_entry("create_element", interp => {
        let param_tag = interp.pop() 
        let element = document.createElement(param_tag.value)
        let param_object = new DOMParam(element)
        interp.push(param_object)
    })


    /** Appends an element to a parent element
    (parent child -- )
    */
    interp.add_generic_entry("append_child", interp => {
        let param_child = interp.pop() 
        let param_parent = interp.pop() 
        let parent = param_parent.value
        parent.appendChild(param_child.value)
    })


    /** Wraps an element in an li
    (element -- )
    */
    interp.add_generic_entry("li_wrap", interp => {
        let param_element = interp.pop() 
        let li = document.createElement("li")
        li.appendChild(param_element.value)
        interp.push(new DOMParam(li))
    })



    /** Sets attribute of an element
    (element attr value -- )
    */
    interp.add_generic_entry("!attr", interp => {
        let param_value = interp.pop() 
        let param_attr = interp.pop() 
        let param_element = interp.pop() 
        let element = param_element.value

        element.setAttribute(param_attr.value, param_value.value)
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
