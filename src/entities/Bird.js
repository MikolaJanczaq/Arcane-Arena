import { Enemy } from "./Enemy.js";
import { Sprite } from "../graphics/Sprite.js";

export class Bird extends Enemy {
    constructor(game) {
        super(game);

        this.speed = 0.7 + (this.game.worldLevel * 0.05);
        this.maxHp = 20 * this.difficultyMultiplier;
        this.hp = this.maxHp;
        this.damage = 8 * this.difficultyMultiplier;
        this.radius = 15;

        this.directionMap = {
            down: 0,
            up: 1,
            left: 2,
            right: 3
        };


        const image = new Image();
        image.src = "assets/enemies/Bird/Bird_Flight.png";
        this.sprite = new Sprite(this.game, image, 32, 32);
    }
}