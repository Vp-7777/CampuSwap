import React, { useEffect, useMemo, useRef, useState } from 'react';

const names = ['Arjun','Meera','Kabir','Isha','Rohit','Ananya','Vivaan','Sara','Dev','Maya'];

const AuctionPanel = ({ price, productId, onClose, minutes = 0, seconds = 45 }) => {
  const [time, setTime] = useState(minutes * 60 + seconds);
  const [bids, setBids] = useState([]);
  const [myBid, setMyBid] = useState('');
  const [finishing, setFinishing] = useState(false);
  const [ended, setEnded] = useState(false);
  const [winner, setWinner] = useState(null);
  const top = bids[0]?.amount || Math.round(price * 0.6);
  const containerRef = useRef(null);
  const lastTopRef = useRef({ amount: 0, ts: Date.now() });
  const bidsRef = useRef([]);

  // countdown
  useEffect(() => {
    const t = setInterval(() => setTime((x) => Math.max(0, x - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  // declare winner helper
  const declareWinner = () => {
    if (ended || finishing) return;
    setFinishing(true);
    const delay = 3000 + Math.round(Math.random() * 2000);
    setTimeout(() => {
      const currentTop = (bidsRef.current && bidsRef.current[0]) ? bidsRef.current[0] : null;
      setWinner((prev) => currentTop || prev);
      setEnded(true);
      setFinishing(false);
    }, delay);
  };

  // simulate incoming bids
  useEffect(() => {
    if (ended) return;
    const t = setInterval(() => {
      setBids((prev) => {
        const inc = Math.max(5, Math.round(price * 0.01));
        const nextAmt = Math.min(price, (prev[0]?.amount || Math.round(price * 0.6)) + inc + Math.round(Math.random()*inc));
        // pick a name that hasn't placed the same price already
        let candidate = names[Math.floor(Math.random()*names.length)];
        let guard = 0;
        while (prev.some(b => b.user === candidate && b.amount === nextAmt) && guard < 15) {
          candidate = names[Math.floor(Math.random()*names.length)];
          guard++;
        }
        const entry = { user: candidate, amount: nextAmt, ts: Date.now() };
        const next = [entry, ...prev].sort((a,b)=>b.amount-a.amount).slice(0, 15);
        // if someone reaches buyout price, finish soon
        if (next[0]?.amount >= price) declareWinner();
        // update last-top change time
        if (next[0] && next[0].amount !== lastTopRef.current.amount) {
          lastTopRef.current = { amount: next[0].amount, ts: Date.now() };
        }
        return next;
      });
      if (containerRef.current) containerRef.current.scrollTop = 0;
    }, 1200);
    return () => clearInterval(t);
  }, [ended, price]);

  // stop at timer end
  useEffect(() => {
    if (time === 0 && !ended) declareWinner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  // inactivity auto-finish: if no new top bid for 5 seconds
  useEffect(() => {
    if (ended) return;
    const tick = setInterval(() => {
      const idleFor = Date.now() - lastTopRef.current.ts;
      if (idleFor > 5000 && bids.length > 0) declareWinner();
    }, 1000);
    return () => clearInterval(tick);
  }, [ended, bids.length]);

  const place = (e) => {
    e.preventDefault();
    const amt = Number(myBid);
    if (!amt || amt <= top || ended) return;
    setBids((prev) => {
      // prevent same-person same-price duplicate
      if (prev.some(b => b.user === 'You' && b.amount === amt)) return prev;
      const next = [{ user: 'You', amount: amt, ts: Date.now() }, ...prev].sort((a,b)=>b.amount-a.amount);
      if (next[0]?.amount >= price) declareWinner();
      if (next[0] && next[0].amount !== lastTopRef.current.amount) {
        lastTopRef.current = { amount: next[0].amount, ts: Date.now() };
      }
      return next;
    });
    setMyBid('');
  };

  // keep ref in sync for winner selection
  useEffect(() => { bidsRef.current = bids; }, [bids]);

  const timeText = useMemo(() => {
    const m = Math.floor(time/60), s = time%60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }, [time]);

  return (
    <div className="txflow-backdrop">
      <div className="txflow-card" style={{ width: 620 }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="txflow-title">Live Auction</h3>
          <div className={`px-2 py-1 rounded text-white ${ended?'bg-gray-500':'bg-rose-600'}`}>{ended?'Ended':timeText}</div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Top bid: <span className="font-semibold">₹{top.toLocaleString('en-IN')}</span> • Buyout: ₹{price.toLocaleString('en-IN')}</div>
        <div ref={containerRef} className="max-h-56 overflow-auto rounded border border-gray-200 dark:border-gray-700 mb-3">
          {bids.map((b) => (
            <div key={b.ts+b.user} className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800">
              <div className="text-sm"><span className="font-medium">{b.user}</span> bid</div>
              <div className={`font-semibold ${b.user==='You'?'text-emerald-600':''}`}>₹{b.amount.toLocaleString('en-IN')}</div>
            </div>
          ))}
          {bids.length === 0 && <div className="p-3 text-sm text-gray-500">No bids yet… be the first!</div>}
        </div>
        {!ended ? (
          <form onSubmit={place} className="flex gap-2">
            <input type="number" value={myBid} onChange={(e)=>setMyBid(e.target.value)} className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-800" placeholder={`Your bid (> ₹${top})`} />
            <button className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700" disabled={finishing}>Place Bid</button>
            <button type="button" onClick={onClose} className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700">Close</button>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Winner: <span className="font-semibold">{(winner||bids[0])?.user || '—'}</span> for <span className="font-semibold">₹{(winner||bids[0])?.amount?.toLocaleString('en-IN') || '-'}</span></div>
              <button onClick={onClose} className="px-4 py-2 rounded bg-gray-900 text-white dark:bg-gray-700">Close</button>
            </div>
            {(winner?.user === 'You') ? (
              <div className="flex items-center justify-between">
                <div className="text-emerald-600 font-semibold">Message sent: You won the auction! Proceed to payment.</div>
                <a href={`/checkout?productId=${productId}`} className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">Checkout</a>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Message sent to {winner?.user || bids[0]?.user} with purchase instructions.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionPanel;
