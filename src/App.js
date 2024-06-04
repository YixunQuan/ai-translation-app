import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './App.css';
import { SocialIcon } from 'react-social-icons'

const API_KEY = 'AIzaSyAALIp6OCqzTjF2es3jYElvqXfe_lf9GOc'; // Replace with your Google API key

const genAI = new GoogleGenerativeAI(API_KEY);

const App = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en'); // Default translation to English
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const translateText = async () => {
    setIsLoading(true); // Set loading to true before translation
    setTypingText(''); // Clear previous result before translation
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Translate "${inputText}" to ${targetLanguage}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = await response.text();
    setTranslatedText(translatedText);
    setIsTyping(true);
  };

  useEffect(() => {
    if (isTyping) {
      let currentIndex = 0;
      const intervalId = setInterval(() => {
        setTypingText((prev) => prev + translatedText[currentIndex]);
        currentIndex++;
        if (currentIndex === translatedText.length) {
          clearInterval(intervalId);
          setIsTyping(false);
          setIsLoading(false); // Reset loading after typing is done
        }
      }, 5);
      return () => clearInterval(intervalId);
    }
  }, [isTyping, translatedText]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setTargetLanguage(e.target.value);
  };

  const handleTranslate = () => {
    if (!isLoading) { // Only translate if not already loading
      translateText();
    }
  };

  return (
    <div className="App">
      <h1>AI Translation </h1>
      <div className="container">
        <div className="translation-panel">
          <textarea
            placeholder="Enter text to translate..."
            value={inputText}
            onChange={handleInputChange}
            rows={5}
            cols={50}
            style={{ width: '100%' }}
          />
          <br />
          <label>
            Select translation language:
            <select value={targetLanguage} onChange={handleLanguageChange}>
              <option value="en">English</option>
              <option value="zh">Chinese</option>
              <option value="hi">Hindi</option>
            </select>
          </label>
          <br />
          <button onClick={handleTranslate} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Translate'}
          </button>
        </div>
        <div className="result-panel">
          <h2>Translation Result:</h2>
          <p>{typingText}</p>
        </div>
      </div>
      <div className="footer">
        <p>Created by Yixun, language model power by Google AI</p>
        <div className="social-links">
        <SocialIcon href="https://github.com/YixunQuan" url="www.github.com"></SocialIcon>
        <SocialIcon href="https://www.linkedin.com/in/yixun-quan-929a661a3/" url='www.linkedin.com'></SocialIcon>
        </div>
      </div>
    </div>
  );
};

export default App;
