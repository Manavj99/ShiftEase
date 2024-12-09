import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './Dashboard.css';
import AddEmployeeModal from './AddEmployeeModal';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './EmployeeList.css';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
    const [userSubgroupRef, setUserSubgroupRef] = useState(null);
    const [currentUserUid, setCurrentUserUid] = useState(null);
    const [currentUserRole, setCurrentUserRole] = useState(''); // Track user role

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                const uid = user.uid;
                setCurrentUserUid(uid);
                sessionStorage.setItem('currentUserUid', uid); // Store UID in session storage
                fetchEmployees(uid); // Fetch employees using the UID
            } else {
                setCurrentUserUid(null);
                sessionStorage.removeItem('currentUserUid'); // Clear UID from session storage
            }
        });

        return () => unsubscribe(); // Cleanup the subscription
    }, []);

    const fetchEmployees = async (uid) => {
        setLoading(true);
        try {
            const currentUserRef = doc(db, 'users', uid);
            const currentUserDoc = await getDoc(currentUserRef);
            if (!currentUserDoc.exists()) {
                console.error("Current user document does not exist.");
                setLoading(false);
                return;
            }
    
            const currentUserData = currentUserDoc.data();
            const orgRef = currentUserData['Shift Role']?.orgs;
            if (!orgRef) {
                console.error("Organization reference is missing in the current user's Shift Role.");
                setLoading(false);
                return;
            }
    
            const orgDoc = await getDoc(orgRef);
            if (!orgDoc.exists()) {
                console.error("Organization document does not exist.");
                setLoading(false);
                return;
            }
    
            const orgData = orgDoc.data();
            const subgroupRefs = Object.values(orgData.group || {});
            if (subgroupRefs.length === 0) {
                console.error("No subgroups found in the organization.");
                setLoading(false);
                return;
            }
    
            // Set the userSubgroupRef to the first subgroup reference (or adjust as needed)
            setUserSubgroupRef(subgroupRefs[0]);
    
            // Set the current user role
            setCurrentUserRole(currentUserData.role || ''); // Store the user's role
    
            const uniqueEmployees = new Set(); // To track unique employees
            const users = await Promise.all(subgroupRefs.map(async (subgroupRef) => {
                const subgroupDoc = await getDoc(subgroupRef);
                if (!subgroupDoc.exists()) {
                    return [];
                }
    
                const subgroupData = subgroupDoc.data();
                const subgroupName = subgroupData.name; // Fetch the subgroup name
                const allUsers = [
                    ...Object.values(subgroupData.employee || {}),
                    ...Object.values(subgroupData.managers || {}),
                    ...Object.values(subgroupData.owner || {})
                ];
    
                return Promise.all(allUsers.map(async (userRef) => {
                    const userDoc = await getDoc(userRef);
                    if (!userDoc.exists()) {
                        return null;
                    }
                    const userData = userDoc.data();
                    const employeeId = userDoc.id;
    
                    // Check if the employee is already added
                    if (!uniqueEmployees.has(employeeId)) {
                        uniqueEmployees.add(employeeId); // Add to the set
                        return {
                            id: employeeId,
                            name: `${userData.firstName} ${userData.lastName}`,
                            email: userData.email,
                            role: userData.role || 'N/A',
                            subgroup: subgroupName, // Use the fetched subgroup name
                            phoneNumber: userData.phoneNumber,
                            studentId: userData.studentId
                        };
                    }
                    return null; // Skip duplicates
                }));
            }));
    
            const employeeData = users.flat().filter(user => user !== null);
            setEmployees(employeeData);
        } catch (error) {
            console.error("Error fetching employees: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmployee = async (name, email, role) => {
        if (!userSubgroupRef) {
            console.error('User subgroup reference is not set.');
            alert('User subgroup reference is not set.');
            return;
        }
        if (!currentUserUid) {
            console.error('Current user UID is not set.');
            alert('Current user UID is not set.');
            return;
        }

        try {
            const currentUserRef = doc(db, 'users', currentUserUid);
            const currentUserDoc = await getDoc(currentUserRef);
            if (!currentUserDoc.exists()) {
                console.error("Current user document does not exist.");
                alert("Failed to fetch current user data.");
                return;
            }
            const currentUserData = currentUserDoc.data();
            if (!currentUserData || !currentUserData['Shift Role']) {
                console.error("Shift Role data is missing.");
                alert("Shift Role data is missing.");
                return;
            }

            // Check if the user is a manager or owner
            const userRole = currentUserData.role;
            if (userRole !== 'manager' && userRole !== 'owner') {
                console.error("Only managers or owners can add employees.");
                alert("Only managers or owners can add employees.");
                return;
            }

            const subgroupDoc = await getDoc(userSubgroupRef);
            if (!subgroupDoc.exists()) {
                console.error("Subgroup document does not exist.");
                alert("Subgroup document does not exist.");
                return;
            }
            const subgroupData = subgroupDoc.data();
            const pendingUpdates = {
                ...(subgroupData.pending || {}),
                [name]: { email, role, shiftRole: currentUserData['Shift Role'] }
            };

            await updateDoc(userSubgroupRef, { pending: pendingUpdates });
            alert('Employee added successfully!');
        } catch (error) {
            console.error("Error adding employee: ", error);
            alert(`Error adding employee: ${error.message}. Please try again.`);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h4>Employees</h4>
            {/* Conditionally render the Add Employee button based on user role */}
            {(currentUserRole === 'manager' || currentUserRole === 'owner') && (
                <button onClick={() => setShowAddEmployeeModal(true)}>
                    Add Employee
                </button>
            )}
            {showAddEmployeeModal && (
                <AddEmployeeModal 
                    onClose={() => setShowAddEmployeeModal(false)} 
                    onAddEmployee={handleAddEmployee} 
                />
            )}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Subgroup</th>
                        <th>Phone Number</th>
                        <th>Student ID</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.length > 0 ? (
                        employees.map(employee => (
                            <tr key={employee.id}>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.role}</td>
                                <td>{employee.subgroup}</td>
                                <td>{employee.phoneNumber}</td>
                                <td>{employee.studentId}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No employees found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeList;