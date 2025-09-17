"use client";

import { useEffect, useState } from "react";


import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

function BackButton() {
  return (
    <Button variant="outline" className="mb-4" onClick={() => window.location.href = "/"}>
      ← Back
    </Button>
  );
}

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: 0, price: 0 });
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);

  // Load from DummyJSON API and Firestore
  const fetchFromApiAndFirestore = async () => {
    setApiLoading(true);
    setLoading(true);
    // Fetch API
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
    const querySnapshot = await getDocs(collection(db, "inventory"));
    const dbItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), source: "db" }));
    setItems([...apiItems, ...dbItems]);
    setLoading(false);
    setApiLoading(false);
  };

  useEffect(() => {
    fetchFromApiAndFirestore();
  }, []);

  // Add to Firestore
  const addItem = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "inventory"), form);
    setForm({ name: "", quantity: 0, price: 0 });
    await fetchFromApiAndFirestore();
  };

  // Remove from Firestore
  const removeItem = async (id) => {
    await deleteDoc(doc(db, "inventory", id));
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white/80 rounded-lg shadow-lg">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      <Button onClick={fetchFromApiAndFirestore} disabled={apiLoading} className="mb-4">
        {apiLoading ? "Loading..." : "Reload"}
      </Button>
      <form onSubmit={addItem} className="mb-6 flex flex-col gap-2">
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded px-2 py-1"
        />
        <input
          required
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
          className="border rounded px-2 py-1"
        />
        <input
          required
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          className="border rounded px-2 py-1"
        />
        <Button type="submit">Add Item</Button>
      </form>
      {loading ? (
        <div className="text-center py-4">Loading inventory...</div>
      ) : (
        <Table className="w-full mb-4">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => removeItem(item.id)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
