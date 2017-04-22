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

        # Create box
        "Box1"  [ 10 scene @ ] "BABYLON.Mesh.CreateBox" make_named
        -20 [ Box1 @ "position.x" ] !

        : ANIMATIONTYPE_FLOAT  "BABYLON.Animation.ANIMATIONTYPE_FLOAT" jseval ;
        : ANIMATIONLOOPMODE_CYCLE  "BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE" jseval ;

        # Create animation
        "myAnimation"  [ "scaling.x" 30 ANIMATIONTYPE_FLOAT ANIMATIONLOOPMODE_CYCLE ] "new BABYLON.Animation" make_named
        myAnimation @ .s

        # Set animation keys
        [ [
            [ "frame" 0  "value" 1 ]
            [ "frame" 20  "value" 0.2 ]
            [ "frame" 100  "value" 1 ]
          ] "Map raw_value" map ]
        [ myAnimation @  "setKeys" ] objcall pop 

        # Apply to Box1
        [ ] [ Box1 @ "animations" ] !
        [ myAnimation @ ] [ Box1 @  "animations.push" ] objcall pop

        # Start animation
        [ Box1 @  0 100 true ] [ scene @  "beginAnimation" ] objcall pop

        # Render
        engine @  scene @ run
    ` // END init



    $k(init)
});
