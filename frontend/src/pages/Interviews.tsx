import { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, ChevronRight, Search, Briefcase } from 'lucide-react';

interface Company {
    id: string;
    name: string;
    industry: string;
    description: string;
}

interface InterviewQuestion {
    id: string;
    title: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    frequency: string;
}

const Interviews = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/companies`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCompanies(res.data);
            if (res.data.length > 0) {
                // Select first company by default
                handleCompanySelect(res.data[0]);
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleCompanySelect = async (company: Company) => {
        setSelectedCompany(company);
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/companies/${company.id}/questions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuestions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
                <Briefcase size={32} className="text-orange-500" />
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Company Interviews</h1>
                    <p className="text-gray-500">Prepare for specific companies with curated questions.</p>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Company List Sidebar */}
                <div className="w-1/3 bg-white rounded-lg shadow overflow-y-auto">
                    <div className="p-4 border-b sticky top-0 bg-white">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search companies..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    <div>
                        {companies.map((company) => (
                            <div
                                key={company.id}
                                onClick={() => handleCompanySelect(company)}
                                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition flex items-center justify-between ${selectedCompany?.id === company.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Building2 size={20} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{company.name}</h3>
                                        <p className="text-xs text-gray-500">{company.industry}</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Questions Content */}
                <div className="flex-1 bg-white rounded-lg shadow overflow-y-auto p-6">
                    {selectedCompany ? (
                        <>
                            <div className="mb-6 pb-6 border-b">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <Building2 className="text-indigo-600" />
                                    {selectedCompany.name} Questions
                                </h2>
                                <p className="text-gray-600 mt-2">{selectedCompany.description}</p>
                            </div>

                            <div className="space-y-4">
                                {questions.map((q) => (
                                    <div key={q.id} className="border rounded-lg p-4 hover:shadow-md transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg text-gray-800">{q.title}</h3>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${q.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                                                q.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {q.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3">{q.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="bg-gray-100 px-2 py-1 rounded">Frequency: {q.frequency}</span>
                                        </div>
                                    </div>
                                ))}
                                {questions.length === 0 && !loading && (
                                    <div className="text-center py-12 text-gray-500">
                                        No questions found for this company yet.
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Building2 size={64} className="mb-4 opacity-50" />
                            <p>Select a company to view interview questions</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Interviews;
