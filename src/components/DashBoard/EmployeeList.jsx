import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Dashboard.css'; 

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const employeeData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    email: doc.data().email,
                    role: doc.data().role,
                }));
                console.log("Fetched employees:", employeeData);
                setEmployees(employeeData);
            } catch (error) {
                console.error("Error fetching employees: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="employee-list">
            <h4>Employees</h4>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeList;