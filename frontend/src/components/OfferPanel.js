import React, { useEffect, useMemo, useState } from 'react';

const fakeNames = ['Arjun','Meera','Kabir','Isha','Rohit','Ananya','Vivaan','Sara'];

const OfferPanel = ({ price, onClose }) => {
  const [offers, setOffers] = useState([]);
  const [myOffer, setMyOffer] = useState('');
  const topOffer = useMemo(() => offers[0]?.amount || 0, [offers]);

  useEffect(() => {
    const t = setInterval(() => {
      setOffers((prev) => {
        const inc = Math.max(10, Math.round(price * 0.01));
        const nextAmt = Math.min(price, (prev[0]?.amount || Math.round(price * 0.7)) + inc);
        const entry = { user: fakeNames[Math.floor(Math.random()*fakeNames.length)], amount: nextAmt, ts: Date.now() };
        const next = [entry, ...prev].sort((a,b)=>b.amount-a.amount).slice(0, 6);
        return next;
      });
    }, 1400);
    return () => clearInterval(t);
  }, [price]);

  const submit = (e) => {
    e.preventDefault();
    const amt = Number(myOffer);
    if (!amt || amt <= 0) return;
    setOffers((prev) => [{ user: 'You', amount: amt, ts: Date.now() }, ...prev].sort((a,b)=>b.amount-a.amount));
    setMyOffer('');
  };

  return (
    <div className="txflow-backdrop">
      <div className="txflow-card" style={{ width: 560 }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="txflow-title">Live Offers</h3>
          <button onClick={onClose} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">✕</button>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">Top offer: <span className="font-semibold">₹{topOffer.toLocaleString('en-IN')}</span></div>
        <div className="max-h-56 overflow-auto rounded border border-gray-200 dark:border-gray-700 mb-3">
          {offers.map((o) => (
            <div key={o.ts+o.user} className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800">
              <div className="text-sm"><span className="font-medium">{o.user}</span> offered</div>
              <div className="font-semibold">₹{o.amount.toLocaleString('en-IN')}</div>
            </div>
          ))}
          {offers.length === 0 && <div className="p-3 text-sm text-gray-500">Waiting for first offer…</div>}
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <input type="number" value={myOffer} onChange={(e)=>setMyOffer(e.target.value)} className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-800" placeholder="Your offer (₹)" />
          <button className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Send</button>
        </form>
      </div>
    </div>
  );
};

export default OfferPanel;
