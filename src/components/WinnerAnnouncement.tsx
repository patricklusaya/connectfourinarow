import React, { useEffect, useState } from 'react';
import '../styles/WinnerAnnouncement.css';

interface WinnerAnnouncementProps {
  winner: 1 | 2;
  gameMode: 'friend' | 'robot';
  onClose: () => void;
}

const WinnerAnnouncement: React.FC<WinnerAnnouncementProps> = ({ winner, gameMode, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const winnerText = gameMode === 'robot' 
    ? (winner === 1 ? '🎉 You Win! 🎉' : '😢 Robot Wins!')
    : `🏆 Player ${winner} Wins! 🏆`;

  return (
    <div className={`winner-announcement ${visible ? 'show' : 'hide'}`}>
      <div className="winner-content">
        <h2 className="winner-text">{winnerText}</h2>
      </div>
    </div>
  );
};

export default WinnerAnnouncement;

