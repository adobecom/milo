import { getNormalizedMetadata } from '../quiz/utils.js';
import { render, html, useState, useEffect } from '../../deps/htm-preact.js';
import { mlField, getMLResults } from './mlField.js';

const ChatBot = ({ data }) => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMessageEnabled, setIsMessageEnabled] = useState(false);

  const handleMLInput = async (event) => {
    setUserInput(event.target.value);
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
        finalMessage = `<s>[INST] <<SYS>>\n\n<</SYS>>\n\nSystem: You are an expert recommender for Adobe products and want to help users understand why you recommend they purchase Photoshop given that they said their interests were \\nuser:${finalMessage}[/INST]`;
      } else { 
        finalMessage = `<s>[INST] <<SYS>>\n\n<</SYS>>\n\n \\nuser:${finalMessage}[/INST]`;
      }

      for await (const chunk of getMLResults(data.endpoint.text, 'CCHomeMLRepo1', finalMessage)) {
        newChatHistory.push({ sender: 'bot', message: chunk });
        setChatHistory([...newChatHistory]); // Spread to create a new reference
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

  useEffect(() => {
    document.getElementById('quiz-input').value = userInput;
    document.getElementById('quiz-input').focus();
  }, [userInput]);

  return html`
    <div class="chat-container">
      <div class="chat-history">
        ${chatHistory.map((entry) => html`
          <div class="${entry.sender}-message">
            ${entry.message}
          </div>
        `)}
      </div>
      ${isTyping && html`<div class="bot-typing">Bot is typing...</div>`}
      <div class="input-container">
        <${mlField}
          cardsUsed=${false} 
          onMLInput=${handleMLInput} 
          onMLEnter=${handleMLEnter} 
          placeholderText="Type your message..."
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
            /> Enable System Settings(System: You are an expert recommender for Adobe products and want to help users understand why you recommend they purchase Photoshop given that they said their interests were)
          </label>
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
