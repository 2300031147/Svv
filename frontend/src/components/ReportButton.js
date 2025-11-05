import React, { useState } from 'react';
import { reportsAPI } from '../services/api';

const ReportButton = () => {
    const [loadingPDF, setLoadingPDF] = useState(false);
    const [loadingExcel, setLoadingExcel] = useState(false);
    const [error, setError] = useState('');

    const handleDownloadReport = async (format = 'pdf') => {
        const isPDF = format === 'pdf';
        const setLoading = isPDF ? setLoadingPDF : setLoadingExcel;
        
        setLoading(true);
        setError('');

        try {
            const response = isPDF 
                ? await reportsAPI.getPDFReport()
                : await reportsAPI.getExcelReport();
            
            // Create a blob from the data
            const mimeType = isPDF 
                ? 'application/pdf' 
                : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const blob = new Blob([response.data], { type: mimeType });
            
            // Create a link element and trigger download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            const extension = isPDF ? 'pdf' : 'xlsx';
            link.download = `performance-report-${new Date().toISOString().split('T')[0]}.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            window.URL.revokeObjectURL(link.href);
        } catch (err) {
            console.error(`Error downloading ${format.toUpperCase()} report:`, err);
            setError(`Failed to generate ${format.toUpperCase()} report. Please try again.`);
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => handleDownloadReport('pdf')}
                disabled={loadingPDF}
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
                <span>{loadingPDF ? 'Generating...' : 'Download PDF'}</span>
            </button>
            
            <button
                onClick={() => handleDownloadReport('excel')}
                disabled={loadingExcel}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
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
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <span>{loadingExcel ? 'Generating...' : 'Download Excel'}</span>
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
