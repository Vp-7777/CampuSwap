import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#6366F1', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6'];

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      const [a, s, p, u] = await Promise.all([
        adminAPI.analytics(),
        adminAPI.stats(),
        adminAPI.getPending(),
        adminAPI.users(),
      ]);
      setAnalytics(a.data);
      setStats(s.data);
      setPending(p.data || []);
      setUsers(u.data || []);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    await adminAPI.approve(id);
    setPending(prev => prev.filter(p => p.id !== id));
  };

  const reject = async (id) => {
    await adminAPI.reject(id);
    setPending(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}

      {/* KPI cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded shadow p-4"><div className="text-sm text-gray-500">Users</div><div className="text-2xl font-bold">{analytics.totalUsers}</div></div>
          <div className="bg-white rounded shadow p-4"><div className="text-sm text-gray-500">Products</div><div className="text-2xl font-bold">{analytics.totalProducts}</div></div>
          <div className="bg-white rounded shadow p-4"><div className="text-sm text-gray-500">Pending</div><div className="text-2xl font-bold">{analytics.pendingApprovals}</div></div>
          <div className="bg-white rounded shadow p-4"><div className="text-sm text-gray-500">Approved</div><div className="text-2xl font-bold">{analytics.approvedProducts}</div></div>
          <div className="bg-white rounded shadow p-4"><div className="text-sm text-gray-500">Transactions</div><div className="text-2xl font-bold">{analytics.totalTransactions}</div></div>
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">User Growth (weekly)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={stats.userGrowth}>
                <XAxis dataKey="week" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">Weekly Listings</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.weeklyListings}>
                <XAxis dataKey="week" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#14B8A6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">Top Categories (by views)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.topCategories}>
                <XAxis dataKey="category" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="views" fill="#F59E0B" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-2">Approval Ratio</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={[
                  { name: 'Approved', value: stats.approvalRatio.approved },
                  { name: 'Pending', value: stats.approvalRatio.pending },
                  { name: 'Rejected', value: stats.approvalRatio.rejected },
                ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {COLORS.map((c, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Sellers table */}
      {stats && (
        <div className="bg-white rounded shadow">
          <div className="p-4 border-b"><h2 className="font-semibold">Top Sellers</h2></div>
          <div className="divide-y">
            {stats.topSellers.map((s) => (
              <div key={s.userId} className="p-4 flex items-center justify-between">
                <div className="font-medium">{s.fullName}</div>
                <div className="text-sm text-gray-500">Listings: {s.listings} • Views: {s.views}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending approvals */}
      <div className="bg-white rounded shadow">
        <div className="p-4 border-b"><h2 className="font-semibold">Pending Products</h2></div>
        {pending.length === 0 ? (
          <div className="p-4 text-gray-500">No pending products.</div>
        ) : (
          <div className="divide-y">
            {pending.map(p => (
              <div key={p.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                    {p.images && p.images[0] && (
                      <img src={p.images[0].startsWith('http') ? p.images[0] : `http://localhost:8080${p.images[0]}`} alt={p.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-gray-500">{p.category} • ₹{p.price}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => approve(p.id)} className="px-3 py-1.5 rounded bg-green-600 text-white text-sm hover:bg-green-700">Approve</button>
                  <button onClick={() => reject(p.id)} className="px-3 py-1.5 rounded bg-red-600 text-white text-sm hover:bg-red-700">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Users list */}
      <div className="bg-white rounded shadow">
        <div className="p-4 border-b"><h2 className="font-semibold">Users</h2></div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Coins</th>
                <th className="p-3">Referrals</th>
                <th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.fullName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{u.campusCoins}</td>
                  <td className="p-3">{u.totalReferrals}</td>
                  <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
