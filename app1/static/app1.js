let _interp = new Interpreter([add_basic_lexicon,
                               add_js_lexicon,
                               add_sequence_lexicon,
                               add_dom_lexicon,
                               add_ajax_lexicon,
                               add_babylon_lexicon])

function $k(str) {
    _interp.interpret_string(str)
}


document.addEventListener("DOMContentLoaded", function(event) {
    // Hook up command line input
    let cli = document.getElementById("cli-input")
    cli.addEventListener("keydown", kb_event => {
        if (kb_event.key == "Enter") {
            $k(cli.value)
            cli.select()
        }
    })

    let init = `
        # Creates a version of a function that does a swap before application
        # ( func_name -- )
        : make_swap_version
            "pop
             : s_\\0  swap \\0 ;" , execute
        ;

        [ "append" "append_child" "del" ]  "make_swap_version" foreach


        # Sets up a content variable that stores a list of the displayed content
        "content" variable
        : @content  content @ ;
        [ ] content !

        # Creates a div.blue_box
        # ( -- bluebox )
        : blue_box  "div" create_element
                    dup "class" "blue_box" !attr
        ;


        # Creates a div.red_box
        # ( -- redbox )
        : red_box  "div" create_element
                    dup "class" "red_box" !attr
        ;


        # Refreshes UI based on current value of @content
        # ( -- )
        : refresh   "content" elem
                    "innerHTML" "" !prop
                    @content reverse   "li_wrap 'content' elem  s_append_child" foreach
        ;


        # Adds a DOM element to @content
        # ( element -- )
        : ++   @content s_append refresh ;


        # Deletes a content item by its 1-based position
        # ( 1_based_index -- )
        : rem   -1 +
                @content s_del
                refresh
        ;


        # Deletes all content
        # ( -- )
        : remall [ ] content !  refresh ;


        # Gets data from /api/box_data and pushes onto stack as an array of strings
        # ( -- obj )
        : box_data  "/api/box_data" GET parse ;



        # Creates a canvas with the given ID
        # ( id -- canvas )
        : canvas   [ ARG0 ] args
                   "canvas" create_element
                   dup "id" ARG0 @ !attr ;



        : project_view1  "project-view" canvas ++
                         "eng" "project-view" Engine
                         "scene1" Scene
                         "camera1"  5 5 -5 Vector3  FreeCamera
                         "0 0 0 Vector3  @camera1  setTarget" execute

                         "light1" 0 1 0 Vector3  HemisphericLight

                         "cube1" 1 Mesh.CreateBox
                         run
        ;


        : project_view2   "project-view" canvas ++

                         "eng" "project-view" Engine
                         "scene1" Scene
                         "@scene1 'clearColor' 0 1 0 Color3 !field" , execute

                         "camera1"  0 5 -10 Vector3  FreeCamera
                         "@camera1 'project-view' elem  attachControl" , execute
                         "0 0 0 Vector3  @camera1  setTarget" execute

                         "light1" 0 1 0 Vector3  HemisphericLight
                         "@light1 'intensity' 0.7 !field" , execute

                         "sphere1" 16 2 Mesh.CreateSphere
                         "@sphere1 1 !position.y" execute

                         "ground1" 6 6 2 Mesh.CreateGround

                         "cube1" 1 Mesh.CreateBox
                         run
        ;


        : project_view   "project-view" canvas ++

                         # Load Babylon engine
                         [ "project-view" elem  true ] "new BABYLON.Engine" jscall
                         "'engine' variable engine !" , execute

                         # Create Scene
                         "[ engine @ ] 'new BABYLON.Scene' jscall" , execute
                         "'scene' variable scene !" , execute

                         # Change background to green
                         "0 1 0 Color3  [ scene @  'clearColor' ] !field" , execute

                         # Add camera
                         "[ 'camera1'  0 5 -10 Vector3  scene @ ] 'new BABYLON.FreeCamera' jscall" , execute
                         "'camera1' variable camera1 !" , execute
                         "[ 0 0 0 Vector3 ] [ camera1 @  'setTarget' ] objcall pop" , execute
                         "[ 'project-view' elem  false ] [ camera1 @  'attachControl' ] objcall pop" , execute

                         # Add light
                         "[ 'light1'  0 1 0 Vector3  scene @ ] 'new BABYLON.HemisphericLight' jscall" , execute
                         "'light1' variable light1 !" , execute
                         "0.7  [ light1 @  'intensity' ] !field" , execute

                         # Add objects
                         "[ 'sphere1'  16 2  scene @ ] 'BABYLON.Mesh.CreateSphere' jscall" , execute
                         "'sphere1' variable sphere1 !" , execute
                         "1  [ sphere1 @  'position' 'y' ] !field" , execute

                         "[ 'ground1'  6 6 2  scene @ ] 'BABYLON.Mesh.CreateGround' jscall" , execute
                         "[ 'cube1'  1.5  scene @ ] 'BABYLON.Mesh.CreateBox' jscall" , execute

                         # Run render loop
                         "engine @  scene @  run"  execute
        ;


    ` // END init


    /** Adds boxes to content based on an array of strings consisting of "red" and "blue"
    ( obj -- )
    */
    _interp.add_generic_entry("add_boxes", interp => {
        let param_array = interp.pop()
        param_array.value.forEach(s => {
            interp.interpret_string(s + "_box ++")
        })
    })


    $k(init)
    $k("project_view")
});
