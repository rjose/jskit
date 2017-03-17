// -----------------------------------------------------------------------------
// Hello, World
// -----------------------------------------------------------------------------
let chap1_forth = `
   # NOTE: In all constructors, the name of the item being constructed is the first
   #       parameter. This creates a variable that can be fetched via @<name>
   #
   #       Also, any functions that require a scene or engine will automatically use
   #       @cur-engine and @cur-scene

   # Creates an engine and sets @cur-engine to it
   "engine1" "gameCanvas" Engine

   # Creates a new scene and sets @cur-scene to it
   "scene1" Scene

   "camera1"  5 5 -5 Vector3  FreeCamera
   0 0 0 Vector3  @camera1  setTarget

   "light1" 0 1 0 Vector3  HemisphericLight

   "cube1" 1 Mesh.CreateBox

   # Execute engine.runRenderLoop
   run
`

// -----------------------------------------------------------------------------
// Exercise 1
// -----------------------------------------------------------------------------
let ex1_forth = `
   "engine2" "ex1" Engine  "scene2" Scene

   "camera2"  3 1.5 -5 Vector3  FreeCamera
   3 0 0 Vector3  @camera2  setTarget

   "light2" 0 1 0 Vector3  HemisphericLight

   1 6 to  "'cube1-\\0' 0.5 Mesh.CreateBox" map
   1 6 to  "pop \\0  @cube1-\\0  !position.x" map

   run
`

document.addEventListener("DOMContentLoaded", function(event) {
    $k(chap1_forth)
    $k(ex1_forth)
});
