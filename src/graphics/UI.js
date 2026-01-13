export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 25;
        this.fontFamily = 'Arial';
        this.color = 'white';
    }

    draw(ctx) {
        ctx.save();

        const xpBarWidth = this.game.width;
        const xpBarHeight = 10;

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, xpBarWidth, xpBarHeight);

        const xpPercent = this.game.player.experience / this.game.player.experienceToNextLevel;
        ctx.fillStyle = '#00FFFF';
        ctx.fillRect(0, 0, xpBarWidth * xpPercent, xpBarHeight);

        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = 'black';
        ctx.font = this.fontSize + 'px ' + this.fontFamily;
        ctx.textAlign = 'right';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('Gold: ' + this.game.player.gold, this.game.width - 20, 40);

        const hpBarX = 20;
        const hpBarY = 25;
        const hpBarW = 200;
        const hpBarH = 20;

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(hpBarX, hpBarY, hpBarW, hpBarH);

        const hpPercent = this.game.player.hp / this.game.player.maxHp;
        ctx.fillStyle = 'red';
        ctx.fillRect(hpBarX, hpBarY, hpBarW * hpPercent, hpBarH);

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(hpBarX, hpBarY, hpBarW, hpBarH);

        if (!this.game.bossSpawned) {
            const timeLeft = Math.max(0, this.game.levelDuration - this.game.levelTimer);
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000).toString().padStart(2, '0');

            ctx.fillStyle = 'white';
            ctx.font = '30px ' + this.fontFamily;
            ctx.textAlign = 'center';
            ctx.fillText(`${minutes}:${seconds}`, this.game.width / 2, 80);
        } else {
            ctx.fillStyle = 'red';
            ctx.font = '30px ' + this.fontFamily;
            ctx.textAlign = 'center';
            ctx.fillText(`BOSS FIGHT`, this.game.width / 2, 80);
        }

        if (this.game.gameOver) {
            ctx.textAlign = 'center';
            ctx.font = '50px ' + this.fontFamily;
            ctx.fillStyle = 'white';
            ctx.fillText('GAME OVER', this.game.width * 0.5, this.game.height * 0.5);

            ctx.font = '20px ' + this.fontFamily;
            ctx.fillText('Odśwież stronę, aby zagrać ponownie', this.game.width * 0.5, this.game.height * 0.5 + 40);
        }

        ctx.restore();
    }
}