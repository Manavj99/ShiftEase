import { realtimeDb } from './firebase'; 
import { ref, set, remove } from 'firebase/database'; 
import { db } from './firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Function to synchronize user role to Realtime Database
const syncUserRoleToRealtimeDb = async (userId) => {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        const role = userDocSnap.data().role;
        const roleRef = ref(realtimeDb, `roles/${userId}`);
        await set(roleRef, { role });
        console.log(`User role synchronized for ${userId}: ${role}`);
    } else {
        console.error("No such user document!");
    }
};

const addShift = async (shiftData) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("User is not authenticated.");
        return;
    }

    try {
        const newShiftRef = ref(realtimeDb, `shifts/${new Date().getTime()}`);
        await set(newShiftRef, shiftData);
        console.log("Shift added with ID: ", newShiftRef.key);
        return newShiftRef.key;
    } catch (error) {
        console.error("Error adding shift: ", error.message);
        throw error;
    }
};

const editShift = async (shiftId, shiftData) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("User is not authenticated.");
        return;
    }

    try {
        const shiftRef = ref(realtimeDb, `shifts/${shiftId}`);
        await set(shiftRef, shiftData);
        console.log("Shift edited with ID: ", shiftId);
    } catch (error) {
        console.error("Error editing shift: ", error);
        throw error;
    }
};

const deleteShift = async (shiftId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("User is not authenticated.");
        return;
    }

    try {
        const shiftRef = ref(realtimeDb, `shifts/${shiftId}`);
        await remove(shiftRef);
        console.log("Shift deleted with ID: ", shiftId);
    } catch (error) {
        console.error("Error deleting shift: ", error);
        throw error;
    }
};

// Fetch user role function remains unchanged
export const fetchUserRole = async () => {
    const auth = getAuth();
    const user = auth.currentUser; // Get the current user

    if (!user) {
        console.error("User is not authenticated.");
        return null; // Return null if no user is authenticated
    }

    const userId = user.uid; // Get the current user's ID
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        const role = userDocSnap.data().role;
        console.log("Fetched user role:", role);
        return role;
    } else {
        console.error("No such user document!");
        return null;
    }
};

export { syncUserRoleToRealtimeDb, addShift, editShift, deleteShift };