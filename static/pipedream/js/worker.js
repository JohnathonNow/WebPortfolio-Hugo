// Worker for 3D rendering
let document = {};
self.window = self;
function focus(){}
// Import scripts
importScripts(
    './vendored/three.js',
    './vendored/ThreeCSG.js',
    './vendored/OrbitControls.js'
);

var camera, scene, renderer, controls, mockCanvas;
var manholeMaterial = new THREE.MeshLambertMaterial({ color: 0xbbbbbb });

var loader = new THREE.ImageBitmapLoader().setPath( "/static/" );
loader.setOptions( { imageOrientation: 'flipY' } );
loader.load( 'texture.png', function ( imageBitmap ) {
manholeMaterial = new THREE.MeshStandardMaterial( { color: 0xbbbbbb, map: new THREE.CanvasTexture( imageBitmap ) });
});

// const texture = new THREE.TextureLoader().load( "static/texture.png" );

self.onmessage = function(e) {
    const { type, payload } = e.data;

    switch (type) {
        case 'init':
            init(payload);
            break;
        case 'render':
            generate3DView(payload);
            break;
        case 'updateCamera':
            updateCamera(payload);
            break;
        case 'mouseEvent':
            dispatchMouseEvent(payload);
            break;
    }
};

function dispatchMouseEvent(payload) {
    // console.log(mockCanvas);
    if (controls) {
        payload.preventDefault = function(){};
        payload.stopPropagation = function(){};
        // console.log(payload);
        controls.dispatchEvent(payload);
        if (mockCanvas.handlers[payload.type]) mockCanvas.handlers[payload.type](payload);
        if (mockCanvas.ownerDocument.handlers[payload.type]) mockCanvas.ownerDocument.handlers[payload.type](payload);
    }
}

function init(payload) {
    const { canvas, width, height } = payload;
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(self.devicePixelRatio);
    renderer.setSize(width, height, false);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(70, width / height, 1, 10000);
    camera.position.set(3, 1, -1);
    scene.add(camera);

    var ambientLight = new THREE.AmbientLight(0x909090);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(4, 1, -2);
    scene.add(directionalLight);

    mockCanvas = {
        handlers: {},
        addEventListener: (type, listener) => {
            mockCanvas.handlers[type] = listener;
        },
        getBoundingClientRect: () => ({
            left: 0,
            top: 0,
            width: width,
            height: height,
        }),
        clientHeight: height,
        ownerDocument: {
            handlers: {},
            addEventListener: (type, listener) => {
                mockCanvas.ownerDocument.handlers[type] = listener;
            },
            removeEventListener: (type) => {
                mockCanvas.ownerDocument.handlers[type] = null;
            }
        }
    };
    console.log(mockCanvas);

    controls = new THREE.OrbitControls(camera, mockCanvas);
    
    addGridHelper();
    animate();
}

function addGridHelper() {
    var helper = new THREE.GridHelper(120, 120);
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    scene.add(helper);

    var axis = new THREE.AxesHelper(100);
    scene.add(axis);
}

function animate() {
    if (renderer) {
        renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
}

function generate3DView(params) {
    const { innerDiameter, wallThickness, manholeHeight, holes } = params;
    let bottomHole = 1 / 0;
    let bottomDiameter = 0;
    holes.forEach((hole) => {if (hole.verticalOffset < bottomHole) {
        bottomHole = hole.verticalOffset;
        bottomDiameter = hole.holeDiameter;
    }});
    console.log(bottomHole);

    const outerRadius = innerDiameter / 2 + wallThickness;
    const innerRadius = innerDiameter / 2;
    const manholeGeometry = new THREE.CylinderGeometry(outerRadius, outerRadius, manholeHeight, 128);

    let manholeResultBSG = new window.ThreeBSP(manholeGeometry);
    
    while (scene.children.length > 3) { // Keep lights
        scene.remove(scene.children[3]);
    }
    
    const manholeInnerGeometry = new THREE.CylinderGeometry(innerRadius, innerRadius, manholeHeight, 128);
    manholeInnerGeometry.translate(0, wallThickness, 0);
    manholeResultBSG = manholeResultBSG.subtract(new window.ThreeBSP(manholeInnerGeometry));

    const manholeJoinGeometry = new THREE.CylinderGeometry(innerRadius + wallThickness / 2, innerRadius + wallThickness / 2, manholeHeight, 128);
    manholeJoinGeometry.translate(0, manholeHeight - wallThickness, 0);
    manholeResultBSG = manholeResultBSG.subtract(new window.ThreeBSP(manholeJoinGeometry));
    let cumulativeAngle = 0;
    holes.forEach((hole) => {
        const { holeDiameter, angleOffset, verticalOffset } = hole;
        cumulativeAngle -= angleOffset;
        const angleRad = (cumulativeAngle * Math.PI) / 180;

        const holeRadius = holeDiameter / 2;
        const holeLength = outerRadius * 2;

        const holeGeometry = new THREE.CylinderGeometry(holeRadius, holeRadius, holeLength, 128);
        const holeMesh = new THREE.Mesh(holeGeometry);

        const holeCenterX = outerRadius * Math.cos(angleRad);
        const holeCenterY = -outerRadius * Math.sin(angleRad);
        holeMesh.rotation.z = Math.PI / 2;
        holeMesh.rotation.y = angleRad;
        holeMesh.position.x = holeCenterX;
        holeMesh.position.z = holeCenterY;
        holeMesh.position.y = - manholeHeight / 2 + holeDiameter / 2 + (verticalOffset - bottomHole + 0.6) * 12;

        holeMesh.updateMatrix();

        const holeBSG = new window.ThreeBSP(holeMesh);
        manholeResultBSG = manholeResultBSG.subtract(holeBSG);
        console.log(100);
    });

    const finalMesh = manholeResultBSG.toMesh();
    finalMesh.material = manholeMaterial;

    addGridHelper();
    scene.add(finalMesh);

    const boundingBox = new THREE.Box3().setFromObject(finalMesh);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const cameraDistance = (maxDim / 2) / Math.tan(fov / 2);

    camera.position.x = center.x;
    camera.position.y = center.y;
    camera.position.z = center.z + cameraDistance * 1.5;

    const minZ = boundingBox.min.z;
    const cameraToFarEdge = (minZ < 0) ? -minZ + camera.position.z : camera.position.z - minZ;
    camera.far = cameraToFarEdge * 3;
    camera.updateProjectionMatrix();

    controls.target.copy(center);
    controls.update();
}

function updateCamera(payload) {
    if (camera) {
        camera.position.fromArray(payload.position);
        camera.quaternion.fromArray(payload.quaternion);
        camera.updateMatrixWorld();
    }
}