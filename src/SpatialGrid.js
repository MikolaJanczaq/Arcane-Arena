export class SpatialGrid {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.buckets = new Map();
    }

    clear() {
        this.buckets.clear();
    }

    add(enemy) {
        const col = Math.floor(enemy.worldX / this.cellSize);
        const row = Math.floor(enemy.worldY / this.cellSize);
        const key = `${col}_${row}`;

        if (!this.buckets.has(key)) {
            this.buckets.set(key, []);
        }
        this.buckets.get(key).push(enemy);
    }

    getNearby(x, y) {
        const enemies = [];

        const ceterCol = Math.floor(x / this.cellSize);
        const centerRow = Math.floor(y / this.cellSize);

        for (let i=-1; i<=1; i++) {
            for (let j=-1; j<=1; j++) {
                const col = ceterCol + i;
                const row = centerRow + j;
                const key = `${col}_${row}`;

                if (this.buckets.has(key)) {
                    enemies.push(...this.buckets.get(key));
                }
            }
        }
        return enemies;
    }
}