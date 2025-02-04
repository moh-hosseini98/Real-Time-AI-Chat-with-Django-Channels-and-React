
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import WebSocketChat from './AI/Chat';

const Provider = () => {
    return (
        <Router>
            <Routes>
                <Route path="ws/chat/" element={<WebSocketChat />} />
                <Route path="/" element={<App />} />
            </Routes>
        </Router>
    );
};

export default Provider;