import {Game} from "./Game.js";

window.addEventListener("load", function () {
    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;

    function animate(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        game.update(deltaTime);
        game.draw(context);

        requestAnimationFrame(animate);
    }

    animate(0);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.width = canvas.width;
        game.height = canvas.height;
    });
});
