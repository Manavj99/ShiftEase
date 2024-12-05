import React, { useState, useEffect, useCallback } from 'react';
import { getDocs, collection, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ShiftModal from './ShiftModal';
import moment from 'moment';
import './ShiftModal.css';
import { fetchUserRole, deleteShift } from '../services/shiftService';

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
    const [userId, setUserId] = useState(sessionStorage.getItem('currentUserId') || null);
    const [userOrgs, setUserOrgs] = useState([]);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                sessionStorage.setItem('currentUserId', user.uid);
                const storedName = sessionStorage.getItem('currentUserName');
                setCurrentUserName(storedName || 'User');
            } else {
                console.error("No user is currently logged in");
            }
        });
    }, []);

    useEffect(() => {
        const getUserRoleAndOrgs = async () => {
            const storedUserId = sessionStorage.getItem('currentUserId');
            if (!storedUserId) return;

            try {
                const role = await fetchUserRole(storedUserId);
                if (role) {
                    setUserRole(role);
                    const userDocRef = doc(db, 'users', storedUserId);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        const orgRef = userData['Shift Role']?.orgs;
                        if (orgRef) {
                            const orgDocSnap = await getDoc(orgRef);
                            if (orgDocSnap.exists()) {
                                setUserOrgs([orgDocSnap.id]);
                                await fetchEmployeesFromOrg(orgDocSnap.data());
                            }
                        }
                    }
                } else {
                    alert("You are not logged in. Please log in to access this feature.");
                }
            } catch (error) {
                console.error("Error fetching user role and organizations:", error);
            }
        };
        getUserRoleAndOrgs();
    }, []);

    const fetchEmployeesFromOrg = async (orgData) => {
        const subgroupRefs = Object.values(orgData.group || {});
        const uniqueEmployees = new Map();

        for (const subgroupRef of subgroupRefs) {
            const subgroupDoc = await getDoc(subgroupRef);
            if (subgroupDoc.exists()) {
                const subgroupData = subgroupDoc.data();
                const allUsers = [
                    ...Object.values(subgroupData.employee || {}),
                    ...Object.values(subgroupData.managers || {})
                ];

                await Promise.all(allUsers.map(async (userRef) => {
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const employeeId = userDoc.id;
                        const employeeName = `${userData.firstName} ${userData.lastName}`;

                        if (!uniqueEmployees.has(employeeName)) {
                            uniqueEmployees.set(employeeName, {
                                value: employeeId,
                                label: employeeName,
                                email: userData.email,
                                role: userData.role || 'N/A',
                                phoneNumber: userData.phoneNumber,
                                studentId: userData.studentId
                            });
                        }
                    }
                }));
            }
        }

        setEmployees(Array.from(uniqueEmployees.values()));
    };

    const fetchSubgroupName = async (subgroupRef) => {
        const subgroupDocSnap = await getDoc(subgroupRef);
        return subgroupDocSnap.exists() ? subgroupDocSnap.data().name : 'Unknown Subgroup';
    };

    const fetchShifts = useCallback(async () => {
        console.log("Fetching shifts...");
        try {
            const shifts = [];
            for (const orgId of userOrgs) {
                const shiftsCollectionRef = collection(db, 'shifts', orgId, 'ShiftsData');
                const snapshot = await getDocs(shiftsCollectionRef);
                
                for (const doc of snapshot.docs) {
                    const shiftData = doc.data();
                    const assignedEmployeeId = shiftData.assignedTo.id;
                    const assignedEmployee = employees.find(employee => employee.value === assignedEmployeeId);
                    
                    if (assignedEmployee) {
                        shifts.push({
                            id: doc.id,
                            title: `Shift for ${assignedEmployee.label}`,
                            start: new Date(`${shiftData.date}T${shiftData.startTime}:00Z`),
                            end: new Date(`${shiftData.date}T${shiftData.endTime}:00Z`),
                            assignedTo: assignedEmployee.value,
                            subgroupName: await fetchSubgroupName(shiftData.subgroup),
                        });
                    } else {
                        console.warn(`Assigned employee not found for ID: ${assignedEmployeeId}`);
                    }
                }
            }
            console.log("Fetched shifts:", shifts);
            setEvents(shifts);
        } catch (error) {
            console.error("Error fetching shifts:", error);
        }
    }, [userId, userOrgs, employees]);

    useEffect(() => {
        fetchShifts(); // Fetch shifts on component mount
    }, [fetchShifts]); // Now fetchShifts is a dependency

    const handleDelete = async (shiftId) => {
        console.log("Attempting to delete shift with ID:", shiftId);
        if (userRole === 'manager' || userRole === 'owner') {
            try {
                await deleteShift(userOrgs[0], shiftId); // Pass the orgId along with shiftId
                alert("Shift deleted successfully!");
                setShowModal(false);
                fetchShifts(); // Refresh shifts after deletion
            } catch (error) {
                console.error("Error deleting shift:", error);
                alert(`Error deleting shift: ${error.message}`);
            }
        } else {
            alert("Unauthorized: Only managers or owners can delete shifts.");
        }
    };
    const handleEdit = (event) => {
        if (userRole === 'manager' || userRole === 'owner') {
            setCurrentShiftId(event.id);
            setCurrentShiftData({
                date: moment(event.start).format('YYYY-MM-DD'),
                startTime: moment(event.start).format('HH:mm'),
                endTime: moment(event.end).format('HH:mm'),
                assignedTo: employees.find(emp => emp.value === event.assignedTo) || null
            });
            setShowModal(true);
        } else {
            alert("Unauthorized: Only managers or owners can edit shifts.");
        }
    };

    const handleSelect = () => {
        if (userRole === 'manager' || userRole === 'owner') {
            setCurrentShiftId(null);
            setCurrentShiftData({});
            setShowModal(true);
        } else {
            alert("Unauthorized: Only managers or owners can add shifts.");
        }
    };
    const handleSave = async (shiftData, shiftId) => {
        try {
            const storedUserId = sessionStorage.getItem('currentUserId');
            const userDocRef = doc(db, 'users', storedUserId);
            const userDocSnap = await getDoc(userDocRef);
    
            if (!userDocSnap.exists()) {
                alert("User document does not exist.");
                return;
            }
    
            const userData = userDocSnap.data();
            const orgRef = userData['Shift Role']?.orgs; 
            const subgroup = userData['Shift Role']?.subgroup; 
    
            if (!orgRef) {
                alert("No organization found for the user.");
                return;
            }
    
            const orgDocSnap = await getDoc(orgRef);
            if (!orgDocSnap.exists()) {
                alert("Organization document does not exist.");
                return;
            }
    
            const assignedEmployee = employees.find(employee => employee.value === shiftData.assignedTo);
            if (!assignedEmployee) {
                alert("Assigned user not found.");
                return;
            }
    
            const assignedUserDocRef = doc(db, 'users', assignedEmployee.value);
            const assignedUserDocSnap = await getDoc(assignedUserDocRef);
            if (!assignedUserDocSnap.exists()) {
                alert("Assigned user document does not exist.");
                return;
            }
    
            const startDateTime = new Date(`${shiftData.date}T${shiftData.startTime}:00Z`);
            const endDateTime = new Date(`${shiftData.date}T${shiftData.endTime}:00Z`);
            const totalHours = (endDateTime - startDateTime) / 3600000;
    
            const shiftsCollectionRef = collection(db, 'shifts', orgDocSnap.id, 'ShiftsData');
            const shiftRef = shiftId ? doc(shiftsCollectionRef, shiftId) : doc(shiftsCollectionRef);
    
            await setDoc(shiftRef, {
                subgroupName: subgroup,
                assignedTo: assignedUserDocRef,
                date: shiftData.date,
                startTime: shiftData.startTime,
                endTime: shiftData.endTime,
                totalHours: totalHours.toString(),
                orgs: orgRef,
                subgroup: subgroup
            }, { merge: true });
    
            alert("Shift stored successfully!");
            setShowModal(false);
            fetchShifts(); // Refresh shifts after saving
        } catch (error) {
            console.error("Error saving shift:", error);
            alert(`Error saving shift: ${error.message}`);
        }
    };

    const weekDates = Array.from({ length: 7 }, (_, i) => currentWeek.clone().add(i, 'days'));

    const goToNextWeek = () => {
        setCurrentWeek(currentWeek.clone().add(1, 'weeks'));
    };

    const goToPreviousWeek = () => {
        setCurrentWeek(currentWeek.clone().subtract(1, 'weeks'));
    };

    return (
        <div key={events.length} className="scheduler-container">
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
                return (
                    <td key={date.format('YYYY-MM-DD')}>
                        {shiftsForDate.length > 0 ? (
                            shiftsForDate.map(shift => (
                                <div key={shift.id} onClick={() => handleEdit(shift)}>
                                    {shift.title} ({moment(shift.start).format('h:mm A')} - {moment(shift.end).format('h:mm A')})
                                    <div>Subgroup: {shift.subgroupName}</div>
                                </div>
                            ))
                        ) : (
                            <div>No Shifts</div>
                        )}
                        {userRole === 'manager' || userRole === 'owner' ? (
                            <button onClick={handleSelect}>Add Shift</button>
                        ) : null}
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
                            {shiftsForDate.length > 0 ? (
                                shiftsForDate.map(shift => (
                                    <div key={shift.id} onClick={() => handleEdit(shift)}>
                                        {shift.title} ({moment(shift.start).format('h:mm A')} - {moment(shift.end).format('h:mm A')})
                                        <div>Subgroup: {shift.subgroupName}</div>
                                    </div>
                                ))
                            ) : (
                                <div>No Shifts</div>
                            )}
                            {userRole === 'manager' || userRole === 'owner' ? (
                                <button onClick={handleSelect}>Add Shift</button>
                            ) : null}
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
                employees={employees}
            />
        </div>
    );
};

export default Scheduler;