/** Wraps a Babylon object
*/
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
        interp.interpret_string(make_var_str)
        interp.interpret_string(make_accessor_str)
    }


    // --------------------------------------------------------------------
    // Adds a Babylon object along with accessor variables
    // --------------------------------------------------------------------
    function add_babylon_object(object, name, type) {
        make_var(name)
        let param_object = new BabylonParam(object, type)
        interp.push(param_object)
        interp.interpret_string(name + ' !')
    }


    // --------------------------------------------------------------------
    // Add variables and accessors
    // --------------------------------------------------------------------
    make_var("cur-engine")
    make_var("cur-scene")

    function get_cur_engine() {
        interp.interpret_string('@cur-engine')
        let param_engine = interp.pop()
        return param_engine.value
    }


    function get_cur_scene() {
        interp.interpret_string('@cur-scene')
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

        interp.interpret_string('@' + name + ' cur-engine !')
    })


    // --------------------------------------------------------------------
    /** Creates a Babylon scene
    ( name -- )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("Scene", interp => {
        interp.interpret_string('@cur-engine')

        let param_engine = interp.pop()
        let param_name = interp.pop()
        let name = param_name.value

        let scene = new BABYLON.Scene(param_engine.value)

        add_babylon_object(scene, name, "Scene")

        interp.interpret_string('@' + name + ' cur-scene !')
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
    /** Creates a Color3
    ( r g b -- Color3)
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("Color3", interp => {
        let b = pop_double()
        let g = pop_double()
        let r = pop_double()

        let color = new BABYLON.Color3(r, g, b)
        let param_color = new BabylonParam(color, "Color3")
        interp.push(param_color)
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
    /** Creates a Sphere
    ( name segments diameter -- )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("Mesh.CreateSphere", interp => {
        let cur_scene = get_cur_scene()

        let diameter = pop_double()
        let segments = pop_double()
        let param_name = interp.pop()
        let name = param_name.value

        let sphere = BABYLON.Mesh.CreateSphere(name, segments, diameter, cur_scene)
        add_babylon_object(sphere, name, "Sphere")
    })


    // --------------------------------------------------------------------
    /** Creates Ground
    ( name width depth subdivisions -- )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("Mesh.CreateGround", interp => {
        let cur_scene = get_cur_scene()

        let subdivisions = pop_double()
        let depth = pop_double()
        let width = pop_double()
        let param_name = interp.pop()
        let name = param_name.value

        let ground = BABYLON.Mesh.CreateGround(name, width, depth, subdivisions, cur_scene)
        add_babylon_object(ground, name, "Ground")
    })


    // --------------------------------------------------------------------
    /** Sets the x position of an object
    ( object value --  )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("!position.x", interp => {
        let param_value = interp.pop()
        let param_object = interp.pop()

        param_object.value.position.x = param_value.get_value()
    })


    // --------------------------------------------------------------------
    /** Sets the y position of an object
    ( object value --  )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("!position.y", interp => {
        let param_value = interp.pop()
        let param_object = interp.pop()

        param_object.value.position.y = param_value.get_value()
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
    /** Attaches camera to canvas so it can be controlled with the mouse
    ( camera canvas -- )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("attachControl", interp => {
        let param_canvas = interp.pop()
        let param_camera = interp.pop()
        param_camera.value.attachControl(param_canvas.value)
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
    ( engine scene -- )
    */
    // --------------------------------------------------------------------
    interp.add_generic_entry("run", interp => {
        let param_scene = interp.pop()
        let param_engine = interp.pop()

        let cur_engine = param_engine.value
        let cur_scene = param_scene.value

        window.addEventListener('resize', function() {
            cur_engine.resize();
        });

        cur_engine.runRenderLoop(function() {
            cur_scene.render()
        })
    })


    // --------------------------------------------------------------------
    // Add forth-defined words
    // --------------------------------------------------------------------
    interp.interpret_string(`
        # Loads Babylon engine
        # ( canvas_id  name -- )
        : load_engine  [ ARG0 ARG1 ] args
                       [ ARG0 @ elem  true ] "new BABYLON.Engine"  ARG1 @  jscall_mkvar
        ;


        # Creates a scene
        # ( engine name -- )
        : make_scene  [ ARG0 ARG1 ] args
                      [ ARG0 @ ] "new BABYLON.Scene"  ARG1 @  jscall_mkvar
        ;

        # Makes a named Babylon object
        # This can be used with any function that takes a name as the first arg
        # ( name args func_str -- )
        : make_named  [ ARG0 ARG1 ARG2 ] args
           ARG1 @  ARG0 @ unshift   ARG1 @  # Put name at the front of the args
           ARG2 @  ARG0 @ jscall_mkvar
        ;


        # Sets a camera's target
        # ( vec3 camera -- )
        : set_target  [ ARG0 ARG1 ] args
                      [ ARG0 @ ] [ ARG1 @ @  "setTarget" ] objcall pop ;


        # Zero vector
        # ( -- vec3 )
        : ZERO_VEC3  0 0 0 Vector3 ;


        # Sets x position of object
        # ( val obj -- )
        : set_x  [ ARG0 ARG1 ] args
                 ARG0 @  [ ARG1 @ "position" "x" ] !field
        ;
    `)
}
