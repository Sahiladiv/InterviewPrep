import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './components/Dashboard';
import MainPage from './pages/MainPage';
import CodingInterview from './pages/CodingInterview';
import VideoInterview from './pages/VideoInterview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/interview" element={<MainPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/interview/coding" element={<CodingInterview />} />
        <Route path="/interview/video" element={<VideoInterview />} />
      </Routes>
    </Router>
  );
}

export default App;
