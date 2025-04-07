// Creating the necessary requirenmnts engine, light camera etc
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const createScene = async function() {

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

    

    
    // adding Plane to the scene
    BABYLON.SceneLoader.ImportMesh(
        null, "./media/","Wooden Plane.gltf", scene,
        function (meshes) {
            console.log("Meshes loaded:", meshes);
            let woodenPlane = meshes[0];

            woodenPlane.scaling = new BABYLON.Vector3(12, 12, 12);
            woodenPlane.position = new BABYLON.Vector3(1, 16, 1);
            woodenPlane.rotation = new BABYLON.Vector3(Math.PI/8, 0, 0);
    
            // giving the plane animation
            let angle = 0;
            const radius = 3;
    
            scene.onBeforeRenderObservable.add(() => {
                angle += 0.02;  // Adjust speed of rotation
                woodenPlane.position.x = Math.cos(angle) * radius;
                woodenPlane.position.z = Math.sin(angle) * radius;
                woodenPlane.rotation.y = -angle;
            });
        },

            // House added to the scene
        BABYLON.SceneLoader.ImportMesh(
            null, "./media/","house_and_clothesline.glb", scene,
            function (meshes) {
                console.log("Meshes loaded:", meshes);
                let woodenPlane = meshes[0];
    
                woodenPlane.scaling = new BABYLON.Vector3(1, 1, 1);
                woodenPlane.position = new BABYLON.Vector3(3, 0, 3);
            })
            
// Added the walls to the surroundings for future use
    )
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