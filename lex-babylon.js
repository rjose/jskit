class BabylonParam extends Param {
    constructor(value, babylon_type) {
        super('B', value)
        this.custom_type = babylon_type
    }
}



function add_babylon_lexicon(interp) {

    function pop_double() {
        let param_double = interp.pop()
        let result = parseFloat(param_double.value)
        return result
    }

    // --------------------------------------------------------------------
    // Creates a forth variable with var_name and
    // also creates an accessor called "@<var_name>"
    // --------------------------------------------------------------------
    function make_var(var_name) {
        let make_var_str = '"' + var_name + '" variable'
        let make_accessor_str = ':  @' + var_name + ' ' + var_name + ' @ ; '
        interp.execute_string(make_var_str)
        interp.execute_string(make_accessor_str)
    }


    // --------------------------------------------------------------------
    // Adds a Babylon object along with accessor variables
    // --------------------------------------------------------------------
    function add_babylon_object(object, name, type) {
        make_var(name)
        let param_object = new BabylonParam(object, type)
        interp.push(param_object)
        interp.execute_string(name + ' !')
    }


    // --------------------------------------------------------------------
    // Add variables and accessors
    // --------------------------------------------------------------------
    make_var("cur-engine")
    make_var("cur-scene")

    function get_cur_engine() {
        interp.execute_string('@cur-engine')
        let param_engine = interp.pop()
        return param_engine.value
    }


    function get_cur_scene() {
        interp.execute_string('@cur-scene')
        let param_scene = interp.pop()
        return param_scene.value
    }


    // --------------------------------------------------------------------
    /** Creates a Babylon engine
    ( name canvas_id -- )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("Engine", interp => {
        let param_canvas_id = interp.pop()
        let param_name = interp.pop()

        let canvas_id = param_canvas_id.value
        let name = param_name.value

        let canvas = document.getElementById(canvas_id)
        let engine = new BABYLON.Engine(canvas, true)

        add_babylon_object(engine, name, "Engine")

        interp.execute_string('@' + name + ' cur-engine !')
    })


    // --------------------------------------------------------------------
    /** Creates a Babylon scene
    ( name -- )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("Scene", interp => {
        interp.execute_string('@cur-engine')

        let param_engine = interp.pop()
        let param_name = interp.pop()
        let name = param_name.value

        let scene = new BABYLON.Scene(param_engine.value)

        add_babylon_object(scene, name, "Scene")

        interp.execute_string('@' + name + ' cur-scene !')
    })


    // --------------------------------------------------------------------
    /** Creates a Vector3
    ( x y z -- Vector3)
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("Vector3", interp => {
        let z = pop_double()
        let y = pop_double()
        let x = pop_double()

        let vec = new BABYLON.Vector3(x, y, z)
        let param_vec = new BabylonParam(vec, "Vector3")
        interp.push(param_vec)
    })


    // --------------------------------------------------------------------
    /** Creates a camera
    ( name pos -- )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("FreeCamera", interp => {
        let cur_scene = get_cur_scene()

        let param_pos = interp.pop()
        let param_name = interp.pop()
        let name = param_name.value

        let camera = new BABYLON.FreeCamera(name, param_pos.value, cur_scene)
        add_babylon_object(camera, name, "FreeCamera")
    })


    // --------------------------------------------------------------------
    /** Sets target of a camera
    (  vec3 camera -- )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("setTarget", interp => {
        let param_camera = interp.pop()
        let param_vec3 = interp.pop()
        param_camera.value.setTarget(param_vec3.value)
    })


    // --------------------------------------------------------------------
    /** Creates a HemisphericLight
    ( name pos -- )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("HemisphericLight", interp => {
        let cur_scene = get_cur_scene()

        let param_pos = interp.pop()
        let param_name = interp.pop()
        let name = param_name.value

        let light = new BABYLON.HemisphericLight(name, param_pos.value, cur_scene)
        add_babylon_object(light, name, "HemisphericLight")
    })


    // --------------------------------------------------------------------
    /** Creates a Box
    ( name size -- )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("Mesh.CreateBox", interp => {
        let cur_scene = get_cur_scene()

        let size = pop_double()
        let param_name = interp.pop()
        let name = param_name.value

        let box = BABYLON.Mesh.CreateBox(name, size, cur_scene)
        add_babylon_object(box, name, "Box")
    })


    // --------------------------------------------------------------------
    /** Sets the x position of an object
    ( value object --  )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("!position.x", interp => {
        let param_object = interp.pop()
        let param_value = interp.pop()

        param_object.value.position.x = param_value.get_value()
    })


    // --------------------------------------------------------------------
    /** Sets the value of an object's field (can be nested)
    ( value object field --  )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("!field", interp => {
        let param_field = interp.pop()
        let param_object = interp.pop()
        let param_value = interp.pop()

        let fields = param_field.value.split(".")
        let last_field = fields.pop()
        let obj = param_object.value
        for (let i=0; i < fields.length; i++) {
            obj = obj[fields[i]]
        }
        obj[last_field] = param_value.get_value()
    })


    // --------------------------------------------------------------------
    /** Gets the value of an object's field (can be nested)
    ( object field --  )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("@field", interp => {
        let param_field = interp.pop()
        let param_object = interp.pop()

        let fields = param_field.value.split(".")
        let last_field = fields.pop()
        let obj = param_object.value
        for (let i=0; i < fields.length; i++) {
            obj = obj[fields[i]]
        }
        let result = obj[last_field]
        let param_result = new BabylonParam(result, param_field.value)
        interp.push(param_result)
    })

    // --------------------------------------------------------------------
    /** Enable/disable debug
    ( scene val -- )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("debug", interp => {
        let param_val = interp.pop()
        let param_scene = interp.pop()
        if (param_val.get_value()) {
            param_scene.value.debugLayer.show()
        }
        else {
            param_scene.value.debugLayer.hide()
        }
    })

    // --------------------------------------------------------------------
    /** Run render loop
    ( -- )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("run", interp => {
        let cur_engine = get_cur_engine()
        let cur_scene = get_cur_scene()

        cur_engine.runRenderLoop(function() {
            cur_scene.render()
        })
    })
}
