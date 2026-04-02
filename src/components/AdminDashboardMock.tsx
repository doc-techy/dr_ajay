'use client';

import React, { useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

type Appointment = {
  id: number;
  patientName: string;
  date: string; // ISO date
  time: string; // HH:mm
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
};

type StatusFilter = 'all' | Appointment['status'];

const DUMMY_APPOINTMENTS: Appointment[] = [
  { id: 1, patientName: 'Alice Johnson', date: '2025-10-20', time: '10:00', status: 'pending' },
  { id: 2, patientName: 'Brian Lee', date: '2025-10-20', time: '11:30', status: 'completed' },
  { id: 3, patientName: 'Cynthia Gomez', date: '2025-10-21', time: '09:15', status: 'pending' },
  { id: 4, patientName: 'David Kim', date: '2025-10-21', time: '13:00', status: 'completed' },
  { id: 5, patientName: 'Evelyn Parker', date: '2025-10-22', time: '15:45', status: 'cancelled' },
  { id: 6, patientName: 'Frank Miller', date: '2025-10-22', time: '12:10', status: 'completed' },
  { id: 7, patientName: 'Grace Chen', date: '2025-10-23', time: '10:25', status: 'pending' },
  { id: 8, patientName: 'Hassan Ali', date: '2025-10-23', time: '16:20', status: 'completed' },
  { id: 9, patientName: 'Irene Smith', date: '2025-10-24', time: '09:00', status: 'completed' },
  { id: 10, patientName: 'Jack Wilson', date: '2025-10-24', time: '14:35', status: 'pending' },
];

export default function AdminDashboardMock() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');

  const stats = useMemo(() => {
    const total = DUMMY_APPOINTMENTS.length;
    const pending = DUMMY_APPOINTMENTS.filter(a => a.status === 'pending').length;
    const completed = DUMMY_APPOINTMENTS.filter(a => a.status === 'completed').length;
    const cancelled = DUMMY_APPOINTMENTS.filter(a => a.status === 'cancelled').length;
    return { total, pending, completed, cancelled };
  }, []);

  const filtered = useMemo(() => {
    return DUMMY_APPOINTMENTS.filter(a => {
      if (status !== 'all' && a.status !== status) return false;
      if (search && !a.patientName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, status]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome{user ? `, ${user.username}` : ''}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Total Appointments</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="mt-1 text-2xl font-semibold text-amber-600">{stats.pending}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-600">{stats.completed}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="mt-1 text-2xl font-semibold text-rose-600">{stats.cancelled}</p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by patient name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-80 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusFilter)}
                className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">#{a.id}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{a.patientName}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{a.date}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{a.time}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span
                      className={
                        a.status === 'completed'
                          ? 'rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700'
                          : a.status === 'pending'
                          ? 'rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700'
                          : 'rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700'
                      }
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">No appointments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}


