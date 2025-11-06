import React, { useEffect, useMemo, useState } from 'react';
import { productAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SmartPrice = ({ category, onPick }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await productAPI.getAll();
        const items = (res.data || []).filter(p => p.category === category);
        setData(items.map(p => p.price).sort((a,b)=>a-b));
      } catch {}
    })();
  }, [category]);

  const stats = useMemo(() => {
    if (data.length === 0) return null;
    const n = data.length;
    const avg = Math.round(data.reduce((a,b)=>a+b,0)/n);
    const median = data[Math.floor(n/2)];
    const low = data[Math.floor(n*0.25)] || data[0];
    const high = data[Math.floor(n*0.75)] || data[n-1];
    return { avg, median, low, high };
  }, [data]);

  const chart = useMemo(() => data.slice(0, 12).map((v,i)=>({ i, v })), [data]);

  if (!stats) return null;
  return (
    <div className="card p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Smart Price Suggestion</div>
        <div className="text-sm text-gray-500">Based on similar listings</div>
      </div>
      <div className="mt-2 text-sm">Suggested: <span className="font-semibold">₹{stats.median.toLocaleString('en-IN')}</span> (avg ₹{stats.avg.toLocaleString('en-IN')})</div>
      <div className="mt-2 text-xs text-gray-500">Range: ₹{stats.low.toLocaleString('en-IN')} – ₹{stats.high.toLocaleString('en-IN')}</div>
      <div className="h-28 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart}>
            <XAxis dataKey="i" hide />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="v" fill="#6366F1" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={()=>onPick(stats.low)} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800">Low</button>
        <button onClick={()=>onPick(stats.median)} className="px-3 py-1 rounded bg-indigo-600 text-white">Suggested</button>
        <button onClick={()=>onPick(stats.high)} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800">High</button>
      </div>
    </div>
  );
};

export default SmartPrice;