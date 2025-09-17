"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function Home() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

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
    <div
      className={`font-sans min-h-screen w-screen h-screen flex flex-col items-center justify-center transition-colors ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-800 to-gray-900"
          : "bg-gradient-to-br from-white to-blue-100"
      }`}
    >
      <div className="backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 border border-white/40 dark:border-gray-700 shadow-2xl rounded-2xl p-10 w-full h-full flex flex-col items-center gap-8 mt-10 mb-10 transition-colors">
        <h1 className="text-4xl font-extrabold mb-2 text-gray-800 dark:text-gray-100 drop-shadow-lg text-center">
          Quickstock POS & Inventory System
        </h1>
        <nav className="flex gap-8 mb-4">
          <a
            href="/inventory"
            className="px-6 py-2 rounded-lg bg-white/80 dark:bg-gray-900/80 shadow hover:bg-blue-50 dark:hover:bg-gray-700 border border-blue-100 dark:border-gray-700 text-blue-700 dark:text-blue-200 font-semibold transition-all"
          >
            Inventory
          </a>
          <a
            href="/pos"
            className="px-6 py-2 rounded-lg bg-white/80 dark:bg-gray-900/80 shadow hover:bg-blue-50 dark:hover:bg-gray-700 border border-blue-100 dark:border-gray-700 text-blue-700 dark:text-blue-200 font-semibold transition-all"
          >
            POS
          </a>
        </nav>
        <section className="w-full h-full flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Stocks
          </h2>
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Loading stocks...
            </div>
          ) : (
            <div
              className="overflow-x-auto overflow-y-auto rounded-xl shadow flex-1"
              style={{ maxHeight: "60vh" }}
            >
              <table className="w-full bg-white/80 dark:bg-gray-900/80 rounded-xl overflow-hidden transition-colors">
                <thead className="bg-blue-50 dark:bg-gray-800">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-200">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-200">
                      Stock
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-200">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-blue-100 dark:border-gray-700 hover:bg-blue-50/60 dark:hover:bg-gray-800/60 transition"
                    >
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
