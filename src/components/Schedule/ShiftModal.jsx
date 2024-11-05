import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select'; 
import { db } from '../services/firebase'; 
import { collection, getDocs } from 'firebase/firestore'; 
import './ShiftModal.css';

const ShiftModal = ({ show, handleClose, handleSave, handleDelete, shiftId, currentShiftData, userRole }) => {
    const [date, setDate] = useState(currentShiftData.date || '');
    const [startTime, setStartTime] = useState(currentShiftData.startTime || '');
    const [endTime, setEndTime] = useState(currentShiftData.endTime || '');
    const [assignedTo, setAssignedTo] = useState(currentShiftData.assignedTo || null);
    const [employees, setEmployees] = useState([]); // State for employees

    useEffect(() => {
        const fetchEmployees = async () => {
            const employeesSnapshot = await getDocs(collection(db, 'users'));
            const employeeOptions = employeesSnapshot.docs.map(doc => ({
                value: doc.id,
                label: doc.data().name // Assuming each employee has a 'name' field
            }));
            setEmployees(employeeOptions);
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        setDate(currentShiftData.date || '');
        setStartTime(currentShiftData.startTime || '');
        setEndTime(currentShiftData.endTime || '');
        setAssignedTo(currentShiftData.assignedTo || null);
    }, [currentShiftData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const roleNormalized = userRole.trim().toLowerCase(); 
        if (!shiftId && roleNormalized !== 'manager') {
            alert("Unauthorized: Only managers can add shifts.");
            return;
        }
    
        if (assignedTo) {
            handleSave({ date, startTime, endTime, assignedTo: assignedTo.value });
        } else {
            alert("Please select an employee.");
            return;
        }
    
        handleClose();
    };
    
    const handleDeleteClick = () => {
        const roleNormalized = userRole.trim().toLowerCase();
        if (!shiftId && roleNormalized !== 'manager') {
            alert("Unauthorized: Only managers can delete shifts.");
            return;
        }
        handleDelete(shiftId);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} className="shift-modal" centered>
            <Modal.Header>
                <button type="button" className="close" onClick={handleClose}>
                    &times; 
                </button>
                <Modal.Title>{shiftId ? "Edit Shift" : "Add New Shift"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formStartTime">
                        <Form.Label>Start Time</Form.Label>
                        <Form.Control
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formEndTime">
                        <Form.Label>End Time</Form.Label>
                        <Form.Control
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formAssignedTo">
                        <Form.Label>Assigned To</Form.Label>
                        <Select
                            options={employees}
                            value={assignedTo}
                            onChange={(option) => setAssignedTo(option ? option : null)} // Handle null case
                            placeholder="Select an employee"
                            isSearchable
                            required
                        />
                    </Form.Group>
                    <div className="modal-buttons">
                        <Button variant="primary" type="submit">
                            Save Shift
                        </Button>
                        <Button variant="danger" onClick={handleDeleteClick}>
                            Delete Shift
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ShiftModal;