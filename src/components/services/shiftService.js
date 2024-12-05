import { db } from './firebase'; 
import { doc, setDoc, deleteDoc, getDoc, collection } from 'firebase/firestore';

// Function to fetch user role
export const fetchUserRole = async (userId) => {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
        return userDocSnap.data().role; // Adjust based on your data structure
    }
    return null;
};

// Function to edit a shift
export const editShift = async (shiftId, shiftData) => {
    const shiftDocRef = doc(db, 'shifts', shiftId);
    await setDoc(shiftDocRef, shiftData, { merge: true });
};

// Function to add a shift
export const addShift = async (shiftData) => {
    const orgRef = shiftData.organizationId; 
    const subgroupName = shiftData.subgroupName; 

    console.log("Shift Data:", shiftData); // Debugging line

    // Check the types of the values
    console.log("Organization ID:", orgRef);
    console.log("Subgroup Name:", subgroupName);

    const shiftsCollectionRef = collection(db, 'shifts', orgRef, 'ShiftsData');
    const newShiftRef = doc(shiftsCollectionRef); 

    await setDoc(newShiftRef, {
        assignedTo: shiftData.assignedTo,
        date: shiftData.date,
        startTime: shiftData.startTime,
        endTime: shiftData.endTime,
        totalHours: shiftData.totalHours.toString(),
        orgs: orgRef,
        subgroup: subgroupName
    });
};

// Function to delete a shift
export const deleteShift = async (orgId, shiftId) => {
    const shiftDocRef = doc(db, 'shifts', orgId, 'ShiftsData', shiftId);
    console.log("Deleting shift at:", shiftDocRef.path); // Log the document path
    await deleteDoc(shiftDocRef);
    return "Shift deleted successfully!";
};