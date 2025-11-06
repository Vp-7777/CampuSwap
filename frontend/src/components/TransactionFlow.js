import React, { useEffect, useState } from 'react';

// Simple visual simulation of a transaction lifecycle
// Stages: Request sent -> Seller reviewing -> Accepted -> Completed
// Props:
// - onDone: called when simulation completes
// - speed: ms between stages (default 1200)
const TransactionFlow = ({ onDone, speed = 1200 }) => {
  const steps = [
    { key: 'sent', label: 'Request Sent', icon: '📨' },
    { key: 'review', label: 'Seller Reviewing', icon: '🕑' },
    { key: 'accepted', label: 'Accepted', icon: '✅' },
    { key: 'completed', label: 'Completed', icon: '🎉' },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => {
        const next = Math.min(i + 1, steps.length - 1);
        if (next === steps.length - 1) {
          clearInterval(t);
          setTimeout(() => onDone && onDone(), speed);
        }
        return next;
      });
    }, speed);
    return () => clearInterval(t);
  }, [speed, onDone]);

  return (
    <div className="txflow-backdrop">
      <div className="txflow-card">
        <h3 className="txflow-title">Processing Order</h3>
        <div className="txflow-steps">
          {steps.map((s, i) => (
            <div key={s.key} className={`txflow-step ${i <= index ? 'active' : ''}`}>
              <span className="txflow-icon">{s.icon}</span>
              <span className="txflow-label">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="txflow-progress">
          <div className="txflow-bar" style={{ width: `${(index / (steps.length - 1)) * 100}%` }} />
        </div>
      </div>
    </div>
  );
};

export default TransactionFlow;
