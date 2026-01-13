import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC2TVsITHyZB1-L_F2KuF8KyboTpC1rIQg",
    authDomain: "arcane-arena-13dff.firebaseapp.com",
    projectId: "arcane-arena-13dff",
    storageBucket: "arcane-arena-13dff.firebasestorage.app",
    messagingSenderId: "177018957754",
    appId: "1:177018957754:web:ee57cbcd714ae6b3f8f783"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, getDoc, setDoc, updateDoc };