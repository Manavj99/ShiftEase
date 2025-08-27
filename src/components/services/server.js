const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8443;
// Firebase Admin Setup
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({

});

// Middleware
app.use(cors({
    origin: 'http://cassini.cs.kent.edu:8443/api' // Adjust this to your client's URL
}));

app.use(express.json());

// Define routes
app.get('/api/users', async (req, res) => {
    try {
        const usersSnapshot = await admin.firestore().collection('users').get();
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/api/shifts/:orgId', async (req, res) => {
    const { orgId } = req.params;
    try {
        const shiftsSnapshot = await admin.firestore().collection('shifts').doc(orgId).collection('ShiftsData').get();
        const shifts = shiftsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(shifts);
    } catch (error) {
        console.error("Error fetching shifts:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/api/shifts', async (req, res) => {
    const shiftData = req.body;
    try {
        const orgRef = shiftData.organizationId; 
        const shiftsCollectionRef = admin.firestore().collection('shifts').doc(orgRef).collection('ShiftsData');
        const newShiftRef = shiftsCollectionRef.doc();
        await newShiftRef.set(shiftData);
        res.status(201).send("Shift added successfully!");
    } catch (error) {
        console.error("Error adding shift:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.delete('/api/shifts/:orgId/:shiftId', async (req, res) => {
    const { orgId, shiftId } = req.params;
    try {
        await admin.firestore().collection('shifts').doc(orgId).collection('ShiftsData').doc(shiftId).delete();
        res.status(200).send("Shift deleted successfully!");
    } catch (error) {
        console.error("Error deleting shift:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));