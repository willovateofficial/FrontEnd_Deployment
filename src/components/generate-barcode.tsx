import React, { useState } from "react";
import { encrypt } from "../utils/crypto-utils";
import QRCode from "react-qr-code";
import bgImage from "../assets/restaurant-bg.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";
import { frontEndbaseUrl, baseUrl } from "../config";

const GenerateBarcodePage: React.FC = () => {
  const [tableNumber, setTableNumber] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied] = useState(false);

  const restaurantName = localStorage.getItem("business_name");

  const handleGenerate = () => {
    if (!tableNumber.trim()) {
      toast.error("Please enter a valid table number", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }

    setIsGenerating(true);
    setTimeout(async () => {
      try {
        const businessId = localStorage.getItem("businessId");
        if (!businessId) throw new Error("Missing business ID");

        // 1. Call backend to upsert table
        const res = await fetch(`${baseUrl}/api/tables`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessId: Number(businessId),
            tableNumber: Number(tableNumber),
          }),
        });

        if (!res.ok) throw new Error("Failed to save table");

        // 2. Generate encrypted URL
        const rawPath = `${businessId}/table-${tableNumber}`;
        const encryptedPath = encrypt(rawPath);
        if (!encryptedPath) throw new Error("Encryption failed");

        const url = `${frontEndbaseUrl}/r/${encodeURIComponent(encryptedPath)}`;
        setQrUrl(url);
        toast.success("QR Code generated successfully!", {
          position: "top-center",
        });
      } catch (error) {
        console.error("QR Generation Error:", error);
        toast.error("Failed to generate QR code", { position: "top-center" });
      } finally {
        setIsGenerating(false);
      }
    }, 300);
  };

  const handlePrint = () => {
    const svg = document.getElementById("generated-qr")?.outerHTML;
    if (!svg) return;

    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background: white;
            }
            svg {
              width: 300px;
              height: 300px;
            }
          </style>
        </head>
        <body>
          ${svg}
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                window.onafterprint = () => window.close();
              }, 200);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <>
      {isGenerating && <Loader />}
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 -mb-10 -mt-4"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-orange-500 p-4">
            <h2 className="text-2xl font-bold text-white text-center">
              Generate Table QR Code
            </h2>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label
                htmlFor="tableNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Table Number
              </label>
              <input
                id="tableNumber"
                type="text"
                placeholder="e.g. 1,2,3 etc."
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                onKeyPress={(e) =>
                  e.key === "Enter" && tableNumber.trim() && handleGenerate()
                }
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!tableNumber.trim() || isGenerating}
              className={`w-full py-3 text-white font-medium rounded-lg transition-all ${
                tableNumber.trim() && !isGenerating
                  ? "bg-orange-500 hover:bg-orange-600 shadow-md hover:shadow-lg"
                  : "bg-gray-300 cursor-not-allowed"
              } flex items-center justify-center`}
            >
              {isGenerating ? "Generating..." : "Generate QR Code"}
            </button>

            {qrUrl && (
              <div className="mt-6 space-y-4">
                <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
                  <QRCode
                    id="generated-qr"
                    value={qrUrl}
                    size={220}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                  <p className="text-xs text-gray-500 mt-4">
                    Scan this QR code to access the table
                  </p>
                </div>

                <div className="relative">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    QR Code URL
                  </div>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={qrUrl}
                      readOnly
                      placeholder="QR Code URL"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-xs truncate"
                    />
                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-lg transition-colors"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePrint}
                  className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all"
                >
                  Print QR Code
                </button>
              </div>
            )}
          </div>

          <div className="px-4 pb-6 text-center text-xs text-gray-500">
            Note: This QR code will direct customers to your table ordering
            page.
          </div>
        </div>

        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="rounded-lg shadow-lg bg-white text-gray-800"
        />
      </div>
    </>
  );
};

export default GenerateBarcodePage;
