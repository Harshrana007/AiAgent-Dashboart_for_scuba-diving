'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Metrics {
  totalConversations: number;
  conversationsToday: number;
  resolutionRate: number;
  escalationRate: number;
  lowConfidenceRate: number;
  topQuestions: any[];
  topProducts: any[];
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/analytics/overview');
        const data = await res.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-ocean-600">AI Dashboard</h1>
          <Link href="/" className="btn btn-secondary">Back to Store</Link>
        </div>
      </nav>

      {/* Metrics */}
      <section className="py-8">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6">AI Agent Overview</h2>
          {loading ? (
            <p className="text-slate-500">Loading analytics...</p>
          ) : metrics ? (
            <>
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="card">
                  <p className="text-sm text-slate-600 mb-1">Total Conversations</p>
                  <p className="text-3xl font-bold text-ocean-600">{metrics.totalConversations}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-slate-600 mb-1">Today</p>
                  <p className="text-3xl font-bold text-ocean-600">{metrics.conversationsToday}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-slate-600 mb-1">Resolution Rate</p>
                  <p className="text-3xl font-bold text-green-600">{metrics.resolutionRate}%</p>
                </div>
                <div className="card">
                  <p className="text-sm text-slate-600 mb-1">Escalations</p>
                  <p className="text-3xl font-bold text-red-600">{metrics.escalationRate}%</p>
                </div>
              </div>

              {/* Top Questions */}
              <div className="grid grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-bold mb-4">Top Questions</h3>
                  <div className="space-y-2">
                    {metrics.topQuestions?.slice(0, 5).map((q, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-600">{q.question?.substring(0, 30)}...</span>
                        <span className="font-bold text-ocean-600">{q.volume}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-bold mb-4">Confidence Distribution</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>High Confidence</span>
                      <span className="font-bold text-green-600">65%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Medium Confidence</span>
                      <span className="font-bold text-yellow-600">25%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Low Confidence</span>
                      <span className="font-bold text-red-600">{metrics.lowConfidenceRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-slate-500">Failed to load analytics</p>
          )}
        </div>
      </section>
    </div>
  );
}
