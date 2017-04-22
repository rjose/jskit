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

        # Create spheres
        "Sphere1"  [ 10 6  scene @ ] "BABYLON.Mesh.CreateSphere" make_named
        "Sphere2"  [ 10 6  scene @ ] "BABYLON.Mesh.CreateSphere" make_named
        "Sphere3"  [ 10 6  scene @ ] "BABYLON.Mesh.CreateSphere" make_named

        -40 Sphere1 @ set_x
        -30 Sphere2 @ set_x

        # Apply material
        "texture1" [ scene @ ] "new BABYLON.StandardMaterial" make_named
#        0.5 [ texture1 @ "alpha" ] !
        [ "/static/external/grass.jpg" scene @ ] "new BABYLON.Texture" jscall  [ texture1 @ "diffuseTexture" ] !
#        1.0 0.2 0.7 Color3 [ texture1 @ "diffuseColor" ] !
#        1.0 0.2 0.7 Color3 [ texture1 @ "emissiveColor" ] !
#        1.0 0.2 0.7 Color3 [ texture1 @ "ambientColor" ] !
#        1.0 0.2 0.7 Color3 [ texture1 @ "specularColor" ] !
#        true [ texture1 @ "wireframe" ] !
        32 [ texture1 @ "specularPower" ] !
        texture1 @  [ Sphere1 @  "material" ] !

        engine @  scene @ run
    ` // END init



    $k(init)
});
