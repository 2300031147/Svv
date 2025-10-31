import React, { useState } from 'react';
import { reportsAPI } from '../services/api';

const ReportButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDownloadReport = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await reportsAPI.getPDFReport();
            
            // Create a blob from the PDF data
            const blob = new Blob([response.data], { type: 'application/pdf' });
            
            // Create a link element and trigger download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `performance-report-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            window.URL.revokeObjectURL(link.href);
        } catch (err) {
            console.error('Error downloading PDF report:', err);
            setError('Failed to generate PDF report. Please try again.');
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleDownloadReport}
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <span>{loading ? 'Generating PDF...' : 'Download PDF Report'}</span>
            </button>
            
            {error && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}
        </div>
    );
};

export default ReportButton;
