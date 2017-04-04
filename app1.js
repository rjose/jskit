let _interp = new Interpreter([add_basic_lexicon,
                               add_sequence_lexicon,
                               add_dom_lexicon,
                               add_babylon_lexicon])

function $k(str) {
    _interp.interpret_string(str)
}

document.addEventListener("DOMContentLoaded", function(event) {
    $k(`# ( seq str -- )
        : foreach  map pop ;`) 
    $k(`[ 1 2 3 ] "2 *" foreach .s`)
//    $k(`[ 1 2 3 ] "2 *" map .s`)
});
