import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </HashRouter>
  );
}

export default App;