import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearch, FaMicrophone } from 'react-icons/fa';
import classes from './search.module.css';

Search.defaultProps = {
  searchRoute: '/search/',
  defaultRoute: '/',
  placeholder: 'Search Isvaryam products...',
};

export default function Search({
  searchRoute,
  defaultRoute,
  margin,
  placeholder,
}) {
  const [term, setTerm] = useState('');
  const [listening, setListening] = useState(false);
  const navigate = useNavigate();
  const { searchTerm } = useParams();

  useEffect(() => {
    setTerm(searchTerm ?? '');
  }, [searchTerm]);

  const search = () => {
    term ? navigate(searchRoute + term) : navigate(defaultRoute);
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      setTerm(transcript);
      setTimeout(search, 500); // Give user a moment to see result
    };

    recognition.start();
  };

  return (
    <div className={classes.searchContainer} style={{ margin }}>
      <div className={classes.inputWrapper}>
        <FaSearch className={classes.icon} />
        <input
          type="text"
          placeholder={placeholder}
          onChange={e => setTerm(e.target.value)}
          onKeyUp={e => e.key === 'Enter' && search()}
          value={term}
          className={classes.input}
        />
        <button
          onClick={handleVoiceSearch}
          type="button"
          className={classes.voiceBtn}
          title="Speak to search"
        >
          <FaMicrophone className={listening ? classes.listening : ''} />
        </button>
      </div>
      <button onClick={search} className={classes.button}>Search</button>
    </div>
  );
}
