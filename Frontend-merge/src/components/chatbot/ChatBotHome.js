import React, { Component } from 'react';
import ChatBot from './ChatBot';
import './ChatBot.css';


class ChatBotHome extends Component {
  constructor(props) {
     super(props);
     this.state = {
       isChatBotOpen: true,
     };
   }
 
   toggleChatBot = () => {
     this.setState(prevState => ({
       isChatBotOpen: !prevState.isChatBotOpen,
     }));
   }
 
   render() {
     const { isChatBotOpen } = this.state;
 
     return (
       <div className="app-container">
         <button onClick={this.toggleChatBot}>
           {isChatBotOpen ? 'Close Remote Workmate' : 'Open Remote Workmate'}
         </button>
 
         {isChatBotOpen && <ChatBot />}
       </div>
     );
   }
 }
 
 export default ChatBotHome;
 