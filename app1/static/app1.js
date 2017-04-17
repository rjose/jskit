let _interp = new Interpreter([add_basic_lexicon,
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
    $k("blue_box ++")
});
