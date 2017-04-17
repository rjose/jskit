/** Wraps an Ajax response 
*/
class AjaxResponseParam extends Param {
    constructor(value) {
        super('A', value)
    }
}

class ObjectParam extends Param {
    constructor(value) {
        super('O', value)
    }
}


function add_ajax_lexicon(interp) {

    /** Makes a GET request
    (url -- ajax_response)
    */
    interp.add_generic_entry("GET", interp => {
        let param_url = interp.pop() 

        let request = new XMLHttpRequest();
        request.onreadystatechange  = function() {
            if (request.readyState !== XMLHttpRequest.DONE) return

            if (request.status === 200) {
                let param_response = new AjaxResponseParam(request.responseText)
                interp.push(param_response)
            }
            else {
                interp.handle_error("Error (" + request.status + ") when trying to GET: " + param_url.value)
            }
        }

        let async = false
        request.open('GET', param_url.value, async);
        request.send();
    })


    /** Parses JSON
    (json -- object)
    */
    interp.add_generic_entry("parse", interp => {
        let param_json = interp.pop() 
        let object = JSON.parse(param_json.value)
        interp.push(new ObjectParam(object))
    })


}
