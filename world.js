class World {
    constructor() {
        this.chunk = {};
        this.chunkModel = {};
        this.chunkSize = 4;
        this.update = [];
        this.urgentUpdate = [];
        this.renderDistance = 1;

        this.ground = {
            height: 20,
            offset: -20,
            scale: 0.04
        },

        this.cave = {
            scaleHoriz: 0.1,
            scaleVert: 0.2,
            threshold: 0.6
        }

    }

    collide(){

        let chunksToCheck = [];

        for(let x = -1; x <= 1; x +=2){
            for(let y = -1; y <= 1; y +=2){
                for(let z = -1; z <= 1; z +=2){
                    let check = this.gc(player.x + (halfWidth*x), player.y + (halfHeight*y), player.z + (halfWidth*z));
                    if (chunksToCheck.indexOf(check) === -1) {
                        chunksToCheck.push(check);
                    }
                }
            }
        }

        player.onGround = false;

        for(let c = 0; c < chunksToCheck.length; c++){
            if (this.chunk[chunksToCheck[c][0]]) {
                if (this.chunk[chunksToCheck[c][0]][chunksToCheck[c][1]]) {
                    if (Array.isArray(this.chunk[chunksToCheck[c][0]][chunksToCheck[c][1]][chunksToCheck[c][2]])) {
                        let lngth = this.chunk[chunksToCheck[c][0]][chunksToCheck[c][1]][chunksToCheck[c][2]].length;
                        for(let b = 0; b < lngth; b++){
                            this.chunk[chunksToCheck[c][0]][chunksToCheck[c][1]][chunksToCheck[c][2]][b].collideFloor();
                        }
                    }
                }
            }
        }

        for(let c = 0; c < chunksToCheck.length; c++){
            if (this.chunk[chunksToCheck[c][0]]) {
                if (this.chunk[chunksToCheck[c][0]][chunksToCheck[c][1]]) {
                    if (Array.isArray(this.chunk[chunksToCheck[c][0]][chunksToCheck[c][1]][chunksToCheck[c][2]])) {
                        let lngth = this.chunk[chunksToCheck[c][0]][chunksToCheck[c][1]][chunksToCheck[c][2]].length;
                        for(let b = 0; b < lngth; b++){
                            this.chunk[chunksToCheck[c][0]][chunksToCheck[c][1]][chunksToCheck[c][2]][b].collide();
                        }
                    }
                }
            }
        }

    }

    // Generalize gc function to handle both (x, y, z) and single num
    gc(x, y, z) {
        if (arguments.length === 3) {
            return [Math.floor(x / this.chunkSize), Math.floor(y / this.chunkSize), Math.floor(z / this.chunkSize)];
        } else if (arguments.length === 1) {
            return Math.floor(x / this.chunkSize);
        }
    }

    addBlock(x, y, z, tex) {
        let ch = this.gc(x, y, z);

        if (!this.chunk[ch[0]]) {
            this.chunk[ch[0]] = {};
        }
        if (!this.chunk[ch[0]][ch[1]]) {
            this.chunk[ch[0]][ch[1]] = {};
        }
        if (!Array.isArray(this.chunk[ch[0]][ch[1]][ch[2]])) {
            this.chunk[ch[0]][ch[1]][ch[2]] = [];
        }
        if (!this.chunkModel[ch[0]]) {
            this.chunkModel[ch[0]] = {};
        }
        if (!this.chunkModel[ch[0]][ch[1]]) {
            this.chunkModel[ch[0]][ch[1]] = {};
        }
        if (!this.chunkModel[ch[0]][ch[1]][ch[2]]) {
            this.chunkModel[ch[0]][ch[1]][ch[2]] = {};
        }
        this.chunk[ch[0]][ch[1]][ch[2]].push(new Block(x, y, z, tex));
    }

    removeBlock(x, y, z){
        let ch = this.gc(x, y, z);

        if (this.chunk[ch[0]]) {
            if (this.chunk[ch[0]][ch[1]]) {
                if (Array.isArray(this.chunk[ch[0]][ch[1]][ch[2]])) {
                    let temp = this.chunk[ch[0]][ch[1]][ch[2]].length;
                    for(let b = temp - 1; b >= 0; b--){
                        if(this.chunk[ch[0]][ch[1]][ch[2]][b].x === x && this.chunk[ch[0]][ch[1]][ch[2]][b].y === y && this.chunk[ch[0]][ch[1]][ch[2]][b].z === z){
                            this.chunk[ch[0]][ch[1]][ch[2]].splice(b, 1);
                        }
                    }
                }
            }
        }
        
        this.compileChunk(ch[0], ch[1], ch[2]);

    }

    addBlockRaw(x, y, z, tex) {
        let ch = this.gc(x, y, z);
        this.chunk[ch[0]][ch[1]][ch[2]].push(new Block(x, y, z, tex));
    }

    generate(xc, yc, zc) {

        let alreadyExists = false;
        if (this.chunk[xc]) {
            if (this.chunk[xc][yc]) {
                if (Array.isArray(this.chunk[xc][yc][zc])) {
                    alreadyExists = true;
                }
            }
        }

        if(!alreadyExists){

            if (!this.chunk[xc]) {
                this.chunk[xc] = {};
            }
            if (!this.chunk[xc][yc]) {
                this.chunk[xc][yc] = {};
            }
            if (!Array.isArray(this.chunk[xc][yc][zc])) {
                this.chunk[xc][yc][zc] = [];
            }
            if (!this.chunkModel[xc]) {
                this.chunkModel[xc] = {};
            }
            if (!this.chunkModel[xc][yc]) {
                this.chunkModel[xc][yc] = {};
            }
            if (!this.chunkModel[xc][yc][zc]) {
                this.chunkModel[xc][yc][zc] = {};
            }

            for (let x = xc * this.chunkSize; x < (xc * this.chunkSize) + this.chunkSize; x++) {
                for (let z = zc * this.chunkSize; z < (zc * this.chunkSize) + this.chunkSize; z++) {
                    let groundHeight = (Math.round(noise(x * this.ground.scale + 100, z * this.ground.scale + 100) * this.ground.height) + this.ground.offset);
                    for (let y = yc * this.chunkSize; y < (yc * this.chunkSize) + this.chunkSize; y++) {
    
                        if(noise(x*this.cave.scaleHoriz + 1246, y*this.cave.scaleVert + 1285, z*this.cave.scaleHoriz + 1983) < this.cave.threshold){
                            // grass
                            if (y === groundHeight) {
                                this.addBlockRaw(x, y, z, "grass");
                            }
    
                            // dirt
                            if (y < groundHeight && y > groundHeight - 7) {
                                this.addBlockRaw(x, y, z, "dirt");
                            }
    
                            // stone
                            if (y <= groundHeight - 7) {
                                this.addBlockRaw(x, y, z, "stone");
                            }  
                        }
    
                    }
                }
            }
        }

        this.compile(xc, yc, zc);
        
    }

    generateNearby() {

        let ch = this.gc(player.x, player.y, player.z);

        for (let x = -this.renderDistance; x <= this.renderDistance; x++) {
            for (let y = -this.renderDistance; y <= this.renderDistance; y++) {
                for (let z = -this.renderDistance; z <= this.renderDistance; z++) {
                    this.generate(ch[0] + x, ch[1] + y, ch[2] + z);
                }
            }
        }

    }

    checkForBlock(chunk, x, y, z) {
        let numBlocks = chunk.length;
        let blockThere = false;
        for (let i = 0; i < numBlocks; i++) {
            if (chunk[i].x === x && chunk[i].y === y && chunk[i].z === z) {
                return true;
            }
        }
        return false;
    }

    compile() {
        for (let x in this.chunk) {
            for (let y in this.chunk[x]) {
                for (let z in this.chunk[x][y]) {

                    if (this.chunkModel[x][y][z].model === undefined) {

                    } else {
                        scene.remove(this.chunkModel[x][y][z].model);
                        this.chunkModel[x][y][z].model.geometry.dispose();
                        this.chunkModel[x][y][z].model.material.dispose();
                    }

                    let vertices = [];
                    let indices = [];
                    let UVs = [];

                    let totalIndices = 0;

                    let chunk = this.chunk[x][y][z];

                    let lngth = this.chunk[x][y][z].length

                    for (let b = 0; b < lngth; b++) {
                        let block = chunk[b];

                        // Back (z-)
                        if (!this.checkForBlock(chunk, block.x, block.y, block.z - 1)) {
                            vertices.push(block.x - 0.5, block.y - 0.5, block.z - 0.5);
                            vertices.push(block.x - 0.5, block.y + 0.5, block.z - 0.5);
                            vertices.push(block.x + 0.5, block.y + 0.5, block.z - 0.5);
                            vertices.push(block.x + 0.5, block.y - 0.5, block.z - 0.5);
                            UVs.push(block.lx, block.ly);
                            UVs.push(block.lx, block.hy);
                            UVs.push(block.hx, block.hy);
                            UVs.push(block.hx, block.ly);
                            indices.push(0 + totalIndices, 1 + totalIndices, 2 + totalIndices, 0 + totalIndices, 2 + totalIndices, 3 + totalIndices);
                            totalIndices += 4;
                        }


                        // Front (z+)
                        if (!this.checkForBlock(chunk, block.x, block.y, block.z + 1)) {
                            vertices.push(block.x - 0.5, block.y - 0.5, block.z + 0.5);
                            vertices.push(block.x - 0.5, block.y + 0.5, block.z + 0.5);
                            vertices.push(block.x + 0.5, block.y + 0.5, block.z + 0.5);
                            vertices.push(block.x + 0.5, block.y - 0.5, block.z + 0.5);
                            UVs.push(block.lx, block.ly);
                            UVs.push(block.lx, block.hy);
                            UVs.push(block.hx, block.hy);
                            UVs.push(block.hx, block.ly);
                            indices.push(0 + totalIndices, 2 + totalIndices, 1 + totalIndices, 0 + totalIndices, 3 + totalIndices, 2 + totalIndices);
                            totalIndices += 4;
                        }

                        // Left (x-)
                        if (!this.checkForBlock(chunk, block.x - 1, block.y, block.z)) {
                            vertices.push(block.x - 0.5, block.y + 0.5, block.z - 0.5);
                            vertices.push(block.x - 0.5, block.y + 0.5, block.z + 0.5);
                            vertices.push(block.x - 0.5, block.y - 0.5, block.z + 0.5);
                            vertices.push(block.x - 0.5, block.y - 0.5, block.z - 0.5);
                            UVs.push(block.hx, block.hy);
                            UVs.push(block.lx, block.hy);
                            UVs.push(block.lx, block.ly);
                            UVs.push(block.hx, block.ly);
                            indices.push(2 + totalIndices, 0 + totalIndices, 3 + totalIndices, 2 + totalIndices, 1 + totalIndices, 0 + totalIndices);
                            totalIndices += 4;
                        }

                        // Right (x+)
                        if (!this.checkForBlock(chunk, block.x + 1, block.y, block.z)) {
                            vertices.push(block.x + 0.5, block.y + 0.5, block.z + 0.5);
                            vertices.push(block.x + 0.5, block.y + 0.5, block.z - 0.5);
                            vertices.push(block.x + 0.5, block.y - 0.5, block.z - 0.5);
                            vertices.push(block.x + 0.5, block.y - 0.5, block.z + 0.5);
                            UVs.push(block.hx, block.hy);
                            UVs.push(block.lx, block.hy);
                            UVs.push(block.lx, block.ly);
                            UVs.push(block.hx, block.ly);
                            indices.push(0 + totalIndices, 2 + totalIndices, 1 + totalIndices, 0 + totalIndices, 3 + totalIndices, 2 + totalIndices);
                            totalIndices += 4;
                        }

                        // Bottom (y-)
                        if (!this.checkForBlock(chunk, block.x, block.y - 1, block.z)) {
                            vertices.push(block.x - 0.5, block.y - 0.5, block.z - 0.5);
                            vertices.push(block.x - 0.5, block.y - 0.5, block.z + 0.5);
                            vertices.push(block.x + 0.5, block.y - 0.5, block.z + 0.5);
                            vertices.push(block.x + 0.5, block.y - 0.5, block.z - 0.5);
                            UVs.push(block.lx, block.ly);
                            UVs.push(block.lx, block.hy);
                            UVs.push(block.hx, block.hy);
                            UVs.push(block.hx, block.ly);
                            indices.push(0 + totalIndices, 3 + totalIndices, 2 + totalIndices, 0 + totalIndices, 2 + totalIndices, 1 + totalIndices);
                            totalIndices += 4;
                        }

                        // Top (y+)
                        if (!this.checkForBlock(chunk, block.x, block.y + 1, block.z)) {
                            vertices.push(block.x - 0.5, block.y + 0.5, block.z + 0.5);
                            vertices.push(block.x - 0.5, block.y + 0.5, block.z - 0.5);
                            vertices.push(block.x + 0.5, block.y + 0.5, block.z - 0.5);
                            vertices.push(block.x + 0.5, block.y + 0.5, block.z + 0.5);
                            UVs.push(block.lx, block.hy);
                            UVs.push(block.lx, block.ly);
                            UVs.push(block.hx, block.ly);
                            UVs.push(block.hx, block.hy);
                            indices.push(1 + totalIndices, 3 + totalIndices, 2 + totalIndices, 1 + totalIndices, 0 + totalIndices, 3 + totalIndices);
                            totalIndices += 4;
                        }
                    }

                    let vertices2 = new Float32Array(vertices);
                    let indices2 = new Uint16Array(indices);
                    let UVs2 = new Float32Array(UVs);

                    let geometry = new THREE.BufferGeometry();

                    geometry.setAttribute('position', new THREE.BufferAttribute(vertices2, 3));
                    geometry.setAttribute('uv', new THREE.BufferAttribute(UVs2, 2));
                    geometry.setIndex(new THREE.BufferAttribute(indices2, 1));

                    geometry.computeVertexNormals();

                    let material = new THREE.MeshStandardMaterial({ map: grassTex, side: THREE.FrontSide });
                    this.chunkModel[x][y][z].model = new THREE.Mesh(geometry, material);

                    scene.add(this.chunkModel[x][y][z].model);
                }
            }
        }
    }

    compileChunk(x, y, z) {

        if (this.chunkModel[x][y][z].model === undefined) {

        } else {
            scene.remove(this.chunkModel[x][y][z].model);
            this.chunkModel[x][y][z].model.geometry.dispose();
            this.chunkModel[x][y][z].model.material.dispose();
        }
                    let vertices = [];
                    let indices = [];
                    let UVs = [];

                    let totalIndices = 0;

                    let chunk = this.chunk[x][y][z];

                    let lngth = this.chunk[x][y][z].length

                    for (let b = 0; b < lngth; b++) {
                        let block = chunk[b];

                        // Back (z-)
                        if (!this.checkForBlock(chunk, block.x, block.y, block.z - 1)) {
                            vertices.push(block.x - 0.5, block.y - 0.5, block.z - 0.5);
                            vertices.push(block.x - 0.5, block.y + 0.5, block.z - 0.5);
                            vertices.push(block.x + 0.5, block.y + 0.5, block.z - 0.5);
                            vertices.push(block.x + 0.5, block.y - 0.5, block.z - 0.5);
                            UVs.push(block.lx, block.ly);
                            UVs.push(block.lx, block.hy);
                            UVs.push(block.hx, block.hy);
                            UVs.push(block.hx, block.ly);
                            indices.push(0 + totalIndices, 1 + totalIndices, 2 + totalIndices, 0 + totalIndices, 2 + totalIndices, 3 + totalIndices);
                            totalIndices += 4;
                        }


                        // Front (z+)
                        if (!this.checkForBlock(chunk, block.x, block.y, block.z + 1)) {
                            vertices.push(block.x - 0.5, block.y - 0.5, block.z + 0.5);
                            vertices.push(block.x - 0.5, block.y + 0.5, block.z + 0.5);
                            vertices.push(block.x + 0.5, block.y + 0.5, block.z + 0.5);
                            vertices.push(block.x + 0.5, block.y - 0.5, block.z + 0.5);
                            UVs.push(block.lx, block.ly);
                            UVs.push(block.lx, block.hy);
                            UVs.push(block.hx, block.hy);
                            UVs.push(block.hx, block.ly);
                            indices.push(0 + totalIndices, 2 + totalIndices, 1 + totalIndices, 0 + totalIndices, 3 + totalIndices, 2 + totalIndices);
                            totalIndices += 4;
                        }

                        // Left (x-)
                        if (!this.checkForBlock(chunk, block.x - 1, block.y, block.z)) {
                            vertices.push(block.x - 0.5, block.y + 0.5, block.z - 0.5);
                            vertices.push(block.x - 0.5, block.y + 0.5, block.z + 0.5);
                            vertices.push(block.x - 0.5, block.y - 0.5, block.z + 0.5);
                            vertices.push(block.x - 0.5, block.y - 0.5, block.z - 0.5);
                            UVs.push(block.hx, block.hy);
                            UVs.push(block.lx, block.hy);
                            UVs.push(block.lx, block.ly);
                            UVs.push(block.hx, block.ly);
                            indices.push(2 + totalIndices, 0 + totalIndices, 3 + totalIndices, 2 + totalIndices, 1 + totalIndices, 0 + totalIndices);
                            totalIndices += 4;
                        }

                        // Right (x+)
                        if (!this.checkForBlock(chunk, block.x + 1, block.y, block.z)) {
                            vertices.push(block.x + 0.5, block.y + 0.5, block.z + 0.5);
                            vertices.push(block.x + 0.5, block.y + 0.5, block.z - 0.5);
                            vertices.push(block.x + 0.5, block.y - 0.5, block.z - 0.5);
                            vertices.push(block.x + 0.5, block.y - 0.5, block.z + 0.5);
                            UVs.push(block.hx, block.hy);
                            UVs.push(block.lx, block.hy);
                            UVs.push(block.lx, block.ly);
                            UVs.push(block.hx, block.ly);
                            indices.push(0 + totalIndices, 2 + totalIndices, 1 + totalIndices, 0 + totalIndices, 3 + totalIndices, 2 + totalIndices);
                            totalIndices += 4;
                        }

                        // Bottom (y-)
                        if (!this.checkForBlock(chunk, block.x, block.y - 1, block.z)) {
                            vertices.push(block.x - 0.5, block.y - 0.5, block.z - 0.5);
                            vertices.push(block.x - 0.5, block.y - 0.5, block.z + 0.5);
                            vertices.push(block.x + 0.5, block.y - 0.5, block.z + 0.5);
                            vertices.push(block.x + 0.5, block.y - 0.5, block.z - 0.5);
                            UVs.push(block.lx, block.ly);
                            UVs.push(block.lx, block.hy);
                            UVs.push(block.hx, block.hy);
                            UVs.push(block.hx, block.ly);
                            indices.push(0 + totalIndices, 3 + totalIndices, 2 + totalIndices, 0 + totalIndices, 2 + totalIndices, 1 + totalIndices);
                            totalIndices += 4;
                        }

                        // Top (y+)
                        if (!this.checkForBlock(chunk, block.x, block.y + 1, block.z)) {
                            vertices.push(block.x - 0.5, block.y + 0.5, block.z + 0.5);
                            vertices.push(block.x - 0.5, block.y + 0.5, block.z - 0.5);
                            vertices.push(block.x + 0.5, block.y + 0.5, block.z - 0.5);
                            vertices.push(block.x + 0.5, block.y + 0.5, block.z + 0.5);
                            UVs.push(block.lx, block.hy);
                            UVs.push(block.lx, block.ly);
                            UVs.push(block.hx, block.ly);
                            UVs.push(block.hx, block.hy);
                            indices.push(1 + totalIndices, 3 + totalIndices, 2 + totalIndices, 1 + totalIndices, 0 + totalIndices, 3 + totalIndices);
                            totalIndices += 4;
                        }
                    }

                    let vertices2 = new Float32Array(vertices);
                    let indices2 = new Uint16Array(indices);
                    let UVs2 = new Float32Array(UVs);

                    let geometry = new THREE.BufferGeometry();

                    geometry.setAttribute('position', new THREE.BufferAttribute(vertices2, 3));
                    geometry.setAttribute('uv', new THREE.BufferAttribute(UVs2, 2));
                    geometry.setIndex(new THREE.BufferAttribute(indices2, 1));

                    geometry.computeVertexNormals();

                    let material = new THREE.MeshStandardMaterial({ map: grassTex, side: THREE.FrontSide });
                    this.chunkModel[x][y][z].model = new THREE.Mesh(geometry, material);

                    scene.add(this.chunkModel[x][y][z].model);
    }
}