import React, { useRef } from "react";
import RestaurantBill from "./RestaurantBill";

export default function BillPrintExample() {
  const billRef = useRef<HTMLDivElement>(null);

  const order = {
    restaurantName: "The Food Hub",
    address: "123 Flavor Street, Food City",
    phone: "+91-9876543210",
    billNo: 12345,
    date: new Date().toLocaleString(),
    tableNo: 7,
    server: "Rajesh",
    items: [
      { name: "Paneer Butter Masala", qty: 2, price: 150 },
      { name: "Garlic Naan", qty: 3, price: 40 },
    ],
    subtotal: 420,
    tax: 21,
    serviceCharge: 20,
    discount: 0,
    total: 461,
    paymentMethod: "Card",
    footerNote: "Visit again! Have a nice day!",
  };

  const printBill = () => {
    if (!billRef.current) return;
    const printWindow = window.open("", "PRINT", "width=350,height=600");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill</title>
          <style>
            body { font-family: monospace; font-size: 12px; width: 80mm; margin: 0 auto; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 4px; border-bottom: 1px dashed #000; }
            th { text-align: left; }
            td.right, th.right { text-align: right; }
          </style>
        </head>
        <body>${billRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <>
      <RestaurantBill ref={billRef} {...order} />
      <button
        onClick={printBill}
        className="mt-4 px-4 py-2 bg-yellow-500 rounded text-white font-bold"
      >
        Print Bill
      </button>
    </>
  );
}
