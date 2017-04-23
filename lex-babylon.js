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

        # Creates a variable varname and an accessor for it
        # ( varname -- )
        : mk_@var  "pop
                   : @\\0  \\0 @ ;" , execute
        ;


        # Makes a named Babylon object
        # This can be used with any function that takes a name as the first arg
        # ( name args func_str -- )
        : make_named  [ ARG0 ARG1 ARG2 ] args
           ARG1 @  ARG0 @ unshift   ARG1 @  # Put name at the front of the args
           ARG2 @  ARG0 @ jscall_mkvar

           # Create accessor word
           ARG0 @ mk_@var
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
