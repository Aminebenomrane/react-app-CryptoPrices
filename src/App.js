import React, { useState, useEffect } from 'react';
import './App.css';
import socketIOClient from 'socket.io-client';
import cryptoLogo from './img/1.jpg';
import cryptoLogo1 from './img/2.jpg';
import cryptoLogo2 from './img/3.jpg';
import cryptoLogo3 from './img/4.jpg';
import cryptoLogo4 from './img/5.jpg';
import cryptoLogo5 from './img/6.jpg';
import cryptoLogo6 from './img/7.jpg';
import cryptoLogo7 from './img/8.jpg';
import cryptoLogo8 from './img/9.jpg';

const CryptoPrice = ({ data, currency }) => {
  return (
    <div>
      <h1 className="crypto-title">Crypto Prices</h1>
      {Object.keys(data).map((crypto) => (
        <div key={crypto}>
          <h2 className="crypto-name">{crypto}</h2>
          {currency === 'usd' ? (
            <p>Current price in $: {data[crypto].usd}</p>
          ) : (
            <p>Current price in €: {data[crypto].eur}</p>
          )}
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('usd');
  const [searchClicked, setSearchClicked] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd,eur'
      );
      const jsonData = await response.json();
      setData(jsonData);

      if (searchTerm) {
        const filteredData = {};

        Object.keys(jsonData).forEach((crypto) => {
          if (crypto.toLowerCase().includes(searchTerm.toLowerCase())) {
            filteredData[crypto] = jsonData[crypto];
          }
        });

        setSearchResults(filteredData);
      } else {
        setSearchResults(null);
      }
    } catch (error) {
      setError("Une erreur s'est produite lors de la récupération des données.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      setSearchClicked(true);
      fetchData();
    }
  };

  const handleCurrencyChange = (selectedCurrency) => {
    setCurrency(selectedCurrency);
  };

  useEffect(() => {
    fetchData();

    const socket = socketIOClient('http://localhost:3001');

    socket.on('priceUpdate', (updatedData) => {
      setData(updatedData);

      if (searchTerm) {
        const filteredData = {};

        Object.keys(updatedData).forEach((crypto) => {
          if (crypto.toLowerCase().includes(searchTerm.toLowerCase())) {
            filteredData[crypto] = updatedData[crypto];
          }
        });

        setSearchResults(filteredData);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [searchTerm]);

  return (
    <div>
      <section id="slideshow">
        <div className="entire-content">
          <div className="content-carrousel">
            <figure className="shadow">
              <img src={cryptoLogo} alt="crypto" />
            </figure>
            <figure className="shadow">
              <img src={cryptoLogo1} alt="crypto1" />
            </figure>
            <figure className="shadow">
              <img src={cryptoLogo2} alt="crypto2" />
            </figure>
            <figure className="shadow">
              <img src={cryptoLogo3} alt="crypto3" />
            </figure>
            <figure className="shadow">
              <img src={cryptoLogo4} alt="crypto4" />
            </figure>
            <figure className="shadow">
              <img src={cryptoLogo5} alt="crypto5" />
            </figure>
            <figure className="shadow">
              <img src={cryptoLogo6} alt="crypto6" />
            </figure>
            <figure className="shadow">
              <img src={cryptoLogo7} alt="crypto7" />
            </figure>
            <figure className="shadow">
              <img src={cryptoLogo8} alt="crypto8" />
            </figure>
          </div>
        </div>
      </section>

      <div className="center-container">
        <h1
          className="crypto-title"
          style={{ fontSize: '24px', color: 'blue', textAlign: 'center' }}
        >
          Chercher les prix de vos cryptomonnaies
        </h1>

        <div
          className="search-container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Donner le nom du Crypto"
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button
            onClick={handleSearch}
            className="search-button"
            style={{ padding: '5px 10px', backgroundColor: 'blue', color: 'white' }}
          >
            Rechercher
          </button>
        </div>

        <div className="currency-container">
          <label>
            <input
              type="radio"
              value="usd"
              checked={currency === 'usd'}
              onChange={() => handleCurrencyChange('usd')}
            />
            USD
          </label>
          <label>
            <input
              type="radio"
              value="eur"
              checked={currency === 'eur'}
              onChange={() => handleCurrencyChange('eur')}
            />
            EUR
          </label>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {searchClicked && searchResults && (
          <div className="search-results">
            {Object.keys(searchResults).length > 0 ? (
              <CryptoPrice data={searchResults} currency={currency} />
            ) : (
              <p>Aucun résultat trouvé</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
