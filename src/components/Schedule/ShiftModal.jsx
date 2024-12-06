import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select'; 
import './ShiftModal.css';

const ShiftModal = ({ show, handleClose, handleSave, handleDelete, shiftId, currentShiftData, userRole, employees }) => {
    const [date, setDate] = useState(currentShiftData.date || '');
    const [startTime, setStartTime] = useState(currentShiftData.startTime || '');
    const [endTime, setEndTime] = useState(currentShiftData.endTime || '');
    const [assignedTo, setAssignedTo] = useState(currentShiftData.assignedTo || null);

    useEffect(() => {
        setDate(currentShiftData.date || '');
        setStartTime(currentShiftData.startTime || '');
        setEndTime(currentShiftData.endTime || '');
        setAssignedTo(currentShiftData.assignedTo || null);
    }, [currentShiftData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (assignedTo) {
            handleSave({ 
                date, 
                startTime, 
                endTime, 
                assignedTo: assignedTo.value 
            });
        } else {
            alert("Please select an employee.");
            return;
        }
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
                            onChange={option => setAssignedTo(option ? option : null)}
                            placeholder="Select an employee"
                            isSearchable
                            required
                        />
                    </Form.Group>
                    <div className="modal-buttons">
                        <Button variant="primary" type="submit">
                            Save Shift
                        </Button>
                        {shiftId && (
                            <Button variant="danger" onClick={() => {
                                if (window.confirm("Are you sure you want to delete this shift?")) {
                                    handleDelete(shiftId);
                                }
                            }}>
                                Delete Shift
                            </Button>
                        )}
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ShiftModal;