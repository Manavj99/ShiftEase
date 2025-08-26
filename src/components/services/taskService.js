import { db } from './firebase'; // Import your Firebase configuration
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  doc,
} from 'firebase/firestore';

// Reference to tasks collection
const tasksCollection = collection(db, 'tasks');

// 1. Fetch Tasks
export const fetchTasks = async (userId, shiftId) => {
  const tasksQuery = query(
    tasksCollection,
    where('assignedTo', '==', userId),
    where('shiftId', '==', shiftId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(tasksQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// 2. Add Task
export const addTask = async (task) => {
  await addDoc(tasksCollection, {
    ...task,
    createdAt: Timestamp.now(),
  });
};

// 3. Update Task
export const updateTask = async (taskId, updatedFields) => {
  const taskDoc = doc(db, 'tasks', taskId);
  await updateDoc(taskDoc, updatedFields);
};

// 4. Delete Task
export const deleteTask = async (taskId) => {
  const taskDoc = doc(db, 'tasks', taskId);
  await deleteDoc(taskDoc);
};
