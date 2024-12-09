import { db } from '../../firebaseConfig';
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit,
    startAfter,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
} from 'firebase/firestore';

// Reference to the 'announcements' collection
const announcementsRef = collection(db, 'announcements');

// Add an Announcement
const addAnnouncement = async (announcement) => {
    try {
        const docRef = await addDoc(announcementsRef, {
            ...announcement,
            timestamp: serverTimestamp(), // Use Firestore's server timestamp
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding announcement:', error);
        throw error;
    }
};

// Fetch Announcements (with Pagination)
const fetchAnnouncements = async (lastVisible, pageSize = 5) => {
    try {
        const announcementsQuery = lastVisible
            ? query(announcementsRef, orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(pageSize))
            : query(announcementsRef, orderBy('timestamp', 'desc'), limit(pageSize));

        const snapshot = await getDocs(announcementsQuery);
        if (snapshot.empty) {
            return { announcements: [], lastVisible: null };
        }

        const announcements = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        const newLastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

        return { announcements, lastVisible: newLastVisible };
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
};

// Update an Announcement
const updateAnnouncement = async (id, updatedFields) => {
    try {
        const docRef = doc(db, 'announcements', id);
        await updateDoc(docRef, updatedFields);
    } catch (error) {
        console.error('Error updating announcement:', error);
        throw error;
    }
};

// Delete an Announcement
const deleteAnnouncement = async (id) => {
    try {
        const docRef = doc(db, 'announcements', id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting announcement:', error);
        throw error;
    }
};

// Export all functions
export {
    addAnnouncement,
    fetchAnnouncements,
    updateAnnouncement,
    deleteAnnouncement,
};
