class Block {
    constructor(x, y, z, type) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.type = type;
        this.lx;
        this.hx;
        this.ly;
        this.hy;

        switch (type) {
            case "grass":
                this.lx = 0.0;
                this.ly = 0.9;
                break;
            case "dirt":
                this.lx = 0.1;
                this.ly = 0.9;
                break;
            case "stone":
                this.lx = 0.2;
                this.ly = 0.9;
                break;
        }

        this.hx = this.lx + 0.1 - 0.033333333;
        this.hy = this.ly + 0.1 - 0.033333333;

        this.lx += 0.033333333;
        this.ly += 0.033333333;

    }
}