// Creating the necessary requirenmnts engine, light camera etc
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const createScene = async function() {
    let isLanding = false;
    let isTakingOff = false;

    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.6, 0.8, 1, 1);
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Adding the grassy ground to the scene
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 27, height: 27 }, scene);
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    const groundDesign = new BABYLON.Texture("./media/grass.jpg", scene);
    groundMaterial.diffuseTexture = groundDesign;
    ground.material = groundMaterial;

    
;

// Realistic runway
const runway = BABYLON.MeshBuilder.CreateGround("runway", {
    width: 4,
    height: 50
}, scene);

const runwayMat = new BABYLON.StandardMaterial("runwayMat", scene);
runwayMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1); // black/dark gray
runway.material = runwayMat;
runway.position.z = -10;
runway.position.y = 0.01;


BABYLON.SceneLoader.ImportMesh(null, "./media/", "Wooden Plane.gltf", scene, function (meshes) {
    let plane = meshes[0];

    // Nice size
    plane.scaling = new BABYLON.Vector3(8, 8, 8);

    // Start above and far away (Z-50)
    plane.position = new BABYLON.Vector3(0, 7.5, -50);

    // Tilt slightly downward
    plane.rotation = new BABYLON.Vector3(BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(-90), 0);

    // Animate forward and downward
    scene.onBeforeRenderObservable.add(() => {
        if (isLanding  & plane.position.z < -2) {  // stop before the house!
            plane.position.z += 0.2;
            if (plane.position.y > 0.5) {
                plane.position.y -= 0.03;
            }
        }
        if (isTakingOff && plane.position.z > -80) {
            plane.position.z -= -0.2;
            if (plane.position.y < -15) {
                plane.position.y += -0.05;
            }
        } else {
            // level out once on ground
            plane.rotation.y = BABYLON.Tools.ToRadians(-90);
            plane.rotation.x = BABYLON.Tools.ToRadians(0);
            plane.rotation.z = BABYLON.Tools.ToRadians(0);
        }
        document.getElementById("startLanding").addEventListener("click", () => {
            isLanding = true;
            isTakingOff = false;
        });
        document.getElementById("startTakeoff").addEventListener("click", () => {
            isLanding = false;
            isTakingOff = true;
        });
    });
});
            // House added to the scene
        BABYLON.SceneLoader.ImportMesh(
            null, "./media/","house_and_clothesline.glb", scene,
            function (meshes) {
                console.log("Meshes loaded:", meshes);
                let woodenPlane = meshes[0];
    
                woodenPlane.scaling = new BABYLON.Vector3(1, 1, 1);
                woodenPlane.position = new BABYLON.Vector3(8, 0, 3);

            })
            
// Added the walls to the surroundings for future use
    
    const wHeight = 1.5;
    const wThickness = 0.5;
    const wLength = 27;
    const BefindWall = BABYLON.MeshBuilder.CreateBox("BehindWall", { width: wLength, height: wHeight, depth: wThickness }, scene);
    BefindWall.position.z = 12.5, BefindWall.position.y = 0.7;
    const  LeftWall= BABYLON.MeshBuilder.CreateBox("LeftWall", {  depth: wLength,  height: wHeight , width: wThickness}, scene);
    LeftWall.position.x = -13.2, LeftWall.position.y = 0.7;
    const RightWall = BABYLON.MeshBuilder.CreateBox("RightWall", {  depth: wLength , height: wHeight, width: wThickness }, scene);
    RightWall.position.x = 13.2, RightWall.position.y = 0.7;


    // Added the WebXR session support
    if ( await BABYLON.WebXRSessionManager.IsSessionSupportedAsync("immersive-vr")) {
        const xr = await scene.createDefaultXRExperienceAsync({
            floorMeshes: [ground],
            optionalFeatures: true
        });
    } 
    else {
        console.log("WebXR is not supported here.");
    }
    

    return scene;
};

createScene().then((scene) => {
    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", () => engine.resize());
});