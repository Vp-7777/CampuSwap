import React, { useState, useEffect } from 'react';

const CoinEarnNotification = ({ amount, message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div className="card-modern p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-2xl max-w-sm">
        <div className="flex items-center gap-3">
          <div className="text-4xl animate-coin-spin">🪙</div>
          <div className="flex-1">
            <div className="text-2xl font-bold">+{amount} Coins!</div>
            <div className="text-sm opacity-90">{message}</div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-xl font-bold"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoinEarnNotification;
