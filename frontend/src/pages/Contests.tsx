import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Calendar, ExternalLink, Clock, AlertCircle, Sparkles, Loader2 } from 'lucide-react';

interface Contest {
    id: string;
    name: string;
    platform: string;
    link: string;
    startTime: string;
    duration: string;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

interface AiRecommendation {
    name: string;
    platform: string;
    link: string;
    description: string;
}

const Contests = () => {
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [recommendations, setRecommendations] = useState<AiRecommendation[]>([]);
    const [showRecommendations, setShowRecommendations] = useState(false);

    useEffect(() => {
        fetchContests();
    }, []);

    const fetchContests = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8080/api/v1/contests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        setShowRecommendations(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:8080/api/v1/contests/search?query=${encodeURIComponent(searchQuery)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecommendations(res.data.recommendations || []);
        } catch (err) {
            console.error(err);
        } finally {
            setSearching(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    };

    return (
        <div className="p-6 space-y-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-yellow-100 rounded-full">
                        <Trophy size={32} className="text-yellow-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Contests</h1>
                        <p className="text-gray-500">Compete in upcoming coding challenges.</p>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm shadow-sm transition-shadow hover:shadow-md"
                        placeholder="Ask AI (e.g., 'Beginner Python contests')..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={searching || !searchQuery.trim()}
                        className="absolute inset-y-1 right-1 px-4 flex items-center bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {searching ? <Loader2 className="animate-spin h-4 w-4" /> : 'Search'}
                    </button>
                </form>
            </div>

            {/* AI Recommendations Section */}
            {showRecommendations && (
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-200 rounded-full opacity-50 blur-2xl"></div>

                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <h2 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                            <Sparkles size={18} /> AI Recommendations for "{searchQuery}"
                        </h2>
                        <button
                            onClick={() => setShowRecommendations(false)}
                            className="text-purple-400 hover:text-purple-700 text-sm font-medium"
                        >
                            Clear
                        </button>
                    </div>

                    {searching ? (
                        <div className="flex flex-col items-center justify-center py-8 text-purple-600">
                            <Loader2 className="animate-spin mb-2" size={32} />
                            <p className="text-sm font-medium">Finding the best contests for you...</p>
                        </div>
                    ) : recommendations.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 relative z-10">
                            {recommendations.map((rec, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-purple-600 uppercase tracking-wide bg-purple-50 px-2 py-1 rounded">
                                            {rec.platform}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">{rec.name}</h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{rec.description}</p>
                                    <a
                                        href={rec.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1"
                                    >
                                        View Contest <ExternalLink size={14} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-purple-800">
                            No recommendations found. Try a different query.
                        </div>
                    )}
                </div>
            )}

            {/* Standard Contest List */}
            <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Upcoming Contests</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {contests.map((contest) => (
                    <div key={contest.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                        <div className={`h-1.5 w-full ${contest.platform === 'LeetCode' ? 'bg-yellow-500' :
                            contest.platform === 'CodeChef' ? 'bg-orange-900' :
                                'bg-blue-500'
                            }`} />
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${contest.status === 'ONGOING' ? 'bg-green-100 text-green-700 animate-pulse' :
                                    'bg-blue-50 text-blue-700'
                                    }`}>
                                    {contest.status}
                                </span>
                                <span className="text-xs font-medium text-gray-400">{contest.platform}</span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{contest.name}</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-gray-500 text-sm">
                                    <Calendar size={16} className="mr-3 text-gray-400" />
                                    {formatDate(contest.startTime)}
                                </div>
                                <div className="flex items-center text-gray-500 text-sm">
                                    <Clock size={16} className="mr-3 text-gray-400" />
                                    {contest.duration}
                                </div>
                            </div>

                            <a
                                href={contest.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-900 py-2.5 rounded-lg hover:bg-gray-100 transition font-medium text-sm"
                            >
                                Register <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && contests.length === 0 && (
                <div className="text-center py-12">
                    <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500">No contests found. Check back later!</p>
                </div>
            )}
        </div>
    );
};

export default Contests;
