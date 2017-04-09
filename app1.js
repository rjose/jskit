let _interp = new Interpreter([add_basic_lexicon,
                               add_sequence_lexicon,
                               add_dom_lexicon,
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
        # Creates a div.blue_box
        # ( -- bluebox )
        : blue_box  "div" create_element
                    dup "class" "blue_box" !attr
        ;

        # Adds a DOM element as an li to the content list
        # ( element -- )
        : ++   li_wrap
               "content" elem
               swap append_child
        ;
    `
    $k(init)
    $k("blue_box ++")
});
