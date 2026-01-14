import { Enemy } from "./Enemy.js";
import { Sprite } from "../graphics/Sprite.js";

export class Fox extends Enemy {
    constructor(game) {
        super(game);

        this.speed = 0.5;
        this.maxHp = 30;
        this.hp = this.maxHp;
        this.damage = 10;
        this.radius = 20;

        const image = new Image();
        image.src = "assets/enemies/Fox/Fox_Run.png";
        this.sprite = new Sprite(this.game, image, 32, 32);
    }
}