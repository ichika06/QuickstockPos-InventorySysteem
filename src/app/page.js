"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using DummyJSON's free products API as sample stocks
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setStocks(data.products || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="font-sans min-h-screen w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-100">
      <div className="backdrop-blur-lg bg-white/70 border border-white/40 shadow-2xl rounded-2xl p-10 w-full h-full flex flex-col items-center gap-8 mt-10 mb-10">
        <h1 className="text-4xl font-extrabold mb-2 text-gray-800 drop-shadow-lg text-center">Quickstock POS & Inventory System</h1>
        <nav className="flex gap-8 mb-4">
          <a href="/inventory" className="px-6 py-2 rounded-lg bg-white/80 shadow hover:bg-blue-50 border border-blue-100 text-blue-700 font-semibold transition-all">Inventory</a>
          <a href="/pos" className="px-6 py-2 rounded-lg bg-white/80 shadow hover:bg-blue-50 border border-blue-100 text-blue-700 font-semibold transition-all">POS</a>
        </nav>
  <section className="w-full h-full flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Stocks</h2>
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading stocks...</div>
          ) : (
            <div className="overflow-x-auto overflow-y-auto rounded-xl shadow flex-1" style={{ maxHeight: '60vh' }}>
              <table className="w-full bg-white/80 rounded-xl overflow-hidden">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Name</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Stock</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((item) => (
                    <tr key={item.id} className="border-t border-blue-100 hover:bg-blue-50/60 transition">
                      <td className="py-2 px-4">{item.title}</td>
                      <td className="py-2 px-4">{item.stock}</td>
                      <td className="py-2 px-4">${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
