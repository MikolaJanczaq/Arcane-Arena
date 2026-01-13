import { Game } from "./core/Game.js";
import { DataManager } from "./systems/DataManager.js";

let game = null;
let lastTime = 0;
let animationId = null;

const dataManager = new DataManager();

window.addEventListener("load", async function () {
    await dataManager.loadData();

    const playBtn = document.getElementById('play-btn');
    playBtn.innerText = "PLAY";
    playBtn.disabled = false;

    updateUI();

    playBtn.addEventListener('click', startGame);
    setupShopButtons();
});

function updateUI() {
    document.getElementById('menu-gold').innerText = dataManager.data.gold;

    updateShopButton('damage');
    updateShopButton('health');
    updateShopButton('speed');
}

function updateShopButton(type) {
    const level = dataManager.data.upgrades[type];
    const cost = dataManager.getUpgradeCost(type);

    document.getElementById(`lvl-${type}`).innerText = `Lvl ${level}`;

    const btn = document.getElementById(`buy-${type}`);
    btn.innerText = `${cost}g`;

    btn.disabled = dataManager.data.gold < cost;
}

function setupShopButtons() {
    ['damage', 'health', 'speed'].forEach(type => {
        document.getElementById(`buy-${type}`).addEventListener('click', () => {
            if (dataManager.buyUpgrade(type)) {
                updateUI();
            }
        });
    });
}

function startGame() {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');

    const canvas = document.getElementById("gameCanvas");
    // const context = canvas.getContext("2d"); //todo dont know

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    game = new Game(canvas.width, canvas.height, dataManager);

    lastTime = 0;
    animate(0);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if(game) {
            game.width = canvas.width;
            game.height = canvas.height;
        }
    });
}

function animate(timestamp) {
    if (!game) return;

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    game.update(deltaTime);
    game.draw(context);

    if (!game.gameOver) {
        animationId = requestAnimationFrame(animate);
    }
}