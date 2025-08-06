import React, { forwardRef } from "react";

interface BillItem {
  name: string;
  qty: number;
  price: number;
}

interface BillProps {
  restaurantName: string;
  address: string;
  phone?: string;
  billNo: string | number;
  date: string; // formatted date/time string
  tableNo?: string | number;
  server?: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  serviceCharge?: number;
  discount?: number;
  total: number;
  paymentMethod: string;
  footerNote?: string;
}

const RestaurantBill = forwardRef<HTMLDivElement, BillProps>(
  (
    {
      restaurantName,
      address,
      phone,
      billNo,
      date,
      tableNo,
      server,
      items,
      subtotal,
      tax,
      serviceCharge,
      discount,
      total,
      paymentMethod,
      footerNote,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="max-w-[300px] font-mono text-xs p-4"
        style={{ width: "80mm" }}
      >
        {/* Header */}
        <div className="text-center font-bold text-base mb-1">
          {restaurantName}
        </div>
        <div className="text-center mb-1">{address}</div>
        {phone && <div className="text-center mb-1">Phone: {phone}</div>}
        <hr className="border-dashed border-t border-gray-700 mb-2" />

        {/* Bill Info */}
        <div className="mb-2">
          <div className="flex justify-between">
            <span>Bill No:</span>
            <span>{billNo}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{date}</span>
          </div>
          {tableNo && (
            <div className="flex justify-between">
              <span>Table No:</span>
              <span>{tableNo}</span>
            </div>
          )}
          {server && (
            <div className="flex justify-between">
              <span>Server:</span>
              <span>{server}</span>
            </div>
          )}
        </div>
        <hr className="border-dashed border-t border-gray-700 mb-2" />

        {/* Items Table */}
        <table className="w-full mb-2 text-left">
          <thead>
            <tr>
              <th className="w-1/2">Item</th>
              <th className="w-1/6 text-center">Qty</th>
              <th className="w-1/6 text-right">Price</th>
              <th className="w-1/6 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-dashed border-gray-400">
                <td>{item.name}</td>
                <td className="text-center">{item.qty}</td>
                <td className="text-right">₹{item.price.toFixed(2)}</td>
                <td className="text-right">
                  ₹{(item.price * item.qty).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr className="border-dashed border-t border-gray-700 mb-2" />

        {/* Summary */}
        <div className="space-y-1 mb-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          {serviceCharge !== undefined && (
            <div className="flex justify-between">
              <span>Service Charge</span>
              <span>₹{serviceCharge.toFixed(2)}</span>
            </div>
          )}
          {discount !== undefined && (
            <div className="flex justify-between text-red-600">
              <span>Discount</span>
              <span>- ₹{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-1">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment & Footer */}
        <div className="mb-4">
          <div className="flex justify-between">
            <span>Payment Method</span>
            <span>{paymentMethod}</span>
          </div>
        </div>

        <div className="text-center text-xs">
          {footerNote || "Thank you for dining with us!"}
        </div>
      </div>
    );
  }
);

export default RestaurantBill;
