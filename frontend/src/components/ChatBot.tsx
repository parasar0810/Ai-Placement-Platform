import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Send, X, Loader2, Bot } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi! I'm your AI career assistant. Ask me about resume tips, interview prep, or career guidance!",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/ai/chat`,
                { message: userMsg.text },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: res.data.message,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 mb-4 flex flex-col h-[500px] border border-gray-200 transition-all transform origin-bottom-right">
                    {/* Header */}
                    <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Bot size={24} />
                            <h3 className="font-semibold">AI Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-700 p-1 rounded">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border p-3 rounded-lg rounded-bl-none shadow-sm">
                                    <Loader2 className="animate-spin text-indigo-600" size={20} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t rounded-b-lg">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                disabled={loading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !inputText.trim()}
                                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 transition"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Float Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 flex items-center gap-2"
                >
                    <MessageSquare size={24} />
                    <span className="font-medium hidden sm:inline">AI Chat</span>
                </button>
            )}
        </div>
    );
};

export default ChatBot;
