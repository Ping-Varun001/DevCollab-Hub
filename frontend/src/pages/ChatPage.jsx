import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import GlassCard from '../components/GlassCard';
import { Send, ArrowLeft } from 'lucide-react';

const ChatPage = () => {
    const { projectId } = useParams();
    const { user } = useAuth();
    const { socket } = useSocket();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchChatData = async () => {
            try {
                const projRes = await axios.get(`/projects/${projectId}`);
                setProject(projRes.data);

                const chatRes = await axios.get(`/chat/${projectId}`);
                setMessages(chatRes.data.messages || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchChatData();
        }
    }, [projectId, user]);

    useEffect(() => {
        if (socket && project) {
            socket.emit('joinProject', projectId);

            socket.on('receiveMessage', (message) => {
                setMessages((prev) => [...prev, message]);
            });

            return () => {
                socket.off('receiveMessage');
            };
        }
    }, [socket, project, projectId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        try {
            // Save to DB
            const res = await axios.post(`/chat/${projectId}`, { text: newMessage });
            
            // Emit via socket
            socket.emit('sendMessage', {
                projectId,
                _id: res.data._id,
                text: newMessage,
                sender: { _id: user._id, name: user.name },
                timestamp: res.data.timestamp
            });

            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message', err);
        }
    };

    if (loading) return <div className="text-center mt-20">Loading chat...</div>;
    if (!project) return <div className="text-center mt-20 text-red-400">Project not found or unauthorized</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-64px)] flex flex-col">
            <div className="mb-4 flex items-center gap-4">
                <Link to={`/projects/${projectId}`} className="text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white line-clamp-1">{project.title} - Team Chat</h1>
                    <p className="text-sm text-gray-400">{project.members.length} members</p>
                </div>
            </div>

            <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden border border-[rgba(255,255,255,0.1)]">
                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <p>No messages yet.</p>
                            <p className="text-sm mt-1">Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isMe = msg.sender._id === user._id;
                            const showName = idx === 0 || messages[idx - 1].sender._id !== msg.sender._id;

                            return (
                                <div key={msg._id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    {!isMe && showName && (
                                        <span className="text-xs text-gray-400 mb-1 ml-1">{msg.sender.name}</span>
                                    )}
                                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                                        isMe 
                                        ? 'bg-[var(--color-brand-accent)] text-gray-900 rounded-tr-none' 
                                        : 'bg-[rgba(255,255,255,0.1)] text-white rounded-tl-none border border-[rgba(255,255,255,0.05)]'
                                    }`}>
                                        <p className="break-words">{msg.text}</p>
                                    </div>
                                    <span className="text-[10px] text-gray-500 mt-1 mx-1">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[rgba(0,0,0,0.3)] border-t border-[rgba(255,255,255,0.05)]">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full py-3 px-6 text-white focus:outline-none focus:border-[var(--color-brand-accent)] transition-colors"
                        />
                        <button 
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="w-12 h-12 rounded-full bg-[var(--color-brand-accent)] text-gray-900 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors"
                        >
                            <Send size={20} className="ml-1" />
                        </button>
                    </form>
                </div>
            </GlassCard>
        </div>
    );
};

export default ChatPage;
