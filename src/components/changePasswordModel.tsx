import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from '../axios/axios'; 
import React from 'react';
import axiosInstance from '../axios/axios';

interface ChangePasswordModalProps {
    show: boolean;
    onHide: () => void;
   currentPassword: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ show, onHide, currentPassword }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSaveChanges = async () => {
        try {
            const response = await axiosInstance.post('/profile/changePasword', {
                oldPassword,
                newPassword
            });

            if (response.status === 200) {
                alert("Password changed successfully");
                onHide(); 
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Error changing password');
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body  style={{color:'black'}} >
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <div className="mb-3">
                    <label htmlFor="oldPassword"className="form-label">Old Password</label>
                    <input
                        type="text"
                        className="form-control"
                        id="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                        type="text"
                        className="form-control"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSaveChanges}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangePasswordModal;
