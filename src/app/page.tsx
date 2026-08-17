'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ChatWidget from '@/components/ChatWidget';
import { Package, Shield, Truck } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  type: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-ocean-600">AQUA DIVE CO</h1>
          <div className="flex gap-4">
            <Link href="/dashboard" className="btn btn-secondary">Dashboard</Link>
            <button className="btn btn-primary">Cart (0)</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-ocean-50 to-slate-50 py-16">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4">Premium Scuba Diving Equipment</h2>
          <p className="text-xl text-slate-600 mb-8">Professional gear for adventurers</p>
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-3 border border-slate-300 rounded-lg w-full max-w-md"
          />
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container grid grid-cols-3 gap-8">
          <div className="text-center">
            <Package className="w-8 h-8 mx-auto mb-3 text-ocean-600" />
            <h3 className="font-bold mb-2">Quality Products</h3>
            <p className="text-sm text-slate-600">Carefully selected equipment</p>
          </div>
          <div className="text-center">
            <Truck className="w-8 h-8 mx-auto mb-3 text-ocean-600" />
            <h3 className="font-bold mb-2">Fast Shipping</h3>
            <p className="text-sm text-slate-600">2-day domestic delivery</p>
          </div>
          <div className="text-center">
            <Shield className="w-8 h-8 mx-auto mb-3 text-ocean-600" />
            <h3 className="font-bold mb-2">Guaranteed</h3>
            <p className="text-sm text-slate-600">30-day money-back</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
          {loading ? (
            <p className="text-center text-slate-500">Loading products...</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {products.map(product => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <div className="card cursor-pointer">
                    <div className="bg-slate-200 h-40 rounded mb-4 flex items-center justify-center text-slate-400">
                      Product Image
                    </div>
                    <h3 className="font-bold mb-2">{product.title}</h3>
                    <p className="text-sm text-slate-600 mb-3">{product.type}</p>
                    <p className="text-lg font-bold text-ocean-600">${product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
