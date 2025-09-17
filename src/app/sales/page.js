"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function BackButton() {
  return (
    <Button variant="outline" className="mb-4" onClick={() => window.location.href = "/"}>
      ← Back
    </Button>
  );
}


export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    async function fetchSales() {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "sales"));
      setSales(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }
    fetchSales();
  }, []);

  const totalEarned = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white/80 rounded-lg shadow-lg">
      <Button variant="outline" className="mb-4" onClick={() => window.location.href = "/pos"}>
        ← Back
      </Button>
      <h1 className="text-2xl font-bold mb-4">Sales Report</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => {
          const printContents = printRef.current.innerHTML;
          const printWindow = window.open('', '', 'height=700,width=900');
          printWindow.document.write('<html><head><title>Sales Report</title>');
          printWindow.document.write('<style>body{font-family:sans-serif;padding:24px;} .sales-title{font-size:1.5em;font-weight:bold;margin-bottom:12px;} .sales-table{width:100%;margin-bottom:12px;} .sales-table th, .sales-table td{padding:4px 8px;text-align:left;} .sales-total{font-size:1.2em;font-weight:bold;}</style>');
          printWindow.document.write('</head><body>');
          printWindow.document.write(printContents);
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
        }}
      >
        Print PDF
      </button>
      <div ref={printRef}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">${totalEarned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading sales...</div>
            ) : (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm sales-table">
                  <thead className="bg-gray-100">
                    <tr>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale.id}>
                        <td>{sale.createdAt ? new Date(sale.createdAt.seconds * 1000).toLocaleString() : "-"}</td>
                        <td>
                          {sale.items && sale.items.map((item, idx) => (
                            <div key={idx}>{item.name} x{item.qty}</div>
                          ))}
                        </td>
                        <td>${sale.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
