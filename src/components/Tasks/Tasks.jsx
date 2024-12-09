import React, { useState, useEffect } from 'react';
import { addTask, updateTask, deleteTask } from '../services/taskService';
import { query, where, onSnapshot, collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase'; 
import './tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', shiftId: '' });
  const [employees, setEmployees] = useState([]); 
  const [shifts, setShifts] = useState([]); 
  const [loading, setLoading] = useState(true);

  const loggedInUserId = 'manager123'; // Manager/Admin ID
  const userId = 'employee123'; // Replace with the logged-in employee's ID if applicable

  const tasksCollection = collection(db, 'tasks'); // Firestore tasks collection reference

  // Fetch real-time tasks for the logged-in user
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(tasksCollection, where('assignedTo', '==', userId)), // Tasks for the logged-in employee
      (snapshot) => {
        const realTimeTasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTasks(realTimeTasks);
        setLoading(false);
      },
      (error) => {
        console.error('Error in real-time updates:', error);
        alert('Failed to load tasks in real-time.');
      }
    );

    return () => unsubscribe();
  }, [userId, tasksCollection]);

  // Fetch employees and shifts
  useEffect(() => {
    const fetchEmployees = async () => {
        const employeesCollection = collection(db, 'users'); // Ensure the collection name matches
        const snapshot = await getDocs(query(employeesCollection, where('role', '==', 'employee')));
        const employeeList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(employeeList);
        console.log('Fetched Employees:', employeeList); // Debugging: Log the fetched employees
      };
      

      const fetchShifts = async () => {
        const shiftsCollection = collection(db, 'shifts'); // Ensure the collection name matches
        const snapshot = await getDocs(shiftsCollection);
        const shiftList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShifts(shiftList);
        console.log('Fetched Shifts:', shiftList); // Debugging: Log the fetched shifts
      };
      

    fetchEmployees();
    fetchShifts();
  }, []);

  // Add a new task
  const handleAddTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.assignedTo || !newTask.shiftId) {
      alert('All fields are required');
      return;
    }
    try {
      await addTask({
        ...newTask,
        assignedBy: loggedInUserId, // Manager assigning the task
        status: 'Pending',
        createdAt: new Date(),
      });
      setNewTask({ title: '', description: '', assignedTo: '', shiftId: '' }); // Reset the form
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Failed to assign task. Please try again later.');
    }
  };

  // Update task status
  const handleUpdateStatus = async (taskId, status) => {
    try {
      await updateTask(taskId, { status });
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again later.');
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again later.');
    }
  };

  return (
    <div>
      <h1>My Tasks</h1>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          {/* Pending Tasks */}
          <h2>Pending</h2>
          <ul>
            {tasks.filter(task => task.status === 'Pending').map(task => (
              <li key={task.id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <button
                  className="complete"
                  onClick={() => handleUpdateStatus(task.id, 'In Progress')}
                >
                  Start Task
                </button>
                <button
                  className="delete"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete Task
                </button>
              </li>
            ))}
          </ul>

          {/* In Progress Tasks */}
          <h2>In Progress</h2>
          <ul>
            {tasks.filter(task => task.status === 'In Progress').map(task => (
              <li key={task.id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <button
                  className="complete"
                  onClick={() => handleUpdateStatus(task.id, 'Completed')}
                >
                  Complete Task
                </button>
              </li>
            ))}
          </ul>

          {/* Completed Tasks */}
          <h2>Completed</h2>
          <ul>
            {tasks.filter(task => task.status === 'Completed').map(task => (
              <li key={task.id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </li>
            ))}
          </ul>

          {/* Add New Task Section */}
          <div className="add-task-section">
            <h2>Assign a New Task</h2>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <textarea
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <select
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
            <select
              value={newTask.shiftId}
              onChange={(e) => setNewTask({ ...newTask, shiftId: e.target.value })}
            >
              <option value="">Select Shift</option>
              {shifts.map((shift) => (
                <option key={shift.id} value={shift.id}>
                  {shift.name}
                </option>
              ))}
            </select>
            <button className="add-task" onClick={handleAddTask}>
              Assign Task
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Tasks;
