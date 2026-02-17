import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/v1/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Login to PlacementAI</h2>
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-indigo-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-indigo-200"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/auth/google`, {
                                        idToken: credentialResponse.credential
                                    });
                                    localStorage.setItem('token', res.data.token);
                                    navigate('/dashboard');
                                } catch (err) {
                                    console.error(err);
                                    setError('Google Login Failed');
                                }
                            }}
                            onError={() => {
                                setError('Google Login Failed');
                            }}
                        />
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
