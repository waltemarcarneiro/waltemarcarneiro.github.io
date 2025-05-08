import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCHOFjKBxvKhzLkk18vOhzmoKZyCPmevyM",
    authDomain: "waltemar-app.firebaseapp.com",
    projectId: "waltemar-app",
    storageBucket: "waltemar-app.firebasestorage.app",
    messagingSenderId: "385613786432",
    appId: "1:385613786432:web:2a98629d67efe7f4f89ea5",
    measurementId: "G-WPEEZ3H5X8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
