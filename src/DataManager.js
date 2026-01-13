import { db, doc, setDoc, getDoc } from "./FirebaseConfig.js";

export class DataManager {
    constructor() {
        this.data = {
            gold: 0,
            upgrades: {
                damage: 0,
                health: 0,
                speed: 0
            }
        };

        this.userId = localStorage.getItem('arcane_arena_id');
        if (!this.userId) {
            this.userId = 'user_' + Math.random().toString(36).slice(2, 9);
            localStorage.setItem('arcane_arena_id', this.userId);
        }
    }

    async loadData() {
        console.log("Loading data from Firebase...");
        const docRef = doc(db, "players", this.userId);
        const docSnap = await getDoc(docRef);

        try {
            if (docSnap.exists()) {
                this.data = docSnap.data();
                console.log("Data loaded", this.data);
            } else {
                console.log("New player - saving default data");
                await this.saveData();
            }
        } catch (e) {
            console.error("Firebase error : ", e);
        }
    }

    async saveData() {
        const docRef = doc(db, "players", this.userId);
        await setDoc(docRef, this.data);
        console.log("Data saved");
    }

    addGold(amount) {
        this.data.gold += amount;
        this.saveData();
    }

    getUpgradeCost(type) {
        const level = this.data.upgrades[type];
        const baseCost = 100;
        return baseCost * (level + 1);
    }

    buyUpgrade(type) {
        const cost = this.getUpgradeCost(type);
        if (this.data.gold >= cost) {
            this.data.gold -= cost;
            this.data.upgrades[type]++;
            this.saveData();
            return true;
        }
        return false;
    }
}