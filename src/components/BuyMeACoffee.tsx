import React from 'react';
import { track } from '@vercel/analytics';
import '../styles/BuyMeACoffee.css';

const BuyMeACoffee: React.FC = () => {
  const handleClick = () => {
    track('buy_me_coffee_click', {
      location: 'bottom_right_button',
    });
  };

  return (
    <a
      href="https://buymeacoffee.com/patricklusaya"
      target="_blank"
      rel="noopener noreferrer"
      className="buy-me-coffee"
      aria-label="Buy me a coffee"
      onClick={handleClick}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="coffee-icon"
      >
        <path
          d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="coffee-text">Buy me a coffee</span>
    </a>
  );
};

export default BuyMeACoffee;

