import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { checklistAPI } from '../services/api';

const ChecklistDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [checklist, setChecklist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchChecklist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchChecklist = async () => {
        try {
            setLoading(true);
            const response = await checklistAPI.getChecklistById(id);
            setChecklist(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch checklist');
            console.error('Error fetching checklist:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleItem = async (itemId, currentStatus) => {
        try {
            await checklistAPI.updateChecklistItem(itemId, { is_completed: !currentStatus });
            fetchChecklist();
        } catch (err) {
            setError('Failed to update item');
            console.error('Error updating item:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg dark:text-white">Loading checklist...</div>
            </div>
        );
    }

    if (error || !checklist) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || 'Checklist not found'}
                </div>
                <button
                    onClick={() => navigate('/checklists')}
                    className="mt-4 text-blue-500 hover:text-blue-700"
                >
                    ← Back to Checklists
                </button>
            </div>
        );
    }

    const completedCount = checklist.items?.filter(item => item.is_completed).length || 0;
    const totalCount = checklist.items?.length || 0;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/checklists')}
                className="mb-4 text-blue-500 hover:text-blue-700"
            >
                ← Back to Checklists
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-2 dark:text-white">{checklist.name}</h1>
                {checklist.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {checklist.description}
                    </p>
                )}

                <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Progress: {completedCount} / {totalCount}</span>
                        <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    {checklist.items && checklist.items.length > 0 ? (
                        checklist.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                            >
                                <input
                                    type="checkbox"
                                    checked={item.is_completed}
                                    onChange={() => handleToggleItem(item.id, item.is_completed)}
                                    className="w-5 h-5 text-blue-600 cursor-pointer"
                                />
                                <span
                                    className={`ml-3 flex-1 ${
                                        item.is_completed
                                            ? 'line-through text-gray-500 dark:text-gray-500'
                                            : 'text-gray-800 dark:text-gray-200'
                                    }`}
                                >
                                    {item.item_text}
                                </span>
                                {item.completed_at && (
                                    <span className="text-xs text-gray-500 dark:text-gray-500">
                                        Completed: {new Date(item.completed_at).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No items in this checklist</p>
                    )}
                </div>

                <div className="mt-6 text-xs text-gray-500 dark:text-gray-500">
                    Created: {new Date(checklist.created_at).toLocaleString()}
                </div>
            </div>
        </div>
    );
};

export default ChecklistDetail;
