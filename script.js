const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.01, 800);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add directional light

const sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
sunLight.position.set(40, 100, 16);
//sunLight.castShadow = true;
scene.add(sunLight);
scene.add(sunLight.target);
sunLight.target.position.set(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

scene.background = new THREE.Color(0xa0c8ff);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

var mouse = {
    l: false,
    r: false,
    m: false
}

var player = {
    x: 0,
    y: 0,
    z: 0,
    xVel: 0,
    yVel: 0,
    zVel: 0,
    r: 0,
    t: 0,

    health: {
        current: 10,
        max: 10
    }
};

var world = new World();

let hudsprites = {};

function preload() {
    hudsprites.image = loadImage('https://cdn.jsdelivr.net/gh/badteam123/assets@ef9adc24840dd4b3299a203a73c71ff8fc649d6d/pixelart/hudspritesheet.png');
}

function defineImages(){
    hudsprites.heart = hudsprites.image.get(1, 1, 256, 256);
}

var grassTex;

function setup() {
    defineImages(); // needed cause it can't run in preload (cringe)

    var cnv = createCanvas(window.innerWidth, window.innerHeight);
    cnv.position(0, 0);
    pixelDensity(1);
    noSmooth();
    frameRate(9999999);

    grassTex = new THREE.TextureLoader().load(`https://cdn.jsdelivr.net/gh/badteam123/assets@9e492449c938d0b211e8e7a70491c579a653c54e/grass.png`);
    grassTex.magFilter = THREE.NearestFilter;
    grassTex.minFilter = THREE.LinearMipmapLinearFilter;
    grassTex.wrapS = THREE.RepeatWrapping;
    grassTex.wrapT = THREE.RepeatWrapping;

    //for (let x = -100; x < 100; x++) {
    //    for (let z = -100; z < 100; z++) {
    //        world.addBlock(x, 0, z, null);
    //    }
    //}

    world.generateNearby();
    
    world.compile();

    image(hudsprites.heart,100,100,100,100);

}

function draw() {

    if (deltaTime > 60) {
        deltaTime = 60;
    }

    if (keyIsDown(16)) {
        player.y -= deltaTime * 0.015;
    }
    if (keyIsDown(32)) {
        player.y += deltaTime * 0.015;
    }

    if (keyIsDown(87)) {
        player.z -= Math.cos(player.r) * deltaTime * 0.015;
        player.x -= Math.sin(player.r) * deltaTime * 0.015;
    }
    if (keyIsDown(65)) {
        player.z -= Math.cos(player.r + (PI * 0.5)) * deltaTime * 0.015;
        player.x -= Math.sin(player.r + (PI * 0.5)) * deltaTime * 0.015;
    }
    if (keyIsDown(83)) {
        player.z -= Math.cos(player.r + (PI * 1)) * deltaTime * 0.015;
        player.x -= Math.sin(player.r + (PI * 1)) * deltaTime * 0.015;
    }
    if (keyIsDown(68)) {
        player.z -= Math.cos(player.r + (PI * 1.5)) * deltaTime * 0.015;
        player.x -= Math.sin(player.r + (PI * 1.5)) * deltaTime * 0.015;
    }

    camera.rotateX(-player.t);
    camera.rotateY(-player.r);

    let rotateCam = 0;
    let tiltCam = 0;

    rotateCam = (round(-movedX, 4) * 0.003);
    tiltCam = (round(movedY, 4) * 0.003);

    player.r += (rotateCam * deltaTime) / 8;
    player.t -= (tiltCam * deltaTime) / 8;

    if (player.t >= 1.45) {
        player.t = 1.45;
    } else if (player.t <= -1.45) {
        player.t = -1.45;
    }

    if (player.r > Math.PI) {
        player.r -= Math.PI * 2;
    } else if (player.r < -Math.PI) {
        player.r += Math.PI * 2;
    }
    camera.rotateY(player.r);
    camera.rotateX(player.t);

    camera.position.x = player.x;
    camera.position.y = player.y;
    camera.position.z = player.z;
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

}

function windowResized() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    resizeCanvas(window.innerWidth, window.innerHeight);
}

document.addEventListener("mousedown", function (event) {
    if (event.button === 0) { // Left mouse button
        requestPointerLock();
        mouse.l = true;
    }
    if (event.button === 2) { // Right mouse button
        mouse.r = true;
    }
    if (event.button === 1) { // Middle mouse button
        mouse.m = true;
    }
});

document.addEventListener("mouseup", function (event) {
    if (event.button === 0) { // Left mouse button
        mouse.l = false;
    }
    if (event.button === 2) { // Right mouse button
        mouse.r = false;
    }
    if (event.button === 1) { // Middle mouse button
        mouse.m = false;
    }
});