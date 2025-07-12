import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-secondary shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-white hover:text-accent transition-colors">
                    Stack<span className="text-accent">It</span>
                </Link> {/* <-- THIS IS THE FIX */}
                {/* Search bar can be added here */}
                <div className="flex items-center space-x-4">
                    <Link to="/ask" className="bg-accent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">
                        Ask Question
                    </Link>
                    {user ? (
                        <>
                            <NotificationBell />
                            <div className="relative">
                                <button onClick={() => setProfileOpen(!profileOpen)} className="bg-gray-700 h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">
                                    {user.username.charAt(0).toUpperCase()}
                                </button>
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-secondary rounded-md shadow-lg py-1">
                                        <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-600">
                                            Signed in as <br/> <strong className="font-medium text-white">{user.username}</strong>
                                        </div>
                                        <a href="#" onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-300 hover:bg-primary hover:text-white">
                                            Logout
                                        </a>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
                            <Link to="/register" className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;