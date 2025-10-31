import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { authAPI } from '../services/api';

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthenticated = authAPI.isAuthenticated();
    const currentUser = authAPI.getCurrentUser();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        authAPI.logout();
        navigate('/login');
    };

    // Don't show navigation on login/register pages
    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                                Performance Observer
                            </span>
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActive('/') 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/new-test"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActive('/new-test') 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            New Test
                        </Link>
                        <Link
                            to="/analytics"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActive('/analytics') 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            Analytics
                        </Link>
                        
                        {isAuthenticated ? (
                            <>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {currentUser?.email}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive('/login') 
                                        ? 'bg-blue-600 text-white' 
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                Login
                            </Link>
                        )}
                        
                        <DarkModeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
