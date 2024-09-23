import React, { useEffect, useState } from 'react';
import axios from '../../axios/axios'; 
import { useLocation } from 'react-router-dom';
import ChangePasswordModal from '../../components/changePasswordModel'; // Adjust path as necessary
import axiosInstance from '../../axios/axios';

function ProfilePage() {
    const location = useLocation();
    const { email } = location.state || {};
    const defaultProfilePicture = 'https://img.freepik.com/premium-vector/business-global-economy_24877-41082.jpg?w=740';

    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: ''
    });
    
    const [showModal, setShowModal] = useState(false); // Controls modal visibility

    // Open the modal when the "Change Password" link is clicked
    const handleModalOpen = () => {
        setShowModal(true);
    };

    // Close the modal when done or cancelled
    const handleModalClose = () => {
        setShowModal(false);
    };

    // Fetch the profile details when the component mounts
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get(`/profile?email=${email}`);
                setProfile(response.data.userDetails);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };

        if (email) {
            fetchProfile();
        }
    }, [email]);

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="text-center">
                        <img 
                            src={defaultProfilePicture}
                            alt="Profile"
                            className="profile-image" 
                        />
                        <h2 className="mt-2">{profile.fullName}</h2>
                    </div>
                </div>
                <div className="col-md-8">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="fullName"
                                value={profile.fullName}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={profile.email}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                            <input
                                type="text"
                                className="form-control"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={profile.phoneNumber}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={profile.password}
                                readOnly
                            />
                            <small>
                                <a href="#" className="text-primary" onClick={handleModalOpen}>
                                    Change Password
                                </a>
                            </small>
                        </div>

                        <ChangePasswordModal
                            show={showModal}
                            onHide={handleModalClose}
                            currentPassword={profile.password} 
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
