import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { testAPI, metricsAPI } from '../services/api';

const NewTest = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        test_name: '',
        device_used: '',
        browser_os: '',
        response_time: '',
        cpu_usage: '',
        memory_usage: '',
        notes: '',
        status: 'Stable'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetchingMetrics, setFetchingMetrics] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFetchMetrics = async () => {
        setFetchingMetrics(true);
        setErrorMessage('');
        try {
            const response = await metricsAPI.getMetrics();
            const metrics = response.data.data;
            
            setFormData(prev => ({
                ...prev,
                cpu_usage: metrics.cpu_usage.toString(),
                memory_usage: metrics.memory_usage.toString()
            }));
            
            // Clear any existing errors for these fields
            setErrors(prev => ({
                ...prev,
                cpu_usage: '',
                memory_usage: ''
            }));
            
            setSuccessMessage('System metrics fetched successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setErrorMessage('Failed to fetch system metrics. Please try again.');
            console.error('Error fetching metrics:', err);
        } finally {
            setFetchingMetrics(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.test_name.trim()) {
            newErrors.test_name = 'Test name is required';
        }
        if (!formData.device_used.trim()) {
            newErrors.device_used = 'Device is required';
        }
        if (!formData.browser_os.trim()) {
            newErrors.browser_os = 'Browser/OS is required';
        }
        if (!formData.response_time || formData.response_time < 0) {
            newErrors.response_time = 'Valid response time is required';
        }
        if (!formData.cpu_usage || formData.cpu_usage < 0 || formData.cpu_usage > 100) {
            newErrors.cpu_usage = 'CPU usage must be between 0 and 100';
        }
        if (!formData.memory_usage || formData.memory_usage < 0) {
            newErrors.memory_usage = 'Valid memory usage is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            await testAPI.createTest({
                ...formData,
                response_time: parseInt(formData.response_time),
                cpu_usage: parseFloat(formData.cpu_usage),
                memory_usage: parseFloat(formData.memory_usage)
            });

            setSuccessMessage('Test saved successfully!');
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setErrorMessage('Failed to save test. Please try again.');
            console.error('Error saving test:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    New Performance Test
                </h1>

                {successMessage && (
                    <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded mb-6">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
                        {errorMessage}
                    </div>
                )}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Test Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Test Name *
                        </label>
                        <input
                            type="text"
                            name="test_name"
                            value={formData.test_name}
                            onChange={handleChange}
                            placeholder="e.g., Login Page Test"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                errors.test_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        />
                        {errors.test_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.test_name}</p>
                        )}
                    </div>

                    {/* Device Used */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Device Used *
                        </label>
                        <input
                            type="text"
                            name="device_used"
                            value={formData.device_used}
                            onChange={handleChange}
                            placeholder="e.g., Desktop, Mobile, Tablet"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                errors.device_used ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        />
                        {errors.device_used && (
                            <p className="text-red-500 text-sm mt-1">{errors.device_used}</p>
                        )}
                    </div>

                    {/* Browser / OS */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Browser / OS *
                        </label>
                        <input
                            type="text"
                            name="browser_os"
                            value={formData.browser_os}
                            onChange={handleChange}
                            placeholder="e.g., Chrome / Windows 11"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                errors.browser_os ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        />
                        {errors.browser_os && (
                            <p className="text-red-500 text-sm mt-1">{errors.browser_os}</p>
                        )}
                    </div>

                    {/* Response Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Response Time (ms) *
                        </label>
                        <input
                            type="number"
                            name="response_time"
                            value={formData.response_time}
                            onChange={handleChange}
                            placeholder="e.g., 250"
                            min="0"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                errors.response_time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        />
                        {errors.response_time && (
                            <p className="text-red-500 text-sm mt-1">{errors.response_time}</p>
                        )}
                    </div>

                    {/* System Metrics Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                System Metrics
                            </h3>
                            <button
                                type="button"
                                onClick={handleFetchMetrics}
                                disabled={fetchingMetrics}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                            >
                                {fetchingMetrics ? 'Fetching...' : '🔄 Fetch Metrics'}
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Click "Fetch Metrics" to automatically capture your device's current CPU and memory usage.
                        </p>

                        {/* CPU Usage */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                CPU Usage (%) *
                            </label>
                            <input
                                type="number"
                                name="cpu_usage"
                                value={formData.cpu_usage}
                                onChange={handleChange}
                                placeholder="e.g., 45.5"
                                min="0"
                                max="100"
                                step="0.1"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                    errors.cpu_usage ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {errors.cpu_usage && (
                                <p className="text-red-500 text-sm mt-1">{errors.cpu_usage}</p>
                            )}
                        </div>

                        {/* Memory Usage */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Memory Usage (MB) *
                            </label>
                            <input
                                type="number"
                                name="memory_usage"
                                value={formData.memory_usage}
                                onChange={handleChange}
                                placeholder="e.g., 512.3"
                                min="0"
                                step="0.1"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                                    errors.memory_usage ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {errors.memory_usage && (
                                <p className="text-red-500 text-sm mt-1">{errors.memory_usage}</p>
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Status *
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="Stable">Stable</option>
                            <option value="Lag">Lag</option>
                            <option value="Crash">Crash</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Notes / Observations
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add any observations or notes about this test..."
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Saving...' : 'Save Test'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewTest;
