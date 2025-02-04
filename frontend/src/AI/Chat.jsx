import React, { useEffect, useState, useCallback, useRef } from 'react';
import { marked } from 'marked';
import './Chat.css';

const WebSocketChat = () => {
    const [responseMessages, setResponseMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const socketRef = useRef(null);

    // apply markdown to response messages
    const createMarkup = (markdown) => {
        return { __html: marked(markdown) };
    };

    // Initialize WebSocket connection
    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:8000/ws/chat/');
        socketRef.current = websocket;

        websocket.onopen = () => {
            console.log('Connected to WebSocket');
            setConnectionStatus('Connected');
        };

        websocket.onclose = () => {
            console.log('Disconnected from WebSocket');
            setConnectionStatus('Disconnected');
        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setConnectionStatus('Error');
        };

        // Listen for messages
        socketRef.current.addEventListener('message', (event) => {
            const response = JSON.parse(event.data);
            setResponseMessages(prevMessages => [...prevMessages, { prompt: response.prompt, message: response.response }]);
        });

        // Cleanup on component unmount
        return () => {
            websocket.close();
        };

    }, []);

    // Send message handler
    const sendMessage = useCallback(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && inputMessage.trim()) {
            socketRef.current.send(JSON.stringify({
                prompt: inputMessage,
            }));
            setInputMessage('');
        }
    }, [inputMessage]);

    return (
        <div className="wrapper">
            <div>
                <h2 style={{ color: '#03101d', fontFamily: "sans-serif" }}>AI Chat</h2>
            </div>

            <div className={`status ${
                connectionStatus === 'Connected' ? 'connected' : 
                connectionStatus === 'Error' ? 'error' : 'disconnected'
            }`}>
                Websocket status: {connectionStatus}
            </div>

            {responseMessages.map((item, index) => (
                <div key={index} className="messages">
                    <div>
                        <span className="prompt">{item.prompt}</span>
                        <span className="response" dangerouslySetInnerHTML={createMarkup(item.message)} />
                    </div>
                </div>
            ))}

            <div className="input-wrapper">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    disabled={!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default WebSocketChat;