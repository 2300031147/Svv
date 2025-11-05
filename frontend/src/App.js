import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import NewTest from './pages/NewTest';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import Checklists from './pages/Checklists';
import ChecklistDetail from './pages/ChecklistDetail';
import TestComparison from './pages/TestComparison';
import HistoricalTrends from './pages/HistoricalTrends';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-test" element={<NewTest />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checklists" element={<Checklists />} />
          <Route path="/checklists/:id" element={<ChecklistDetail />} />
          <Route path="/comparison" element={<TestComparison />} />
          <Route path="/trends" element={<HistoricalTrends />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
