// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Configuración de Firebase (obtén estos datos desde la consola de Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyD4PokJ5iAVJq79xjTYPVP8JeH_29hR7Cg",
    authDomain: "react-web-c4127.firebaseapp.com",
    databaseURL: "https://react-web-c4127-default-rtdb.firebaseio.com",
    projectId: "react-web-c4127",
    storageBucket: "react-web-c4127.appspot.com",
    messagingSenderId: "854458855058",
    appId: "1:854458855058:web:c138db0ade480bf715404b",
    measurementId: "G-5Z6N7JPPLW"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, onValue };
