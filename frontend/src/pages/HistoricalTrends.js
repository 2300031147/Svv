import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { testAPI } from '../services/api';

const HistoricalTrends = () => {
    const [days, setDays] = useState(30);
    const [metric, setMetric] = useState('response_time');
    const [trendsData, setTrendsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTrends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [days, metric]);

    const fetchTrends = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await testAPI.getHistoricalTrends(days, metric);
            setTrendsData(response.data.data);
        } catch (err) {
            setError('Failed to fetch trends');
            console.error('Error fetching trends:', err);
        } finally {
            setLoading(false);
        }
    };

    const getMetricLabel = () => {
        switch (metric) {
            case 'response_time':
                return 'Response Time (ms)';
            case 'cpu_usage':
                return 'CPU Usage (%)';
            case 'memory_usage':
                return 'Memory Usage (MB)';
            default:
                return 'Value';
        }
    };

    const chartData = trendsData ? {
        labels: trendsData.trends.map(t => new Date(t.date).toLocaleDateString()),
        datasets: [
            {
                label: `Average ${getMetricLabel()}`,
                data: trendsData.trends.map(t => parseFloat(t.avg_value)),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3
            },
            {
                label: `Min ${getMetricLabel()}`,
                data: trendsData.trends.map(t => parseFloat(t.min_value)),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderDash: [5, 5],
                tension: 0.3
            },
            {
                label: `Max ${getMetricLabel()}`,
                data: trendsData.trends.map(t => parseFloat(t.max_value)),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderDash: [5, 5],
                tension: 0.3
            }
        ]
    } : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
                }
            },
            title: {
                display: true,
                text: `${getMetricLabel()} Trends (Last ${days} Days)`,
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
                },
                grid: {
                    color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
                }
            },
            x: {
                ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
                },
                grid: {
                    color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
                }
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 dark:text-white">Historical Trends</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-wrap gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                            Time Period
                        </label>
                        <select
                            value={days}
                            onChange={(e) => setDays(parseInt(e.target.value))}
                            className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="14">Last 14 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="60">Last 60 Days</option>
                            <option value="90">Last 90 Days</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                            Metric
                        </label>
                        <select
                            value={metric}
                            onChange={(e) => setMetric(e.target.value)}
                            className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                        >
                            <option value="response_time">Response Time</option>
                            <option value="cpu_usage">CPU Usage</option>
                            <option value="memory_usage">Memory Usage</option>
                        </select>
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-8 dark:text-white">Loading trends...</div>
                )}

                {!loading && trendsData && trendsData.trends.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No data available for the selected period
                    </div>
                )}

                {!loading && chartData && trendsData.trends.length > 0 && (
                    <>
                        <div className="h-96 mb-6">
                            <Line data={chartData} options={chartOptions} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded">
                                <div className="text-sm text-gray-600 dark:text-gray-300">Total Tests</div>
                                <div className="text-2xl font-bold dark:text-white">
                                    {trendsData.trends.reduce((sum, t) => sum + t.test_count, 0)}
                                </div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900 p-4 rounded">
                                <div className="text-sm text-gray-600 dark:text-gray-300">Average</div>
                                <div className="text-2xl font-bold dark:text-white">
                                    {(trendsData.trends.reduce((sum, t) => sum + parseFloat(t.avg_value), 0) / 
                                      trendsData.trends.length).toFixed(2)}
                                </div>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded">
                                <div className="text-sm text-gray-600 dark:text-gray-300">Min Value</div>
                                <div className="text-2xl font-bold dark:text-white">
                                    {Math.min(...trendsData.trends.map(t => parseFloat(t.min_value))).toFixed(2)}
                                </div>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900 p-4 rounded">
                                <div className="text-sm text-gray-600 dark:text-gray-300">Max Value</div>
                                <div className="text-2xl font-bold dark:text-white">
                                    {Math.max(...trendsData.trends.map(t => parseFloat(t.max_value))).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HistoricalTrends;
