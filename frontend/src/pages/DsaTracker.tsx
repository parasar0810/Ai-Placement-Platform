import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Circle, ExternalLink, Loader2, Search, Filter } from 'lucide-react';

interface Question {
    id: string;
    title: string;
    topic: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    link: string;
}

interface UserProgress {
    question: {
        id: string;
    };
    status: 'COMPLETED' | 'PENDING';
}

const DsaTracker = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [filterDifficulty, setFilterDifficulty] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [questionsRes, progressRes] = await Promise.all([
                axios.get('http://localhost:8080/api/v1/dsa/questions', { headers }),
                axios.get('http://localhost:8080/api/v1/dsa/progress', { headers })
            ]);

            setQuestions(questionsRes.data);

            const solved = new Set<string>();
            progressRes.data.forEach((p: UserProgress) => {
                if (p.status === 'COMPLETED') {
                    solved.add(p.question.id);
                }
            });
            setSolvedIds(solved);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSolve = async (questionId: string) => {
        const isSolved = solvedIds.has(questionId);
        const newStatus = isSolved ? 'PENDING' : 'COMPLETED';

        const newSolvedIds = new Set(solvedIds);
        if (isSolved) {
            newSolvedIds.delete(questionId);
        } else {
            newSolvedIds.add(questionId);
        }
        setSolvedIds(newSolvedIds);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/v1/dsa/progress',
                { questionId, status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error(err);
            setSolvedIds(solvedIds); // Revert
        }
    };

    const filteredQuestions = questions.filter(q => {
        const matchesDifficulty = filterDifficulty === 'ALL' || q.difficulty === filterDifficulty;
        const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.topic.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDifficulty && matchesSearch;
    });

    const solvedCount = solvedIds.size;
    const totalCount = questions.length;
    const progressPercentage = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-orange-500" size={32} /></div>;

    return (
        <div className="space-y-6">
            {/* Stats Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Problem List</h1>
                    <p className="text-gray-500 mt-1">Curated list of top interview questions.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:w-64">
                        <div className="flex justify-between text-sm mb-1 font-medium">
                            <span className="text-gray-600">Progress</span>
                            <span className="text-gray-900">{solvedCount} / {totalCount} Solved</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
                        <button
                            key={diff}
                            onClick={() => setFilterDifficulty(diff as any)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filterDifficulty === diff
                                    ? 'bg-gray-800 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {diff.charAt(0) + diff.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solution</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acceptance</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredQuestions.map((q, idx) => (
                            <tr key={q.id} className={`hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => toggleSolve(q.id)}
                                        className="focus:outline-none hover:scale-110 transition-transform"
                                    >
                                        {solvedIds.has(q.id) ? (
                                            <CheckCircle className="text-green-500" size={20} />
                                        ) : (
                                            <Circle className="text-gray-300 hover:text-gray-400" size={20} />
                                        )}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {q.link ? (
                                        <a href={q.link} target="_blank" rel="noopener noreferrer" className="text-gray-900 font-medium hover:text-blue-600 hover:underline">
                                            {idx + 1}. {q.title}
                                        </a>
                                    ) : (
                                        <span className="text-gray-900 font-medium">{idx + 1}. {q.title}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                    <ExternalLink size={16} /> {/* Placeholder for solution link */}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {/* Mock Acceptance Rate */}
                                    {Math.floor(Math.random() * (85 - 30 + 1) + 30)}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${q.difficulty === 'EASY' ? 'text-green-700 bg-green-100' :
                                            q.difficulty === 'MEDIUM' ? 'text-yellow-700 bg-yellow-100' :
                                                'text-red-700 bg-red-100'
                                        }`}>
                                        {q.difficulty}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                        {q.topic}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredQuestions.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <Filter className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        No questions found matching your filters.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DsaTracker;
