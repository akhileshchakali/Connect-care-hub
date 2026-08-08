import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, Paperclip, Image as ImageIcon } from 'lucide-react';
import OpenAI from 'openai';
import './Chatbot.css';

// Initialize OpenAI client pointing to Groq's API
const groq = new OpenAI({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
  dangerouslyAllowBrowser: true // Required for frontend usage
});

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am CareConnect AI. How can I assist you with your health or appointments today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!inputMessage.trim() && !selectedImage) || isLoading) return;

    const userMessage = inputMessage.trim();
    const uploadedImage = selectedImage; // capture current state
    setInputMessage('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    // Add user message to UI
    const updatedMessages = [...messages, { role: 'user', content: userMessage, image: uploadedImage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Format previous history for API
      const apiHistory = messages.map(msg => {
        if (msg.image) {
          return {
            role: msg.role,
            content: [
              { type: "text", text: msg.content || "Here is an image." },
              { type: "image_url", image_url: { url: msg.image } }
            ]
          };
        }
        return { role: msg.role, content: msg.content };
      });

      // Format current payload
      let currentPayload;
      let apiModel = 'llama-3.1-8b-instant'; // Default fast model

      if (uploadedImage) {
        apiModel = 'llama-3.2-11b-vision-preview'; // Switch to vision model
        currentPayload = [
          { type: "text", text: userMessage || "Analyze this medical prescription or report." },
          { type: "image_url", image_url: { url: uploadedImage } }
        ];
      } else {
        currentPayload = userMessage;
      }

      const response = await groq.chat.completions.create({
        messages: [
           { role: 'system', content: 'You are CareConnect AI, a helpful health assistant for the CareConnect Hub platform. You can analyze medical prescriptions, lab reports, and answer health queries. Keep answers concise, empathetic, and medically safe (remind users to consult real doctors for serious conditions).' },
           ...apiHistory,
           { role: 'user', content: currentPayload }
        ],
        model: apiModel,
        temperature: 0.7,
        max_tokens: 1024,
      });

      const aiResponse = response.choices[0]?.message?.content || "I'm having trouble connecting right now.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);

    } catch (error) {
      console.error("Groq API Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "An error occurred while fetching the response. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className={`chatbot-toggle-btn ${isOpen ? 'hidden' : 'visible'}`}
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window glass-panel ${isOpen ? 'open' : 'closed'}`}>
        <div className="chatbot-header">
          <div className="header-title">
            <Bot size={20} className="bot-icon" />
            <h3>CareConnect AI</h3>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-bubble-container ${msg.role}`}>
              <div className={`chat-bubble ${msg.role}`}>
                {msg.image && (
                  <img src={msg.image} alt="Uploaded attachment" className="chat-uploaded-img" />
                )}
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-bubble-container assistant">
              <div className="chat-bubble assistant typing">
                <Loader2 size={16} className="spinner" />
                <span>Typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input-area">
          {selectedImage && (
            <div className="image-preview-container">
              <img src={selectedImage} alt="Preview" className="image-preview" />
              <button 
                className="remove-image-btn" 
                onClick={() => {
                  setSelectedImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}
          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImageUpload} 
            />
            <button 
              type="button" 
              className="attach-btn" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              placeholder="Ask a question or upload a report..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={(!inputMessage.trim() && !selectedImage) || isLoading} className="send-btn">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
