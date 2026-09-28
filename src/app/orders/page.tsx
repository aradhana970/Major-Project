'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_ORDERS } from '@/lib/mockData';
import { OrderStatus } from '@/types/database';
import { ShoppingBag, Clock, CheckCircle2, ChevronRight, MapPin, User, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function OrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        return { ...ord, status: newStatus };
      }
      return ord;
    });
    setOrders(updated);
    toast.success(`Order status updated to "${newStatus}"! Notification email sent.`);
  };

  const statusColors: Record<OrderStatus, string> = {
    'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
    'Accepted': 'bg-blue-100 text-blue-800 border-blue-200',
    'Ready for Pickup': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Cancelled': 'bg-rose-100 text-rose-800 border-rose-200',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order History</h1>
          <p className="text-xs text-slate-500 mt-1">Track purchases and seller fulfillment updates</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">No Orders Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't placed or received any orders on CampusKart yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
              
              {/* Order Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-600">{order.order_number}</span>
                  <span className="text-xs text-slate-400 ml-2">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{item.product?.title}</span>
                      <span className="text-slate-500 ml-2">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-black text-slate-900">₹{item.unit_price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer & Seller Status Update Controls */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="text-slate-600 space-y-1">
                  <div><strong>Seller:</strong> {order.seller?.full_name} ({order.seller?.college_name})</div>
                  <div><strong>Campus Pickup Note:</strong> {order.pickup_notes || 'Central Library Gate'}</div>
                </div>

                <div className="flex items-center gap-2">
                  {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="Pending">Status: Pending</option>
                      <option value="Accepted">Status: Accepted</option>
                      <option value="Ready for Pickup">Status: Ready for Pickup</option>
                      <option value="Completed">Status: Completed</option>
                      <option value="Cancelled">Status: Cancelled</option>
                    </select>
                  )}

                  <Link
                    href={`/orders/${order.id}`}
                    className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl flex items-center gap-1 transition-colors"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
