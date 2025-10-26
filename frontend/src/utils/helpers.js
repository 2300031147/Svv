// Format date to readable string
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Export data to CSV
export const exportToCSV = (data, filename = 'performance_tests.csv') => {
    if (data.length === 0) {
        alert('No data to export');
        return;
    }

    // Get headers
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                const value = row[header];
                // Escape commas and quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Get status color
export const getStatusColor = (status) => {
    switch (status) {
        case 'Stable':
            return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
        case 'Lag':
            return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
        case 'Crash':
            return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
        default:
            return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
};

// Calculate average
export const calculateAverage = (data, field) => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + parseFloat(item[field] || 0), 0);
    return (sum / data.length).toFixed(2);
};
