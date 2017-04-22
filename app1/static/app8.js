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
    let init = `
        "app2-canvas" "engine" load_engine
        engine @ "scene" make_scene
        "Omni" [ 0 100 100 Vector3  scene @ ] "new BABYLON.PointLight" make_named
        "Camera" [ 0 0.8 100 ZERO_VEC3  scene @ ] "new BABYLON.ArcRotateCamera" make_named
        [ "app2-canvas" elem  false ] [ Camera @  "attachControl" ] objcall pop

        "treesManager" [ "/static/external/palm.png" 2000 800 scene @ ] "new BABYLON.SpriteManager" make_named
        "tree1" [ treesManager @ ] "new BABYLON.Sprite" make_named

        10 [ tree1 @ "size" ] !
        10 [ tree1 @ "position.x" ] !

        # Render
        engine @  scene @ run
    ` // END init


    $k(init)
});
