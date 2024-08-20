import { getNormalizedMetadata } from '../quiz/utils.js';
import { render, html, useState, useEffect } from '../../deps/htm-preact.js';
import { mlField, getMLResults } from './mlField.js';

const ChatBot = ({ data }) => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMessageEnabled, setIsMessageEnabled] = useState(true);
  const [showPhotoshopButton, setShowPhotoshopButton] = useState(false);

  const handleMLInput = async (event) => {
    setUserInput(event.target.value);
    setShowPhotoshopButton(false);
  };

  const handleCheckboxChange = () => {
    setIsMessageEnabled(!isMessageEnabled);
  };

  const handleSendMessage = async () => {
    let finalMessage = userInput.trim();
    if (finalMessage) {
      setIsTyping(true);
      const newChatHistory = [...chatHistory, { sender: 'user', message: userInput }];
      setChatHistory(newChatHistory);

      if (isMessageEnabled) {
        finalMessage = `<s>[INST] <<SYS>>\n\n<</SYS>>\n\nSystem: You are an expert recommender for Adobe products and want to help users understand why you recommended they purchase Photoshop given their interests. Please respond with a short response, less than 300 characters. \\nuser:${finalMessage}[/INST]`;
      } else {
        finalMessage = `<s>[INST] <<SYS>>\n\n<</SYS>>\n\n \\nuser:${finalMessage}[/INST]`;
      }

      for await (const chunk of getMLResults(data.endpoint.text, 'CCHomeMLRepo1', finalMessage)) {
        const botMessage = chunk;
        newChatHistory.push({ sender: 'bot', message: botMessage });
        setChatHistory([...newChatHistory]); // Spread to create a new reference
        // Check if the bot's response contains the word "Photoshop"
        if (botMessage.toLowerCase().includes('photoshop')) {
          setShowPhotoshopButton(true);
        }
      }

      setUserInput('');
      setIsTyping(false);
    }
  };

  const handleMLEnter = async (event) => {
    if (event.keyCode === 13) {
      await handleSendMessage();
    }
  };

  const toggleChat = () => {
    const container = document.querySelector('.chat-container');
    const input = document.getElementById('quiz-input');
    if (!container.classList.contains('active')) {
      container.classList.add('active');
      setTimeout(() => { input.focus(); }, 750);
    } else {
      container.classList.remove('active');
      input.blur();
    }
  };

  useEffect(() => {
    document.getElementById('quiz-input').value = userInput;
  }, [userInput]);

  useEffect(() => {
    document.getElementById('quiz-input').value = userInput;
    const historyEl = document.querySelector('.chat-history');
    historyEl.scrollTop = historyEl.scrollHeight;
  }, [chatHistory]);

  return html`
    <div class="chat-banner">
      <p class="chat-header">Have more questions?</p>
    </div>
    <div class="chat-wrapper">
      <div class="chat-tab">
        <button onClick=${toggleChat} class="chat-invoke" tabindex="0">Ask AI</button>
      </div>
      <div class="chat-container">
        <p class="chat-intro">Ask AI about our products!</p>
        <div class="chat-history">
          ${chatHistory.map((entry) => html`
            <div class="${entry.sender}-message">
              ${entry.message}
            </div>
          `)}
        </div>
        ${isTyping && html`<div class="bot-typing">Adobe AI is typing...</div>`}
        ${showPhotoshopButton && html`
          <div class="photoshop-button-container">
            <button onClick=${() => { window.open('https://photoshop.adobe.com', '_blank'); }}>
              Go to play Photoshop
            </button>
          </div>
        `}
        <div class="input-container">
          <${mlField}
            cardsUsed=${false} 
            onMLInput=${handleMLInput} 
            onMLEnter=${handleMLEnter} 
            placeholderText="Enter Prompt"
          />
          <div class="button-container">
            <button onClick=${handleSendMessage}>Submit</button>
          </div>
          <div class="label-container">
            <label>
              <input 
                type="checkbox" 
                checked=${isMessageEnabled} 
                onChange=${handleCheckboxChange} 
              /> Enable System Settings(System: You are an expert recommender for Adobe products and want to help users understand why you recommended they purchase Photoshop given their interests. Please respond with a short response, less than 300 characters.)
            </label>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default async function init(el) {
  const data = getNormalizedMetadata(el);
  el.replaceChildren();
  render(html`<${ChatBot} data=${data}/>`, el);
}
