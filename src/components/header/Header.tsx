import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axios';

interface HeaderProps {
    email?: string;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ email, onLogout }) => {
    const [theme, setTheme] = useState<string>('light');
    const navigate = useNavigate();
    const defaultProfilePicture = 'https://www.w3schools.com/w3images/avatar2.png';

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            document.body.className = savedTheme;
        }
    }, []);

    const handleProfileClick = () => {
        navigate('/profile', { state: { email } });
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.className = newTheme;
        localStorage.setItem('theme', newTheme);
    };

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/logout');
            onLogout();
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="bg-gray-800 text-white shadow-md">
            <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                <div className="text-lg font-semibold cursor-pointer" onClick={() => navigate('/home')}>
                    StockImages
                </div>
                <div className="flex items-center space-x-4">
                    {/* <button
                        onClick={() => navigate('/')}
                        className="text-white hover:text-gray-300"
                    >
                        Home
                    </button> */}
                    <button
                        onClick={() => navigate('/gallery')}
                        className="text-white hover:text-gray-300"
                    >
                        Your Images
                    </button>
                    <img
                        src={defaultProfilePicture}
                        alt="Profile"
                        onClick={handleProfileClick}
                        className="w-10 h-10 rounded-full cursor-pointer border border-gray-400"
                    />
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Header;
