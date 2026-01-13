import { Sword } from "../weapons/Sword.js";
import { MagicWand } from "../weapons/MagicWand.js";
import { RotatingBlades } from "../weapons/RotatingBlades.js";

export class UpgradeManager {
    constructor(game) {
        this.game = game;

        this.weaponTypes = [
            { classRef: Sword, name: "Sword", desc: "Ranged melee attack" },
            { classRef: MagicWand, name: "Magic Wand", desc: "Shoots magic projectiles" },
            { classRef: RotatingBlades, name: "Rotating Blades", desc: "Blades spinning around you" }
        ];
    }

    getOptions(count = 3) {
        const possibleOptions = [];

        this.weaponTypes.forEach(type => {
            const existingWeapon = this.game.weapons.find(w => w.name === type.name);

            if (existingWeapon) {
                if (existingWeapon.level < 3) {
                    possibleOptions.push({
                        name: `Upgrade: ${type.name} (Lvl ${existingWeapon.level + 1})`,
                        desc: "Increases weapon power\n",
                        apply: () => existingWeapon.upgrade()
                    });
                }
            } else {
                if (this.game.weapons.length < 3) {
                    possibleOptions.push({
                        name: `Unlock: ${type.name}`,
                        desc: type.desc,
                        apply: () => {
                            const newWeapon = new type.classRef(this.game);
                            this.game.weapons.push(newWeapon);
                        }
                    });
                }
            }
        });

        possibleOptions.push({
            name: "Full Heal",
            desc: "Restore 100% HP",
            apply: () => {
                this.game.player.hp = this.game.player.maxHp;
            }
        });

        return possibleOptions.sort(() => 0.5 - Math.random()).slice(0, count);
    }
}