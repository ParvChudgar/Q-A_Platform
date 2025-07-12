import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            login(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-secondary p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-center text-white mb-6">Login to StackIt</h2>
            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                           className="w-full bg-primary border border-gray-600 rounded-md p-2 mt-1 text-white"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                           className="w-full bg-primary border border-gray-600 rounded-md p-2 mt-1 text-white"/>
                </div>
                <button type="submit" className="w-full bg-accent hover:bg-blue-600 text-white font-bold py-2 rounded">
                    Login
                </button>
            </form>
            <p className="text-center mt-4 text-sm text-gray-400">
                New to StackIt? <Link to="/register" className="text-blue-400 hover:underline">Register here</Link>
            </p>
        </div>
    );
};

export default LoginPage;