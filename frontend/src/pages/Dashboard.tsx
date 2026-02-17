import { Activity, Clock, CheckCircle, TrendingUp, Calendar, ArrowRight, BookOpen, Target, Zap } from 'lucide-react';
import ResumeUpload from '../components/ResumeUpload';

const Dashboard = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Track your placement preparation progress.</p>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<Target className="text-orange-500" size={24} />}
                    label="Questions Solved"
                    value="42"
                    subtext="Top 10% of users"
                    bg="bg-orange-50 dark:bg-orange-900/20"
                    border="border-orange-200 dark:border-orange-500/30"
                />
                <StatCard
                    icon={<Clock className="text-blue-500" size={24} />}
                    label="Study Hours"
                    value="156"
                    subtext="Last 30 days"
                    bg="bg-blue-50 dark:bg-blue-900/20"
                    border="border-blue-200 dark:border-blue-500/30"
                />
                <StatCard
                    icon={<Zap className="text-yellow-500" size={24} />}
                    label="Resume Score"
                    value="85/100"
                    subtext="AI Analysis"
                    bg="bg-yellow-50 dark:bg-yellow-900/20"
                    border="border-yellow-200 dark:border-yellow-500/30"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Resume Analysis Section - Spans 2 cols */}
                <div className="lg:col-span-2">
                    <ResumeUpload />
                </div>

                {/* Activity Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-orange-100 dark:border-orange-500/20 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <TrendingUp size={20} className="text-orange-500" /> Recent Activity
                        </h2>
                    </div>

                    <div className="space-y-6 flex-1">
                        <ActivityItem
                            title="Solved 'Two Sum'"
                            subtitle="DSA Practice"
                            time="2h ago"
                            icon={<CheckCircle size={16} className="text-green-500" />}
                            bg="bg-green-100 dark:bg-green-900/30"
                        />
                        <ActivityItem
                            title="Resume Uploaded"
                            subtitle="AI Analysis"
                            time="1d ago"
                            icon={<BookOpen size={16} className="text-blue-500" />}
                            bg="bg-blue-100 dark:bg-blue-900/30"
                        />
                        <ActivityItem
                            title="Mock Interview"
                            subtitle="Amazon SDE"
                            time="3d ago"
                            icon={<Calendar size={16} className="text-purple-500" />}
                            bg="bg-purple-100 dark:bg-purple-900/30"
                        />
                        <ActivityItem
                            title="Contest Participation"
                            subtitle="LeetCode Weekly"
                            time="5d ago"
                            icon={<Activity size={16} className="text-orange-500" />}
                            bg="bg-orange-100 dark:bg-orange-900/30"
                        />
                    </div>

                    <button className="w-full mt-6 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors flex items-center justify-center gap-2">
                        View All History <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, subtext, bg, border }: any) => (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border ${border || 'border-gray-200 dark:border-gray-700'} hover:shadow-md hover:border-orange-300 dark:hover:border-orange-500/50 transition-all duration-300`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 ${bg} rounded-lg`}>{icon}</div>
        </div>
        <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium">{label}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{subtext}</p>
        </div>
    </div>
);

const ActivityItem = ({ title, subtitle, time, icon, bg }: any) => (
    <div className="flex items-center gap-4 group cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">{title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{time}</span>
    </div>
);

export default Dashboard;
