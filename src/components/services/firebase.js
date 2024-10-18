import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

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
  export const auth = getAuth(app);
  export const db = getFirestore(app);  // This is your Firestore instance
  export const analytics = getAnalytics(app);