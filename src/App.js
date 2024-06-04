import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './App.css';
import { SocialIcon } from 'react-social-icons'

const API_KEY = process.env.REACT_APP_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const App = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en'); 
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const translateText = async () => {
    try {
      setIsLoading(true); 
      setTypingText(''); 
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Translate "${inputText}" to ${targetLanguage}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const translatedText = await response.text();
      setTranslatedText(translatedText);
      setIsTyping(true);
    } catch (error) {
      console.error("GoogleGenerativeAI Error:", error);
      alert("Sorry, the token has been exhausted. Please try again after 1 minute.");
    } finally {
      setIsLoading(false); 
    }
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
          setIsLoading(false); 
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
    if (!isLoading) {
      translateText();
    }
  };

  return (
    <div className="App">
      <h1>AI Translate </h1>
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
          <SocialIcon href="https://github.com/YixunQuan" url="www.github.com" />
          <SocialIcon href="https://www.linkedin.com/in/yixun-quan-929a661a3/" url="www.linkedin.com" />
        </div>
      </div>
    </div>
  );
};

export default App;
