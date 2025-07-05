import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const initialMessages: Message[] = [
  { sender: 'bot', text: 'Hi! I am the Oracle Assistant. How can I help you today?' }
];

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { sender: 'user', text: input }
    ]);
    setInput('');
    // For now, just echo a placeholder bot reply
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: 'This is a demo. I will answer your questions soon!' }
      ]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button className="chatbot-fab" onClick={() => setOpen(true)} aria-label="Open chatbot">
          💬
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Oracle Assistant</span>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chatbot">×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-msg chatbot-msg-${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input-row" onSubmit={handleSend}>
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
            />
            <button type="submit" className="chatbot-send" aria-label="Send">➤</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot; 