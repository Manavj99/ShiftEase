
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCcH4zneT73CvuGb26-XxpKwRGfN_X5qUo",
    authDomain: "shiftease-49cf2.firebaseapp.com",
    projectId: "shiftease-49cf2",
    storageBucket: "shiftease-49cf2.appspot.com",
    messagingSenderId: "784573676526",
    appId: "1:784573676526:web:15716eb51b90bf9a9decff",
    measurementId: "G-5GNLW6YXP3"
  };
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth, analytics };
