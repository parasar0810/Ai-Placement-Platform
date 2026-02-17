import { useState } from 'react';
import axios from 'axios';
import { Shield, Plus, Upload } from 'lucide-react';

const AdminDashboard = () => {
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('EASY');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/v1/dsa/questions', {
                title, topic, difficulty, description, link
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Question added successfully!');
            setTitle('');
            setTopic('');
            setDescription('');
            setLink('');
        } catch (err) {
            console.error(err);
            setMessage('Failed to add question. Ensure you have ADMIN role.');
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
                <Shield size={32} className="text-red-600" />
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Plus size={20} /> Add DSA Question
                </h2>

                {message && (
                    <div className={`p-3 rounded mb-4 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none h-32"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Problem Link</label>
                        <input
                            type="url"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition font-medium flex items-center justify-center gap-2"
                    >
                        <Upload size={18} /> Add Question
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
