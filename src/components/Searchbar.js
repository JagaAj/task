import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
const Searchbar = () => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        //the value will be send to api and responsed it
        const response = await axios.get(
          `http://localhost:8080/products/search?keyword=${value}`
        );
        setSearchResults(response.data); //api result value will be stored
        setNoResults(response.data.length === 0); //making it false
        console.log(response.data);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  return (
    <div className="search-container">
      <div className="input-wrapper">
        <ion-icon
          name="search-outline"
          className="search-icon"
          id="search"
        ></ion-icon>

        <input
          value={input}
          placeholder="Type to search..."
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>
      {showSearchResults && (
        <div className="search-result-list">
          <ul className="list-group">
            {searchResults.length > 0
              ? searchResults.map((result) => (
                  <li key={result.id} className="results-list">
                    <a
                      href={`/product/${result.id}`}
                      className="search-result-link"
                    >
                      <span className="list-name">{result.name}</span>
                    </a>
                  </li>
                ))
              : noResults && (
                  <p className="no-results-message">
                    No Product with such Name
                  </p>
                )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
