import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import Button from 'react-bootstrap/Button';
import AddUserModal from './AddUserModal';
import AddRoleModal from './AddRoleModal';
import './addUser.css';

function AddUser() {
    const [userModalShow, setUserModalShow] = useState(false);
    const [roleModalShow, setRoleModalShow] = useState(false);
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const unsubscribeRoles = db.collection('roles').onSnapshot((snapshot) => {
            setRoles(snapshot.docs.map((doc) => doc.data().role));
        });

        const unsubscribeUsers = db.collection('users').onSnapshot((snapshot) => {
            setUsers(snapshot.docs.map((doc) => doc.data()));
        });

        return () => {
            unsubscribeRoles();
            unsubscribeUsers();
        };
    }, []);

    const addUser = (user) => {
        setUsers((prevUsers) => [...prevUsers, user]);
    };

    const addRole = (role) => {
        console.log("Role added:", role);
    };

    return (
        <div className="add-user-container">
            <Button variant="primary" onClick={() => setUserModalShow(true)}>
                Create User
            </Button>
            <Button variant="secondary" onClick={() => setRoleModalShow(true)}>
                Add Role
            </Button>

            <ul>
                {users.map((user, index) => (
                    <li key={index}>{user.name}</li>
                ))}
            </ul>

            <AddUserModal
                show={userModalShow}
                onHide={() => setUserModalShow(false)}
                roles={roles}
                addUser={addUser}
            />

            <AddRoleModal
                show={roleModalShow}
                onHide={() => setRoleModalShow(false)}
                addRole={addRole}
            />
        </div>
    );
}

export default AddUser;