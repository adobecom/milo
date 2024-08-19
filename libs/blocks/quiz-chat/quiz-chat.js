import { getNormalizedMetadata } from '../quiz/utils.js';
import { render, html, useState, useEffect } from '../../deps/htm-preact.js';
import { mlField, getMLResults } from './mlField.js';

const ChatBot = ({ data }) => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleMLInput = async (event) => {
    setUserInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      setIsTyping(true);
      const botResponse = await getMLResults(data.endpoint.text, 'CCHomeMLRepo1', userInput);
      setChatHistory([...chatHistory, { sender: 'user', message: userInput }, { sender: 'bot', message: botResponse }]);
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
        <button onClick=${handleSendMessage}>Submit</button>
      </div>
    </div>
  `;
};

export default async function init(el) {
  const data = getNormalizedMetadata(el);
  el.replaceChildren();
  render(html`<${ChatBot} data=${data}/>`, el);
}
