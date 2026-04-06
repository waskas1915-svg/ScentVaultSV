// firebase.js

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAW21g64pQ_sjPtv4BucApThJ3P8S1TqAI",
    authDomain: "scentvaultsv.firebaseapp.com",
    projectId: "scentvaultsv",
    storageBucket: "scentvaultsv.firebasestorage.app",
    messagingSenderId: "1087423307580",
    appId: "1:1087423307580:web:f372b5937f332a55c90839"
  };

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export { app };

