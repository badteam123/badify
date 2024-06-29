const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.01, 800);
const renderer = new THREE.WebGLRenderer({ antialias: false });
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

const skyboxLoader = new THREE.CubeTextureLoader();
skyboxLoader.setPath('https://cdn.jsdelivr.net/gh/badteam123/assets@567fe90f85f0ec5a7873dfe5b346438b7cc90afb/skybox/');

const skybox = skyboxLoader.load([
  'Front-min.png', 'Back-min.png',
  'Top-min.png', 'Bottom-min.png',
  'Left-min.png', 'Right-min.png'
]);

scene.background = skybox;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

const generator = new Worker('generateThread.js');

const playerHeight = 1.8;
const playerWidth = playerHeight * 0.3;
const halfHeight = playerHeight * 0.5;
const halfWidth = playerWidth * 0.5;
const stepHeight = 0.6;

const speed = 0.00007;
const gravity = 0.000024;
const jumpHeight = 0.008;
const dampening = 0.012;

var world = new World();

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

    camera: {
        x: 0,
        y: 0,
        z: 0,
    },

    facing: {
        x: 0,
        y: 0,
        z: 0,
        chunkX: 0,
        chunkY: 0,
        chunkZ: 0,
        block: null,
        ray: new THREE.Raycaster()
    },

    health: {
        current: 10,
        max: 10
    }
};

player.chunk = {
    x: world.gc(player.x),
    y: world.gc(player.y),
    z: world.gc(player.z)
}

let hudsprites = {};

var smoothFps = 0;

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

    grassTex = new THREE.TextureLoader().load(`https://cdn.jsdelivr.net/gh/badteam123/assets@8286a7f20aa9331b86a7b3ac2401ec4b986ba7da/texsheet.png`);
    grassTex.magFilter = THREE.NearestFilter;
    grassTex.minFilter = THREE.NearestFilter;
    grassTex.wrapS = THREE.RepeatWrapping;
    grassTex.wrapT = THREE.RepeatWrapping;

    //for (let x = -100; x < 100; x++) {
    //    for (let z = -100; z < 100; z++) {
    //        world.addBlock(x, 0, z, null);
    //    }
    //}

    world.generateNearby();
    
    world.compile();

    //image(hudsprites.heart,100,100,100,100);

}

function draw() {

    if (deltaTime > 60) {
        deltaTime = 60;
    }

    switch (-keyIsDown(87) + keyIsDown(83) + (keyIsDown(65) * 10) + -(keyIsDown(68) * 10) + 11) {
        case 11://no
          break;
        case 10://W
          player.zVel -= (Math.cos(player.r) * speed) * deltaTime;
          player.xVel -= (Math.sin(player.r) * speed) * deltaTime;
          break;
        case 20://WD
          player.zVel -= (Math.cos(player.r + (PI * 0.25)) * speed) * deltaTime;
          player.xVel -= (Math.sin(player.r + (PI * 0.25)) * speed) * deltaTime;
          break;
        case 21://D
          player.zVel -= (Math.cos(player.r + (PI * 0.5)) * speed) * deltaTime;
          player.xVel -= (Math.sin(player.r + (PI * 0.5)) * speed) * deltaTime;
          break;
        case 22://SD
          player.zVel -= (Math.cos(player.r + (PI * 0.75)) * speed) * deltaTime;
          player.xVel -= (Math.sin(player.r + (PI * 0.75)) * speed) * deltaTime;
          break;
        case 12://S
          player.zVel -= (Math.cos(player.r + (PI)) * speed) * deltaTime;
          player.xVel -= (Math.sin(player.r + (PI)) * speed) * deltaTime;
          break;
        case 2://SA
          player.zVel -= (Math.cos(player.r + (PI * 1.25)) * speed) * deltaTime;
          player.xVel -= (Math.sin(player.r + (PI * 1.25)) * speed) * deltaTime;
          break;
        case 1://A
          player.zVel -= (Math.cos(player.r + (PI * 1.5)) * speed) * deltaTime;
          player.xVel -= (Math.sin(player.r + (PI * 1.5)) * speed) * deltaTime;
          break;
        case 0://WA
          player.zVel -= (Math.cos(player.r + (PI * 1.75)) * speed) * deltaTime;
          player.xVel -= (Math.sin(player.r + (PI * 1.75)) * speed) * deltaTime;
          break;
    }

    if(keyIsDown(32) && player.onGround){
        player.yVel += jumpHeight;
        player.onGround = false;
    }

    world.collide();

    if(player.xVel != 0){
        player.x += (player.xVel) * deltaTime;
      }
      if(player.zVel != 0){
        player.z += (player.zVel) * deltaTime;
      }
      if(player.yVel != 0){
        player.y += (player.yVel) * deltaTime;
      }
    
      player.xVel = lerp(player.xVel,0,(deltaTime*dampening));
      player.zVel = lerp(player.zVel,0,(deltaTime*dampening));
      
      if(!isNaN(gravity * deltaTime)){
        if(Math.abs(player.yVel - (gravity * deltaTime)) <= 0.000005){
          player.yVel = 0;
        } else if(Math.abs(gravity * deltaTime) > 0.000006){
          player.yVel -= gravity * deltaTime;
        }
      }

    let prevChunk = JSON.parse(JSON.stringify(player.chunk));

    player.chunk = {
        x: world.gc(player.x),
        y: world.gc(player.y),
        z: world.gc(player.z)
    }

    if(prevChunk.x != player.chunk.x || prevChunk.y != player.chunk.y || prevChunk.z != player.chunk.z){
        console.log("AAAA");
        let xdiff = Math.round(player.chunk.x) - Math.round(prevChunk.X);
        let ydiff = Math.round(player.chunk.y) - Math.round(prevChunk.Y);
        let zdiff = Math.round(player.chunk.z) - Math.round(prevChunk.Z);

        for (let x = -world.renderDistance; x < world.renderDistance+1; x++) {
            for (let y = -world.renderDistance; y < world.renderDistance+1; y++) {
                for (let z = -world.renderDistance; z < world.renderDistance+1; z++) {
                    if (x+prevChunk.x >= world.renderDistance || x+prevChunk.x <= -world.renderDistance ||
                        y+prevChunk.y >= world.renderDistance || y+prevChunk.y <= -world.renderDistance ||
                        z+prevChunk.z >= world.renderDistance || z+prevChunk.z <= -world.renderDistance) {

                            //world.update.push([player.chunk.x + x, player.chunk.y + y, player.chunk.z + z]);
                            //console.log(player.chunk.x + x, player.chunk.y + y, player.chunk.z + z);
                            //world.generate(player.chunk.x + x, player.chunk.y + y, player.chunk.z + z);

                    }
                }
            }
        }
        
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

    if (isNaN(smoothFps)) {
        smoothFps = 60;
    }
    if (deltaTime != undefined) {
        smoothFps = lerp(smoothFps, (1000 / deltaTime), 0.01);
    }

    hud();

    player.camera = {
        x: player.x,
        y: player.y + (halfHeight/2),
        z: player.z
    }

    camera.position.x = player.camera.x;
    camera.position.y = player.camera.y;
    camera.position.z = player.camera.z;
    camera.aspect = window.innerWidth / window.innerHeight;

    updateBlockFacing();

    camera.updateProjectionMatrix();

}

function hud(){
    clear();

    fill(0);
    circle(window.innerWidth/2,window.innerHeight/2,2)

    textSize(32);
    text("FPS: " + Math.round(smoothFps * 10) / 10, 10, 30);
}

function updateBlockFacing() {

    player.facing.ray = new THREE.Raycaster()
    player.facing.ray.setFromCamera(new THREE.Vector2(0, 0), camera);
    let intersects = player.facing.ray.intersectObjects(scene.children, true);

    if (intersects.length >= 1) {
        player.facing.x = Math.round(intersects[0].point.x - (intersects[0].face.normal.x * 0.5));
        player.facing.y = Math.round(intersects[0].point.y - (intersects[0].face.normal.y * 0.5));
        player.facing.z = Math.round(intersects[0].point.z - (intersects[0].face.normal.z * 0.5));

        player.facing.chunkX = world.gc(player.facing.x);
        player.facing.chunkY = world.gc(player.facing.y);
        player.facing.chunkZ = world.gc(player.facing.z);
    }

}

function windowResized() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    resizeCanvas(window.innerWidth, window.innerHeight);
}

document.addEventListener("mousedown", function (event) {
    if (event.button === 0) { // Left mouse button
        requestPointerLock();
        world.removeBlock(player.facing.x, player.facing.y, player.facing.z);
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

generator.onmessage = function(e){

}