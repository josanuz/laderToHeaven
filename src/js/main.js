var canvas, engine, scene, camera, score = 0;
var TOAD_MODEL;
var ENDINGS = [];
var ENEMIES = [];
// Number of lanes
var LANE_NUMBER = 3;
// Space between lanes
var LANE_INTERVAL = 5;
var LANES_POSITIONS = [];

// The function onload is loaded when the DOM has been loaded
document.addEventListener("DOMContentLoaded", function () {
    onload();
}, false);

// Resize the babylon engine when the window is resized
window.addEventListener("resize", function () {
    if (engine) {
        engine.resize();
    }
},false);

/**
 * Onload function : creates the babylon engine and the scene
 */
var onload = function () {
    // Engine creation
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);

    // Scene creation
    initScene();

    // The render function
    engine.runRenderLoop(function () {
        scene.render();
        ENEMIES.forEach(function (shroom) {
            if (shroom.killed) {
                // Nothing to do here
            } else {
                shroom.position.z -= 0.9;
            }
        });
    });

};

var initScene = function() {
    // Get canvas
    canvas = document.getElementById("renderCanvas");

// Create babylon engine
    engine = new BABYLON.Engine(canvas, true);
// Create scene
        scene = new BABYLON.Scene(engine);
// Create the camera
    camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,4,-10), scene);
    camera.setTarget(new BABYLON.Vector3(0,0,10));
    camera.attachControl(canvas);

// Create light
    var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0,5,-5), scene);

    BABYLON.SceneLoader.ImportMesh("red_toad", "assets/", "toad.babylon", scene, function (meshes) {
        var m = meshes[0];
        m.isVisible = false;
        m.scaling = new BABYLON.Vector3(0.5,0.5,0.5);
        TOAD_MODEL = m;
    });

/**SkyBox**/
var skybox = BABYLON.Mesh.CreateBox("skyBox", 1400.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
/********/
    //scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    //scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);
    //scene.fogDensity = 0.003;

    initGame();


};

var initGame  = function(){



    // Function to create lanes
    var createLane = function (id, position) {
        var lane = BABYLON.Mesh.CreateBox("lane"+id, 1, scene);
        lane.scaling.y = 0.1;
        lane.scaling.x = 3;
        lane.scaling.z = 800;
        lane.position.x = position;
        lane.position.z = lane.scaling.z/2-200;
    };

    var createEnding = function (id, position) {
        var ending = BABYLON.Mesh.CreateGround(id, 3, 4, 1, scene);
        ending.position.x = position;
        ending.position.y = 0.1;
        ending.position.z = 1;
        var mat = new BABYLON.StandardMaterial("endingMat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.8,0.2,0.2);
        ending.material = mat;
        return ending;
    };

    var currentLanePosition = LANE_INTERVAL * -1 * (LANE_NUMBER/2);
    for (var i = 0; i<LANE_NUMBER; i++){
        LANES_POSITIONS[i] = currentLanePosition;
        createLane(i, currentLanePosition);
        var e = createEnding(i, currentLanePosition);
        ENDINGS.push(e);
        currentLanePosition += LANE_INTERVAL;
    }

    // Adjust camera position
    camera.position.x = LANES_POSITIONS[Math.floor(LANE_NUMBER/2)];
}
// Creates a shroom in a random lane
var createEnemy = function () {
    // The starting position of toads
    var posZ = 1000;

    // Get a random lane
    var posX = LANES_POSITIONS[Math.floor(Math.random() * LANE_NUMBER)];

    // Create a clone of our template
    var shroom = TOAD_MODEL.clone(TOAD_MODEL.name);

    shroom.id = TOAD_MODEL.name+(ENEMIES.length+1);
    // Our toad has not been killed yet !
    shroom.killed = false;
    // Set the shroom visible
    shroom.isVisible = true;
    // Update its position
    shroom.position = new BABYLON.Vector3(posX, shroom.position.y/2, posZ);
    ENEMIES.push(shroom);
};

// Creates a clone every 1 seconds
setInterval(createEnemy, 500);
