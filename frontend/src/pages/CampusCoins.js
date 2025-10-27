import React, { useEffect, useState } from 'react';
import { getCoinBalance, getRecentTransactions, generateReferralCode, getCoinPrices } from '../services/campusCoinService';

const CampusCoins = () => {
  const [balance, setBalance] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [recent, setRecent] = useState([]);
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [genLoading, setGenLoading] = useState(false);

  const load = async () => {
    setError('');
    try {
      const [bal, rec, p] = await Promise.all([
        getCoinBalance(),
        getRecentTransactions(),
        getCoinPrices().catch(() => null),
      ]);
      setBalance(bal.campusCoins || 0);
      setReferralCode(bal.referralCode || '');
      setTotalReferrals(bal.totalReferrals || 0);
      setRecent(rec || []);
      setPrices(p);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load CampusCoins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleGenerateReferral = async () => {
    setGenLoading(true);
    try {
      const res = await generateReferralCode();
      setReferralCode(res.referralCode);
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to generate referral code');
    } finally {
      setGenLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">CampusCoins Wallet</h1>

      {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Balance</div>
          <div className="text-3xl font-bold mt-1">{balance} <span className="text-base font-medium text-gray-500">coins</span></div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Referrals</div>
          <div className="text-3xl font-bold mt-1">{totalReferrals}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Referral Code</div>
          {referralCode ? (
            <div className="mt-1 flex items-center justify-between">
              <code className="px-2 py-1 rounded bg-gray-100 text-sm">{referralCode}</code>
              <button
                className="px-3 py-1.5 text-sm rounded bg-gray-800 text-white hover:bg-black"
                onClick={() => navigator.clipboard.writeText(referralCode)}
              >Copy</button>
            </div>
          ) : (
            <button
              className="mt-1 px-3 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-50"
              onClick={handleGenerateReferral}
              disabled={genLoading}
            >{genLoading ? 'Generating…' : 'Generate Referral Code'}</button>
          )}
        </div>
      </div>

      {prices && (
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <h2 className="font-semibold mb-3">Coin Prices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded bg-gray-50">Boost Product: <span className="font-medium">{prices.boostProduct} coins</span></div>
            <div className="p-3 rounded bg-gray-50">Unlock Badge: <span className="font-medium">{prices.unlockBadge} coins</span></div>
            <div className="p-3 rounded bg-gray-50">Discount Rate: <span className="font-medium">{prices.discountRate}</span></div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b"><h2 className="font-semibold">Recent Transactions</h2></div>
        <div className="divide-y">
          {recent.length === 0 ? (
            <div className="p-4 text-gray-500">No transactions yet.</div>
          ) : recent.map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{t.description}</div>
                <div className="text-xs text-gray-500">{t.type} • {new Date(t.createdAt).toLocaleString()}</div>
              </div>
              <div className={`text-sm font-semibold ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {t.amount >= 0 ? '+' : ''}{t.amount}
                <div className="text-xs text-gray-500 text-right">Balance: {t.balanceAfter}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampusCoins;
