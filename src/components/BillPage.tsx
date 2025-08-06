import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { baseUrl } from "../config";
import html2canvas from "html2canvas";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

interface Item {
  productId: number;
  quantity: number;
  price: number;
  status?: string;
  name?: string;
}

interface ExtraPercent {
  vatLow: number;
  vatHigh: number;
  serviceTax: number;
  serviceCharge: number;
}

interface Business {
  name: string;
  themeColor: string;
  tagline: string;
}

const baseURL = baseUrl;
const API_URL = `${baseURL}/api/business`;
const LOCAL_STORAGE_KEY = "extra_percent";

const BillPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  const [percent, setPercent] = useState<ExtraPercent>({
    vatLow: 0,
    vatHigh: 0,
    serviceTax: 0,
    serviceCharge: 0,
  });

  const [business, setBusiness] = useState<Business | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [cloudinaryLink, setCloudinaryLink] = useState("");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setPercent(JSON.parse(saved));
      setShowSettings(false);
    } else {
      setShowSettings(true);
    }

    const fetchBusiness = async () => {
      const id = localStorage.getItem("businessId");
      if (id) {
        try {
          const res = await axios.get(`${API_URL}/${id}`);
          setBusiness(res.data);
        } catch (error) {
          console.error("Error fetching business:", error);
        }
      }
    };

    fetchBusiness();
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(percent));
    toast.success("Settings saved!", {
      autoClose: 2000,
    });
    setShowSettings(false);
  };

  if (!order) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        No order data available. Please go back.
        <br />
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleStoreBill = async () => {
    setShowStoreModal(false);

    try {
      const receiptElement = document.getElementById("receipt");

      if (!receiptElement) {
        toast.error("Receipt element not found.");
        return;
      }

      // Convert HTML to canvas
      const canvas = await html2canvas(receiptElement);

      // Convert canvas to Blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error("Failed to generate image.");
          return;
        }

        // Upload to Cloudinary
        const file = new File([blob], "receipt.png", { type: "image/png" });
        const uploadResult = await uploadToCloudinary(file);

        if (uploadResult) {
          const { url, publicId } = uploadResult;
          toast.success("Uploaded to Cloudinary! 🎉");
          console.log("Image URL:", url);
          console.log("Public ID:", publicId);

          const orderId =
            typeof order.order_id === "string"
              ? parseInt(order.order_id.replace("ORD", ""), 10)
              : undefined;

          if (!orderId || typeof orderId !== "number") {
            console.error("❌ Invalid orderId:", order.order_id);
            toast.error("Invalid Order ID. Cannot store bill.");
            return;
          }

          // Store the bill info in the database
          await axios.put(
            `${baseUrl}/api/bill/${orderId}/store-link`,
            {
              billStoreLink: url,
              cloudinaryPublicId: publicId,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setShowWhatsAppModal(true); // Open the modal
          setCloudinaryLink(url); // set the link for WhatsApp modal

          toast.success("Bill stored successfully!");
          // After this, you can optionally show WhatsApp input modal here
        } else {
          toast.error("Upload failed");
        }
      });
    } catch (error) {
      console.error("Error in handleStoreBill:", error);
      toast.error("Something went wrong!");
    }
  };

  const calculateAmount = (percent: number) =>
    (order.total_amount * percent) / 100;

  const totalWithCharges =
    order.total_amount +
    calculateAmount(percent.vatLow) +
    calculateAmount(percent.vatHigh) +
    calculateAmount(percent.serviceTax) +
    calculateAmount(percent.serviceCharge);

  const handleChange = (field: keyof ExtraPercent, value: number) => {
    setPercent((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: "flex",
      justifyContent: "center",
      gap: "30px",
      marginTop: "20px",
      flexWrap: "wrap",
    },
    receipt: {
      fontFamily: "'Courier New', monospace",
      width: "320px",
      padding: "16px",
      backgroundColor: "white",
      color: "black",
      border: "1px dashed #000",
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
    },
    settings: {
      width: "300px",
      padding: "16px",
      border: "1px solid #ccc",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      fontFamily: "'Courier New', monospace",
    },
    input: {
      width: "100%",
      padding: "8px",
      margin: "8px 0",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },
    centerText: {
      textAlign: "center",
      margin: "4px 0",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "14px",
      marginTop: "10px",
    },
    thtd: {
      padding: "4px 0",
      borderBottom: "1px dotted #000",
    },
    total: {
      textAlign: "right",
      fontWeight: "bold",
    },
    printSettingsContainer: {
      width: "320px",
      margin: "20px auto 0",
      textAlign: "center",
    },
    button: {
      padding: "8px 16px",
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginRight: "10px",
      marginBottom: "10px",
    },
  };

  return (
    <>
      <div style={styles.container}>
        {/* Receipt */}
        <div style={styles.receipt} id="receipt">
          <h2 style={styles.centerText}>
            🍽️ {business?.name || "Saoji Dhaba & Family Restaurant"}
          </h2>
          <h3 style={styles.centerText}>-- Bill Summary --</h3>
          <p style={styles.centerText}>Order ID: {order.order_id}</p>
          <p style={styles.centerText}>
            Date: {new Date(order.created_at).toLocaleDateString()}
            <br />
            Time: {new Date(order.created_at).toLocaleTimeString()}
          </p>
          <p style={styles.centerText}>
            Table: {order.table_number} | Payment: {order.payment_method}
          </p>
          <p style={styles.centerText}>Status: {order.status}</p>
          <hr />
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.thtd}>Item</th>
                <th style={styles.thtd}>Qty</th>
                <th style={styles.thtd}>₹</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: Item, idx: number) => (
                <tr key={idx}>
                  <td style={styles.thtd}>
                    {item.name || `Product #${item.productId}`}
                  </td>
                  <td style={{ ...styles.thtd, textAlign: "center" }}>
                    {item.quantity}
                  </td>
                  <td style={{ ...styles.thtd, textAlign: "right" }}>
                    {item.quantity * item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          <p style={styles.total}>Subtotal: ₹{order.total_amount.toFixed(2)}</p>
          <p style={styles.total}>
            VAT Low ({percent.vatLow}%): ₹
            {calculateAmount(percent.vatLow).toFixed(2)}
          </p>
          <p style={styles.total}>
            VAT High ({percent.vatHigh}%): ₹
            {calculateAmount(percent.vatHigh).toFixed(2)}
          </p>
          <p style={styles.total}>
            Service Tax ({percent.serviceTax}%): ₹
            {calculateAmount(percent.serviceTax).toFixed(2)}
          </p>
          <p style={styles.total}>
            Service Charge ({percent.serviceCharge}%): ₹
            {calculateAmount(percent.serviceCharge).toFixed(2)}
          </p>
          <hr />
          <p style={styles.total}>
            Grand Total: ₹{totalWithCharges.toFixed(2)}
          </p>
          <hr />
          <p style={styles.centerText}>Thank You! Visit Again 🙏</p>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div style={styles.settings} className="no-print">
            <h3 style={styles.centerText}>Extra Charges (%)</h3>
            {["vatLow", "vatHigh", "serviceTax", "serviceCharge"].map(
              (field) => (
                <div key={field}>
                  <label>{field.replace(/([A-Z])/g, " $1")}</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={percent[field as keyof ExtraPercent]}
                    onChange={(e) =>
                      handleChange(
                        field as keyof ExtraPercent,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder={`Enter ${field.replace(
                      /([A-Z])/g,
                      " $1"
                    )} (%)`}
                    title={`Enter ${field.replace(
                      /([A-Z])/g,
                      " $1"
                    )} percentage`}
                  />
                </div>
              )
            )}
            <button
              style={{ ...styles.button, backgroundColor: "orange" }}
              onClick={handleSaveSettings}
            >
              Set
            </button>
          </div>
        )}
      </div>

      {/* Print / Settings buttons */}
      <div style={styles.printSettingsContainer} className="no-print">
        {localStorage.getItem("plan") === "standard" && (
          <button
            onClick={() => setShowStoreModal(true)}
            style={{ ...styles.button, backgroundColor: "#007bff" }}
          >
            Send Bill on WhatsApp
          </button>
        )}
        <button
          onClick={handlePrint}
          style={{ ...styles.button, backgroundColor: "orange" }}
        >
          Print
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{ ...styles.button, backgroundColor: "orange" }}
        >
          Settings
        </button>
      </div>

      {/* Toast container for notifications */}
      <ToastContainer position="top-center" autoClose={3000} />

      {/* PRINT ONLY CSS */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #receipt, #receipt * {
              visibility: visible;
            }
            #receipt {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>
      {showStoreModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setShowStoreModal(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-md w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Do you want to store this bill on cloud?</h2>
            <p className="mb-4">You can store the bill on cloud and then send it via WhatsApp to your customer.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowStoreModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleStoreBill}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Store Bill
              </button>
            </div>
          </div>
        </div>
      )}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80">
            <h2 className="text-xl font-semibold mb-4">Send Bill via WhatsApp</h2>
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowWhatsAppModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => {
                  const message = `Here is your bill: ${cloudinaryLink}`; // replace with actual Cloudinary URL
                  const encodedMsg = encodeURIComponent(message);
                  const formattedNumber = mobileNumber.replace(/\D/g, ""); // clean non-digits
                  window.open(`https://wa.me/91${formattedNumber}?text=${encodedMsg}`, "_blank");
                  setShowWhatsAppModal(false);
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BillPage;
