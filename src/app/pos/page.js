"use client";
import { useEffect, useState } from "react";



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function BackButton() {
  return (
    <Button variant="outline" className="mb-4" onClick={() => window.location.href = "/"}>
      ← Back
    </Button>
  );
}

import { useRef } from "react";

export default function POSPage() {
  const [tab, setTab] = useState("stock");
  const [lastReceipt, setLastReceipt] = useState(null);
  const receiptRef = useRef();
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { theme, setTheme } = useTheme();

  // Set body background to gray-700
  useEffect(() => {
    document.body.classList.add("bg-gray-700");
    return () => document.body.classList.remove("bg-gray-700");
  }, []);

  // Fetch inventory from DummyJSON API and Firestore, merge results
  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      try {
        // Fetch DummyJSON
        const res = await fetch("https://dummyjson.com/products?limit=100");
        const data = await res.json();
        const apiItems = (data.products || []).map(p => ({
          id: "api-" + p.id,
          name: p.title,
          quantity: p.stock,
          price: p.price,
          source: "api"
        }));
        // Fetch Firestore
        const { getDocs, collection } = await import("firebase/firestore");
        const querySnapshot = await getDocs(collection(db, "inventory"));
        const dbItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), source: "db" }));
        setItems([...apiItems, ...dbItems]);
      } catch (e) {
        setMessage("Failed to load inventory.");
      }
      setLoading(false);
    }
    fetchInventory();
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((c) => c.id === item.id);
      if (found) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  // Real POS logic: deduct stock, clear cart, show receipt, save to Firestore
  const checkout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    setItems((prev) => prev.map(item => {
      const cartItem = cart.find(c => c.id === item.id);
      if (cartItem) {
        return { ...item, quantity: item.quantity - cartItem.qty };
      }
      return item;
    }));
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    try {
      await addDoc(collection(db, "sales"), {
        items: cart,
        total,
        createdAt: Timestamp.now(),
      });
      setMessage(`Sale completed! Total: $${total}`);
      setLastReceipt({
        items: cart,
        total,
        date: new Date().toLocaleString(),
      });
      setCart([]);
    } catch (e) {
      setMessage("Failed to save sale.");
      setLastReceipt(null);
    }
    setCheckoutLoading(false);
  };

  // Remove dummy loader for real POS

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-6xl">
        <BackButton />
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white drop-shadow">Point of Sale</h1>
          <div className="flex gap-2">
            <Button
              variant={tab === "stock" ? "default" : "outline"}
              onClick={() => setTab("stock")}
            >Stock</Button>
            <Button
              variant={tab === "sales" ? "default" : "outline"}
              onClick={() => setTab("sales")}
            >Sales</Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-2"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        <div className="flex flex-row gap-8 items-start">
          {tab === "stock" && (
            <Card className="mb-6 bg-white/80 dark:bg-gray-900/80 shadow-xl backdrop-blur border border-white/30 w-1/2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="mb-4 w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-800 dark:text-white"
                />
                {loading ? (
                  <div className="text-center py-4 text-gray-500">Loading inventory...</div>
                ) : (
                  <div style={{ maxHeight: 350, overflowY: 'auto' }} className="rounded border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="py-2">Name</th>
                          <th className="py-2">Qty</th>
                          <th className="py-2">Price</th>
                          <th className="py-2">Add</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.filter(item => item.name.toLowerCase().includes(search.toLowerCase())).map((item) => (
                          <tr key={item.id} className="text-center border-t border-gray-200 dark:border-gray-700">
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>${item.price}</td>
                            <td>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => addToCart(item)}
                              >
                                Add
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          {tab === "sales" && (
            <Card className="mb-6 bg-white/80 dark:bg-gray-900/80 shadow-xl backdrop-blur border border-white/30 w-1/2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Sales Report</CardTitle>
              </CardHeader>
              <CardContent>
                <a href="/sales" className="text-blue-600 underline">View Full Sales Report</a>
              </CardContent>
            </Card>
          )}
          <Card className="mb-6 bg-white/80 dark:bg-gray-900/80 shadow-xl backdrop-blur border border-white/30 w-1/2 ml-auto">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Cart</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="py-2">Name</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2">Price</th>
                    <th className="py-2">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id} className="text-center border-t border-gray-200 dark:border-gray-700">
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>${item.price * item.qty}</td>
                      <td>
                        <Button
                          variant="ghost"
                          className="p-0 text-red-700"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4">
                <strong className="text-lg text-gray-800 dark:text-gray-100">
                  Total: ${cart.reduce((sum, item) => sum + item.price * item.qty, 0)}
                </strong>
                <Button
                  variant="default"
                  className="px-6 cursor-pointer"
                  onClick={checkout}
                  disabled={cart.length === 0 || checkoutLoading}
                >
                  {checkoutLoading ? "Processing..." : "Checkout"}
                </Button>
              </div>
              {message && (
                <div className="text-center text-green-700 dark:text-green-400 font-semibold mt-2">
                  {message}
                  {lastReceipt && (
                    <>
                      <div className="mt-4">
                        <Button onClick={() => {
                          // Print only the receipt
                          const printContents = receiptRef.current.innerHTML;
                          const printWindow = window.open('', '', 'height=600,width=400');
                          printWindow.document.write('<html><head><title>Receipt</title>');
                          printWindow.document.write('<style>body{font-family:sans-serif;padding:24px;} .receipt-title{font-size:1.5em;font-weight:bold;margin-bottom:12px;} .receipt-table{width:100%;margin-bottom:12px;} .receipt-table th, .receipt-table td{padding:4px 8px;text-align:left;} .receipt-total{font-size:1.2em;font-weight:bold;}</style>');
                          printWindow.document.write('</head><body>');
                          printWindow.document.write(printContents);
                          printWindow.document.write('</body></html>');
                          printWindow.document.close();
                          printWindow.focus();
                          printWindow.print();
                        }}>
                          Print Receipt
                        </Button>
                      </div>
                      <div ref={receiptRef} style={{ display: 'none' }}>
                        <div className="receipt-title">Quickstock POS Receipt</div>
                        <div>Date: {lastReceipt.date}</div>
                        <table className="receipt-table">
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th>Qty</th>
                              <th>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lastReceipt.items.map((item, idx) => (
                              <tr key={idx}>
                                <td>{item.name}</td>
                                <td>{item.qty}</td>
                                <td>${item.price * item.qty}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="receipt-total">Total: ${lastReceipt.total}</div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
