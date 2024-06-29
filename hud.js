const loader = new THREE.GLTFLoader();

let models = {
    handdrill: {
        url: "https://cdn.jsdelivr.net/gh/badteam123/assets@3954b72ff0df391a017a3fd0e952babc5013de4d/models/lowpoly/handdrill.gltf"
    }
}

for (let m in models) {
    loader.load(models[m].url, function (gltf) {
        models[m].model = gltf.scene;
    });
    console.log(m + " model loaded");
}

function hud() {

    clear();

    fill(0);
    circle(window.innerWidth / 2, window.innerHeight / 2, 2)

    textSize(32);
    text(`FPS ${Math.round(smoothFps * 10) / 10}\n${round(player.x, 2)},${round(player.z, 2)}`, 10, 30);

    // Calculate the offset to place the model in front of the player
        let downAngle;
        let distFromCam;
        let horizOffset;

        downAngle = 0.2;
        distFromCam = 1.2;
        horizOffset = 0.1;

        let mult = cos(player.t - downAngle);

        let relX = (sin(-player.r) * distFromCam) * mult;
        let relZ = (cos(-player.r) * -distFromCam) * mult;
        let relY = sin(player.t - downAngle) * distFromCam;
        relX += cos(-player.r) * horizOffset;
        relZ += sin(-player.r) * horizOffset;

        mult = cos(player.t);

        relY -= sin(player.t);
        relZ += (cos(-player.r)) * mult;
        relX -= (sin(-player.r)) * mult;

        models.handdrill.model.rotation.set(0, (Math.PI / 2) + player.r, player.t);
        models.handdrill.model.scale.set(0.01, 0.01, 0.01);
        models.handdrill.model.rotateY(-Math.PI / 2);
        models.handdrill.model.position.set(
            player.camera.x + relX,
            player.camera.y + relY,
            player.camera.z + relZ
        );

}