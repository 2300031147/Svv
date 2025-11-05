import React, { useState, useEffect } from 'react';
import { testAPI } from '../services/api';

const TestComparison = () => {
    const [tests, setTests] = useState([]);
    const [selectedTests, setSelectedTests] = useState([]);
    const [comparisonData, setComparisonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const response = await testAPI.getAllTests();
            setTests(response.data.data || []);
        } catch (err) {
            console.error('Error fetching tests:', err);
        }
    };

    const handleTestSelect = (testId) => {
        setSelectedTests(prev => {
            if (prev.includes(testId)) {
                return prev.filter(id => id !== testId);
            } else {
                return [...prev, testId];
            }
        });
    };

    const handleCompare = async () => {
        if (selectedTests.length < 2) {
            setError('Please select at least 2 tests to compare');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await testAPI.compareTests(selectedTests);
            setComparisonData(response.data.data || []);
        } catch (err) {
            setError('Failed to compare tests');
            console.error('Error comparing tests:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderComparisonTable = () => {
        if (!comparisonData || comparisonData.length === 0) return null;

        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 overflow-x-auto">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Comparison Results</h2>
                <table className="w-full">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="text-left p-2 dark:text-white">Metric</th>
                            {comparisonData.map((test) => (
                                <th key={test.id} className="text-left p-2 dark:text-white">
                                    {test.test_name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b dark:border-gray-700">
                            <td className="p-2 font-semibold dark:text-white">Device</td>
                            {comparisonData.map((test) => (
                                <td key={test.id} className="p-2 dark:text-gray-300">{test.device_used}</td>
                            ))}
                        </tr>
                        <tr className="border-b dark:border-gray-700">
                            <td className="p-2 font-semibold dark:text-white">Browser/OS</td>
                            {comparisonData.map((test) => (
                                <td key={test.id} className="p-2 dark:text-gray-300">{test.browser_os}</td>
                            ))}
                        </tr>
                        <tr className="border-b dark:border-gray-700">
                            <td className="p-2 font-semibold dark:text-white">Response Time (ms)</td>
                            {comparisonData.map((test) => (
                                <td key={test.id} className="p-2 dark:text-gray-300">{test.response_time}</td>
                            ))}
                        </tr>
                        <tr className="border-b dark:border-gray-700">
                            <td className="p-2 font-semibold dark:text-white">CPU Usage (%)</td>
                            {comparisonData.map((test) => (
                                <td key={test.id} className="p-2 dark:text-gray-300">{parseFloat(test.cpu_usage).toFixed(2)}</td>
                            ))}
                        </tr>
                        <tr className="border-b dark:border-gray-700">
                            <td className="p-2 font-semibold dark:text-white">Memory Usage (MB)</td>
                            {comparisonData.map((test) => (
                                <td key={test.id} className="p-2 dark:text-gray-300">{parseFloat(test.memory_usage).toFixed(2)}</td>
                            ))}
                        </tr>
                        <tr className="border-b dark:border-gray-700">
                            <td className="p-2 font-semibold dark:text-white">Status</td>
                            {comparisonData.map((test) => (
                                <td key={test.id} className="p-2">
                                    <span className={`px-2 py-1 rounded text-white text-sm ${
                                        test.status === 'Stable' ? 'bg-green-500' :
                                        test.status === 'Lag' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}>
                                        {test.status}
                                    </span>
                                </td>
                            ))}
                        </tr>
                        <tr className="border-b dark:border-gray-700">
                            <td className="p-2 font-semibold dark:text-white">Test Date</td>
                            {comparisonData.map((test) => (
                                <td key={test.id} className="p-2 dark:text-gray-300">
                                    {new Date(test.test_date).toLocaleString()}
                                </td>
                            ))}
                        </tr>
                        {comparisonData[0].page_load_time && (
                            <>
                                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                                    <td colSpan={comparisonData.length + 1} className="p-2 font-bold dark:text-white">
                                        Browser Performance Metrics
                                    </td>
                                </tr>
                                <tr className="border-b dark:border-gray-700">
                                    <td className="p-2 font-semibold dark:text-white">Page Load Time (ms)</td>
                                    {comparisonData.map((test) => (
                                        <td key={test.id} className="p-2 dark:text-gray-300">
                                            {test.page_load_time ? parseFloat(test.page_load_time).toFixed(2) : 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b dark:border-gray-700">
                                    <td className="p-2 font-semibold dark:text-white">DOM Content Loaded (ms)</td>
                                    {comparisonData.map((test) => (
                                        <td key={test.id} className="p-2 dark:text-gray-300">
                                            {test.dom_content_loaded ? parseFloat(test.dom_content_loaded).toFixed(2) : 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b dark:border-gray-700">
                                    <td className="p-2 font-semibold dark:text-white">First Contentful Paint (ms)</td>
                                    {comparisonData.map((test) => (
                                        <td key={test.id} className="p-2 dark:text-gray-300">
                                            {test.first_contentful_paint ? parseFloat(test.first_contentful_paint).toFixed(2) : 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 dark:text-white">Test Comparison</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Select Tests to Compare</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {tests.map((test) => (
                        <div
                            key={test.id}
                            className={`p-3 border rounded cursor-pointer transition ${
                                selectedTests.includes(test.id)
                                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                                    : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                            }`}
                            onClick={() => handleTestSelect(test.id)}
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedTests.includes(test.id)}
                                    onChange={() => {}}
                                    className="mr-2"
                                />
                                <div>
                                    <div className="font-semibold dark:text-white">{test.test_name}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {test.device_used} - {test.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleCompare}
                    disabled={selectedTests.length < 2 || loading}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
                >
                    {loading ? 'Comparing...' : `Compare Selected (${selectedTests.length})`}
                </button>
            </div>

            {renderComparisonTable()}
        </div>
    );
};

export default TestComparison;
