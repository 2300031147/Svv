import React, { useState, useEffect } from 'react';
import { testAPI } from '../services/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Analytics = () => {
    const [tests, setTests] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [testsResponse, statsResponse] = await Promise.all([
                testAPI.getAllTests(),
                testAPI.getStatistics()
            ]);
            setTests(testsResponse.data.data || []);
            setStatistics(statsResponse.data.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Response Time Trend Chart
    const responseTimeData = {
        labels: tests.slice(-10).map((test, index) => `Test ${tests.length - 9 + index}`),
        datasets: [
            {
                label: 'Response Time (ms)',
                data: tests.slice(-10).map(test => test.response_time),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.4
            }
        ]
    };

    // CPU vs Memory Chart
    const cpuMemoryData = {
        labels: tests.slice(-10).map(test => test.test_name.substring(0, 15)),
        datasets: [
            {
                label: 'CPU Usage (%)',
                data: tests.slice(-10).map(test => test.cpu_usage),
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
            },
            {
                label: 'Memory Usage (MB)',
                data: tests.slice(-10).map(test => test.memory_usage / 10), // Scale down for better visualization
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
            }
        ]
    };

    // Status Distribution Chart
    const statusData = {
        labels: ['Stable', 'Lag', 'Crash'],
        datasets: [
            {
                data: [
                    statistics?.stable_count || 0,
                    statistics?.lag_count || 0,
                    statistics?.crash_count || 0
                ],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.7)',
                    'rgba(234, 179, 8, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                ],
                borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(234, 179, 8)',
                    'rgb(239, 68, 68)',
                ],
                borderWidth: 2,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
                },
                grid: {
                    color: document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }
            },
            y: {
                ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
                },
                grid: {
                    color: document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Performance Analytics
            </h1>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tests</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                            {statistics.total_tests}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Response Time</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                            {parseFloat(statistics.avg_response_time || 0).toFixed(0)} ms
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg CPU Usage</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                            {parseFloat(statistics.avg_cpu_usage || 0).toFixed(1)}%
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Memory Usage</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                            {parseFloat(statistics.avg_memory_usage || 0).toFixed(0)} MB
                        </div>
                    </div>
                </div>
            )}

            {tests.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        No test data available. Create some tests to see analytics.
                    </p>
                </div>
            ) : (
                <>
                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Response Time Trend */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Response Time Trend (Last 10 Tests)
                            </h2>
                            <div style={{ height: '300px' }}>
                                <Line data={responseTimeData} options={chartOptions} />
                            </div>
                        </div>

                        {/* CPU vs Memory */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                CPU vs Memory Usage (Last 10 Tests)
                            </h2>
                            <div style={{ height: '300px' }}>
                                <Bar data={cpuMemoryData} options={chartOptions} />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                * Memory values scaled down by 10x for visualization
                            </p>
                        </div>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Status Distribution */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Test Status Distribution
                            </h2>
                            <div style={{ height: '300px' }}>
                                <Pie data={statusData} options={pieOptions} />
                            </div>
                        </div>

                        {/* Status Summary */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Status Summary
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                                        <span className="font-medium text-gray-900 dark:text-white">Stable Tests</span>
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {statistics?.stable_count || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-yellow-500 mr-3"></div>
                                        <span className="font-medium text-gray-900 dark:text-white">Lag Tests</span>
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {statistics?.lag_count || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-red-500 mr-3"></div>
                                        <span className="font-medium text-gray-900 dark:text-white">Crash Tests</span>
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {statistics?.crash_count || 0}
                                    </span>
                                </div>
                                {statistics && statistics.total_tests > 0 && (
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Success Rate: {' '}
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {((statistics.stable_count / statistics.total_tests) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Analytics;
