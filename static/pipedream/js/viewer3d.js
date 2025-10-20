/**
 * @namespace viewer3d
 */

let camera, scene, renderer, controls;
const manholeMaterial = new THREE.MeshLambertMaterial({ color: 0xbbbbbb });

/**
 * Initializes the 3D viewer.
 * @memberof viewer3d
 */
function init3D() {
    const container = document.getElementById('viewer');
    let canvas = document.getElementById('canvas-3d');
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas
    });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth * .8, container.clientHeight * .8);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 1, 10000);
    camera.position.set(3, 1, -1);
    scene.add(camera);
    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.x = 4;
    directionalLight.position.y = 1;
    directionalLight.position.z = -2;
    scene.add(directionalLight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    addGridHelper();
    animate();
}

/**
 * Adds a grid helper to the scene.
 * @memberof viewer3d
 */
function addGridHelper() {
    var helper = new THREE.GridHelper(120, 120);
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    scene.add(helper);

    var axis = new THREE.AxesHelper(100);
    scene.add(axis);
}

/**
 * Animates the scene.
 * @memberof viewer3d
 */
function animate() {
    requestAnimationFrame(animate);
    render();
}

/**
 * Renders the scene.
 * @memberof viewer3d
 */
function render() {
    renderer.render(scene, camera);
}

/**
 * Generates the 3D manhole model with holes.
 * @param {number} innerDiameter - The inner diameter of the manhole.
 * @param {number} wallThickness - The wall thickness of the manhole.
 * @param {number} manholeHeight - The height of the manhole.
 * @param {Array<Object>} holes - An array of hole objects.
 * @returns {THREE.Mesh} The 3D manhole model.
 * @memberof viewer3d
 */
function generateSphereData(innerDiameter, wallThickness, manholeHeight, holes) {
    const outerRadius = innerDiameter / 2 + wallThickness;
    const innerRadius = innerDiameter / 2;
    const manholeGeometry = new THREE.CylinderGeometry(outerRadius, outerRadius, manholeHeight, 128);

    let manholeResultBSG = new window.ThreeBSP(manholeGeometry);

    const manholeInnerGeometry = new THREE.CylinderGeometry(innerRadius, innerRadius, manholeHeight, 128);
    manholeInnerGeometry.translate(0, wallThickness, 0);
    manholeResultBSG = manholeResultBSG.subtract(new window.ThreeBSP(manholeInnerGeometry));

    let cumulativeAngle = 0;

    holes.forEach((hole) => {
        const { holeDiameter, angleOffset, verticalOffset } = hole;
        cumulativeAngle += angleOffset;
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
        holeMesh.position.y = verticalOffset - manholeHeight / 2;

        holeMesh.updateMatrix();

        const holeBSG = new window.ThreeBSP(holeMesh);
        manholeResultBSG = manholeResultBSG.subtract(holeBSG);
    });

    return manholeResultBSG.toMesh();
}

/**
 * Generates and displays the 3D view of the manhole.
 * @memberof viewer3d
 */
function generate3DView() {
    const innerDiameter = parseFloat(document.getElementById('inner-diameter').value);
    const wallThickness = parseFloat(document.getElementById('wall-thickness').value);
    const manholeHeight = parseFloat(document.getElementById('manhole-height').value);

    const holes = [];
    const holeEntries = document.querySelectorAll('.hole-entry');
    holeEntries.forEach((hole) => {
        const holeDiameter = parseFloat(hole.querySelector('.hole-diameter').value);
        const angleOffset = parseFloat(hole.querySelector('.hole-angle').value);
        const verticalOffset = parseFloat(hole.querySelector('.hole-vertical').value);
        holes.push({ holeDiameter, angleOffset, verticalOffset });
    });

    const finalMesh = generateSphereData(innerDiameter, wallThickness, manholeHeight, holes);
    finalMesh.material = manholeMaterial;

    while (scene.children.length > 3) { // Keep lights
        scene.remove(scene.children[3]);
    }
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
