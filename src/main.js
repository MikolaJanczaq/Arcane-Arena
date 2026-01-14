import { Game } from "./core/Game.js";
import { DataManager } from "./systems/DataManager.js";

let game = null;
let lastTime = 0;
let animationId = null;

const TARGET_WIDTH = 500;
let scale = 1;

const dataManager = new DataManager();

window.addEventListener("load", async function () {
    const canvas = document.getElementById("gameCanvas");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    await dataManager.loadData();

    const playBtn = document.getElementById('play-btn');
    playBtn.innerText = "PLAY";
    playBtn.disabled = false;

    updateUI();

    playBtn.addEventListener('click', startGame);
    setupShopButtons();

    document.getElementById('restart-btn').addEventListener('click', () => {
        location.reload();
    });

    document.getElementById('next-level-btn').addEventListener('click', () => {
        location.reload();
    });
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
    document.getElementById('victory-screen').classList.add('hidden');
    document.getElementById('levelup-screen').classList.add('hidden');

    const canvas = document.getElementById("gameCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    scale = canvas.width / TARGET_WIDTH;

    game = new Game(canvas.width / scale, canvas.height / scale, dataManager);

    if (game.input) {
        game.input.scale = scale;
    }

    lastTime = 0;
    animate(0);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        scale = canvas.width / TARGET_WIDTH;

        if(game) {
            game.width = canvas.width / scale;
            game.height = canvas.height / scale;
            game.input.scale = scale;
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

    context.save();
    context.scale(scale, scale);

    game.update(deltaTime);
    game.draw(context);

    context.restore();

    if (!game.gameOver) {
        animationId = requestAnimationFrame(animate);
    }
}