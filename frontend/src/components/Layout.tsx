import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, LogOut, Moon, Sun } from 'lucide-react';
import clsx from 'clsx';
import ChatBot from './ChatBot';
import { useState, useEffect } from 'react';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem('username') || 'User';

    // Theme Management
    const [isDark, setIsDark] = useState(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            return true;
        }
        return false;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Top Navigation Bar */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-8">
                            {/* Logo */}
                            <Link to="/dashboard" className="flex items-center gap-2">
                                <Code2 className="text-orange-500" size={28} />
                                <span className="text-xl font-bold tracking-tight dark:text-white">Placement<span className="text-orange-500">AI</span></span>
                            </Link>

                            {/* Desktop Nav Links */}
                            <div className="hidden md:flex space-x-1">
                                <NavItem to="/dsa" label="Problem List" active={location.pathname.startsWith('/dsa')} />
                                <NavItem to="/contests" label="Contest" active={location.pathname.startsWith('/contests')} />
                                <NavItem to="/interviews" label="Interview" active={location.pathname.startsWith('/interviews')} />
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsDark(!isDark)}
                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                                title="Toggle Theme"
                            >
                                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:block">Welcome, {username}</span>
                            <Link to="/profile" className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors border border-orange-200 dark:border-orange-800">
                                {username.charAt(0).toUpperCase()}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            <ChatBot />
        </div>
    );
};

const NavItem = ({ to, label, active }: { to: string; label: string; active: boolean }) => {
    return (
        <Link
            to={to}
            className={clsx(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                    ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 font-semibold"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
        >
            {label}
        </Link>
    );
};

export default Layout;
