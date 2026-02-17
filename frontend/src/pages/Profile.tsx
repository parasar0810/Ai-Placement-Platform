import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Award, BookOpen, GraduationCap, Github, Linkedin, Save } from 'lucide-react';

interface UserProfile {
    id: string;
    user: {
        fullName: string;
        email: string;
    };
    resumeUrl: string;
    skills: string;
    university: string;
    degree: string;
    graduationYear: number;
    githubProfile: string;
    linkedinProfile: string;
    resumeScore: number;
}

const Profile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<UserProfile>>({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/student/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data);
            setFormData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            // Ensure nested user object is handled if needed, usually backend updates profile fields
            // For this implementation, we focus on profile fields.

            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/student/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsEditing(false);
            fetchProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading profile...</div>;
    if (!profile) return <div className="p-8 text-center text-red-500">Failed to load profile.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header / Basic Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-3xl font-bold">
                    {profile.user.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{profile.user.fullName}</h1>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <Mail size={16} />
                        <span>{profile.user.email}</span>
                    </div>
                </div>
                <div className="ml-auto">
                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors ${isEditing
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                    >
                        {isEditing ? <Save size={18} /> : null}
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                    {isEditing && (
                        <button
                            onClick={() => { setIsEditing(false); setFormData(profile); }}
                            className="ml-2 px-4 py-2 rounded-md font-medium text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Academic Details */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <GraduationCap className="text-orange-500" /> Academic Details
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">University</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.university || ''}
                                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                    className="w-full mt-1 p-2 border rounded-md"
                                />
                            ) : (
                                <p className="text-gray-900">{profile.university || 'Not set'}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Degree</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.degree || ''}
                                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                    className="w-full mt-1 p-2 border rounded-md"
                                />
                            ) : (
                                <p className="text-gray-900">{profile.degree || 'Not set'}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={formData.graduationYear || ''}
                                    onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                                    className="w-full mt-1 p-2 border rounded-md"
                                />
                            ) : (
                                <p className="text-gray-900">{profile.graduationYear || 'Not set'}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Professional Links & Skills */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <BookOpen className="text-indigo-500" /> Skills & Links
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Skills</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.skills || ''}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    className="w-full mt-1 p-2 border rounded-md"
                                    placeholder="Java, React, Spring Boot..."
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {profile.skills ? profile.skills.split(',').map((skill, i) => (
                                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                            {skill.trim()}
                                        </span>
                                    )) : <span className="text-gray-500">No skills listed</span>}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                <Github size={14} /> GitHub Profile
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.githubProfile || ''}
                                    onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
                                    className="w-full mt-1 p-2 border rounded-md"
                                />
                            ) : (
                                <a href={profile.githubProfile} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate block">
                                    {profile.githubProfile || 'Not set'}
                                </a>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                                <Linkedin size={14} /> LinkedIn Profile
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.linkedinProfile || ''}
                                    onChange={(e) => setFormData({ ...formData, linkedinProfile: e.target.value })}
                                    className="w-full mt-1 p-2 border rounded-md"
                                />
                            ) : (
                                <a href={profile.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate block">
                                    {profile.linkedinProfile || 'Not set'}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Resume Score */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg shadow-md text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Award /> AI Resume Score
                        </h2>
                        <p className="text-indigo-100 mt-1">Based on your latest uploaded resume.</p>
                    </div>
                    <div className="text-4xl font-bold">
                        {profile.resumeScore || 0}/100
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
