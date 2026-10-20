'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: string;
  productType: string;
  targetUrl: string;
  keyword: string;
  targetQuantity: number;
  currentCount: number;
  status: string;
  createdAt: string;
}

export default function UserDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState({
    productType: '네이버 플레이스',
    targetUrl: '',
    keyword: '',
    targetQuantity: 100,
    memo: '',
  });

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, userId: 'DEMO_USER_ID' }),
    });

    if (res.ok) {
      alert('오더가 성공적으로 등록되었습니다.');
      setForm({ productType: '네이버 플레이스', targetUrl: '', keyword: '', targetQuantity: 100, memo: '' });
      fetchOrders();
    } else {
      alert('오더 등록 실패');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">리워드 오더 관리 대시보드</h1>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">신규 오더 등록</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">상품 유형</label>
            <select
              value={form.productType}
              onChange={(e) => setForm({ ...form, productType: e.target.value })}
              className="mt-1 w-full border rounded p-2"
            >
              <option value="네이버 플레이스">네이버 플레이스</option>
              <option value="영수증 리뷰">영수증 리뷰</option>
              <option value="블로그 체험단">블로그 체험단</option>
              <option value="기타 리워드">기타 리워드</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">목표 수량</label>
            <input
              type="number"
              value={form.targetQuantity}
              onChange={(e) => setForm({ ...form, targetQuantity: Number(e.target.value) })}
              className="mt-1 w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">타겟 URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={form.targetUrl}
              onChange={(e) => setForm({ ...form, targetUrl: e.target.value })}
              className="mt-1 w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">키워드</label>
            <input
              type="text"
              placeholder="예: 플레이스 타겟 키워드"
              value={form.keyword}
              onChange={(e) => setForm({ ...form, keyword: e.target.value })}
              className="mt-1 w-full border rounded p-2"
              required
            />
          </div>

          <div className="col-span-2">
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">
              오더 등록하기
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">내 오더 진행 현황</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-sm text-gray-600">
              <th className="p-3">상품명</th>
              <th className="p-3">키워드</th>
              <th className="p-3">진행률 (현재/목표)</th>
              <th className="p-3">상태</th>
              <th className="p-3">등록일</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">등록된 오더가 없습니다.</td>
              </tr>
            ) : (
              orders.map((order) => {
                const progress = Math.round((order.currentCount / order.targetQuantity) * 100);
                return (
                  <tr key={order.id} className="border-b text-sm hover:bg-gray-50">
                    <td className="p-3 font-medium">{order.productType}</td>
                    <td className="p-3">{order.keyword}</td>
                    <td className="p-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1 max-w-xs">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-500">{order.currentCount} / {order.targetQuantity} ({progress}%)</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        order.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
