import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { getDocs, collection } from 'firebase/firestore';
import { realtimeDb, db } from '../services/firebase';
import ShiftModal from './ShiftModal';
import { addShift, editShift, deleteShift, fetchUserRole } from '../services/shiftService';
import moment from 'moment';
import { getAuth } from 'firebase/auth';
import './ShiftModal.css';

const Scheduler = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentShiftId, setCurrentShiftId] = useState(null);
    const [currentShiftData, setCurrentShiftData] = useState({});
    const [userRole, setUserRole] = useState('');
    const [employees, setEmployees] = useState([]);
    const [currentWeek, setCurrentWeek] = useState(moment().startOf('week'));
    const [view, setView] = useState('full');
    const [currentUserName, setCurrentUserName] = useState('');
    const [userId, setUserId] = useState(null);  // State for user ID

    // Get the current user's ID
    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setUserId(user.uid);
            console.log("Current User ID:", user.uid);  // Debugging log
        } else {
            console.error("No user is currently logged in");
        }
    }, []);

    // Fetch user role
    useEffect(() => {
        const getUserRole = async () => {
            const role = await fetchUserRole();
            if (role) {
                setUserRole(role);
            } else {
                alert("You are not logged in. Please log in to access this feature.");
            }
        };
        getUserRole();
    }, []);

    // Fetch shifts from the Realtime Database
    useEffect(() => {
        const shiftsRef = ref(realtimeDb, 'shifts');
        onValue(shiftsRef, (snapshot) => {
            const shifts = [];
            snapshot.forEach((childSnapshot) => {
                const shiftData = childSnapshot.val();
                const startDateTime = new Date(`${shiftData.date}T${shiftData.startTime}:00Z`);
                const endDateTime = new Date(`${shiftData.date}T${shiftData.endTime}:00Z`);
                
                shifts.push({
                    id: childSnapshot.key,
                    title: `Shift for ${shiftData.assignedTo}`,
                    start: startDateTime,
                    end: endDateTime,
                    assignedTo: shiftData.assignedTo
                });
            });
            console.log("Fetched shifts:", shifts); // Log the fetched shifts
            setEvents(shifts);
        });
    }, []);

    // Fetch employees and set current user name
    useEffect(() => {
        const fetchEmployees = async () => {
            if (!userId) return;  // Only fetch if userId is available

            const employeesSnapshot = await getDocs(collection(db, 'users'));
            const employeeList = employeesSnapshot.docs.map(doc => ({
                value: doc.id,
                label: doc.data().name
            }));
            setEmployees(employeeList);
            console.log("Employee List:", employeeList); // Log the employee list

            // Set the current user's name
            const currentUser = employeeList.find(emp => emp.value === userId);
            console.log("Current User:", currentUser); // Log the current user

            if (currentUser) {
                setCurrentUserName(currentUser.label);
                console.log("Current User Name:", currentUser.label); // Log the current user's name
            } else {
                console.error("Current user not found in employee list.");
            }
        };
        fetchEmployees();
    }, [userId]);
    
    const handleSelect = () => {
        if (userRole === 'manager') {
            setCurrentShiftId(null);
            setCurrentShiftData({});
            setShowModal(true);
        } else {
            alert("Unauthorized: Only managers can add shifts.");
        }
    };

    const handleEdit = (event) => {
        if (userRole === 'manager') {
            setCurrentShiftId(event.id);
            setCurrentShiftData({
                date: moment(event.start).format('YYYY-MM-DD'),
                startTime: moment(event.start).format('HH:mm'),
                endTime: moment(event.end).format('HH:mm'),
                assignedTo: event.assignedTo
            });
            setShowModal(true);
        } else {
            alert("Unauthorized: Only managers can edit shifts.");
        }
    };

    const handleSave = async (shiftData) => {
        if (currentShiftId) {
            await editShift(currentShiftId, shiftData);
        } else {
            await addShift(shiftData);
        }
        setShowModal(false);
    };

    const handleDelete = async (shiftId) => {
        await deleteShift(shiftId);
        setShowModal(false);
    };

    const weekDates = Array.from({ length: 7 }, (_, i) => currentWeek.clone().add(i, 'days'));

    const goToNextWeek = () => {
        setCurrentWeek(currentWeek.clone().add(1, 'weeks'));
    };

    const goToPreviousWeek = () => {
        setCurrentWeek(currentWeek.clone().subtract(1, 'weeks'));
    };

    return (
        <div className="scheduler-container">
            <div className="week-navigation">
                <button onClick={goToPreviousWeek}>Previous Week</button>
                <span>{currentWeek.format('MMMM D, YYYY')} - {currentWeek.clone().add(6, 'days').format('MMMM D, YYYY')}</span>
                <button onClick={goToNextWeek}>Next Week</button>
            </div>
            <div className="view-toggle">
                <nav>
                    <ul>
                        <li onClick={() => setView('full')} className={view === 'full' ? 'active' : ''}>Full Schedule</li>
                        <li onClick={() => setView('my')} className={view === 'my' ? 'active' : ''}>My Schedule</li>
                    </ul>
                </nav>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Employee</th>
                        {weekDates.map(date => (
                            <th key={date.format('YYYY-MM-DD')}>{date.format('dddd, MMM D')}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {view === 'my' ? (
                        <tr>
                           <td>{currentUserName || 'Loading...'}</td> 
                            {weekDates.map(date => {
                                const shiftsForDate = events.filter(event => 
                                    event.assignedTo === userId && moment(event.start).isSame(date, 'day')
                                );

                                console.log(`Shifts for ${date.format('YYYY-MM-DD')}:`, shiftsForDate); // Debugging log

                                return (
                                    <td key={date.format('YYYY-MM-DD')}>
                                        {shiftsForDate.map(shift => (
                                            <div key={shift.id} onClick={() => handleEdit(shift)}>
                                                {shift.title} ({moment(shift.start).format('h:mm A')} - {moment(shift.end).format('h:mm A')})
                                            </div>
                                        ))}
                                        <button onClick={handleSelect}>Add Shift</button>
                                    </td>
                                );
                            })}
                        </tr>
                    ) : (
                        employees.map(employee => (
                            <tr key={employee.value}>
                                <td>{employee.label}</td>
                                {weekDates.map(date => {
                                    const shiftsForDate = events.filter(event => 
                                        event.assignedTo === employee.value && moment(event.start).isSame(date, 'day')
                                    );

                                    return (
                                        <td key={date.format('YYYY-MM-DD')}>
                                            {shiftsForDate.map(shift => (
                                                <div key={shift.id} onClick={() => handleEdit(shift)}>
                                                    {shift.title} ({moment(shift.start).format('h:mm A')} - {moment(shift.end).format('h:mm A')})
                                                </div>
                                            ))}
                                            <button onClick={handleSelect}>Add Shift</button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <ShiftModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleSave={handleSave}
                handleDelete={handleDelete}
                shiftId={currentShiftId}
                currentShiftData={currentShiftData}
                userRole={userRole}
            />
        </div>
    );
};

export default Scheduler;