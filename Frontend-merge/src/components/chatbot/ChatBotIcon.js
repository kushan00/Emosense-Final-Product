// ChatbotIcon.js
import React , { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment , faXmark } from '@fortawesome/free-solid-svg-icons';
import './ChatbotIcon.css';
import ChatBot from './ChatBot';
import './ChatBotClose.css';

function ChatbotIcon() {

  const [isChatBotOpen, setisChatBotOpen] = useState(false);

  const toggleChatBotOpen = () => {
    setisChatBotOpen(true);
  }

  const toggleChatBotClose = () => {
    setisChatBotOpen(false);
  }
 

  return (
    <div>

      {isChatBotOpen === true?
        <div className="chatbot-close-container">
        <div className="chatbot-close-icon" onClick={toggleChatBotClose}>
          <FontAwesomeIcon icon={faXmark} size="2x" />           
        </div>
      </div>
      :
      <div className="chatbot-icon" onClick={toggleChatBotOpen}>
        <FontAwesomeIcon icon={faComment} size="2x" />       
      </div>
      }
      {isChatBotOpen && <ChatBot />}
    </div>
    
  );
}

export default ChatbotIcon;
