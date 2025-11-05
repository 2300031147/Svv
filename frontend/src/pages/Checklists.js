import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checklistAPI } from '../services/api';

const Checklists = () => {
    const [checklists, setChecklists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [newChecklist, setNewChecklist] = useState({
        name: '',
        description: '',
        items: ['']
    });

    useEffect(() => {
        fetchChecklists();
    }, []);

    const fetchChecklists = async () => {
        try {
            setLoading(true);
            const response = await checklistAPI.getAllChecklists();
            setChecklists(response.data.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch checklists');
            console.error('Error fetching checklists:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewChecklist(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, value) => {
        const newItems = [...newChecklist.items];
        newItems[index] = value;
        setNewChecklist(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setNewChecklist(prev => ({ ...prev, items: [...prev.items, ''] }));
    };

    const removeItem = (index) => {
        const newItems = newChecklist.items.filter((_, i) => i !== index);
        setNewChecklist(prev => ({ ...prev, items: newItems }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const items = newChecklist.items.filter(item => item.trim() !== '');
            await checklistAPI.createChecklist({
                name: newChecklist.name,
                description: newChecklist.description,
                items: items.map(text => ({ text }))
            });
            setNewChecklist({ name: '', description: '', items: [''] });
            setShowNewForm(false);
            fetchChecklists();
        } catch (err) {
            setError('Failed to create checklist');
            console.error('Error creating checklist:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this checklist?')) {
            try {
                await checklistAPI.deleteChecklist(id);
                fetchChecklists();
            } catch (err) {
                setError('Failed to delete checklist');
                console.error('Error deleting checklist:', err);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg dark:text-white">Loading checklists...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold dark:text-white">Test Checklists</h1>
                <button
                    onClick={() => setShowNewForm(!showNewForm)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    {showNewForm ? 'Cancel' : '+ New Checklist'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {showNewForm && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Create New Checklist</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">
                                Checklist Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={newChecklist.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={newChecklist.description}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                rows="3"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">
                                Checklist Items
                            </label>
                            {newChecklist.items.map((item, index) => (
                                <div key={index} className="flex mb-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleItemChange(index, e.target.value)}
                                        className="flex-1 px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                        placeholder={`Item ${index + 1}`}
                                    />
                                    {newChecklist.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="ml-2 bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addItem}
                                className="bg-green-500 hover:bg-green-700 text-white px-3 py-2 rounded mt-2"
                            >
                                + Add Item
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Create Checklist
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {checklists.map((checklist) => (
                    <div key={checklist.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                        <h3 className="text-lg font-bold mb-2 dark:text-white">{checklist.name}</h3>
                        {checklist.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                {checklist.description}
                            </p>
                        )}
                        <div className="flex justify-between items-center">
                            <Link
                                to={`/checklists/${checklist.id}`}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                View Details →
                            </Link>
                            <button
                                onClick={() => handleDelete(checklist.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            Created: {new Date(checklist.created_at).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>

            {checklists.length === 0 && !loading && (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                    No checklists found. Create your first checklist!
                </div>
            )}
        </div>
    );
};

export default Checklists;
