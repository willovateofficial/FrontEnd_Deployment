import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../utils/crypto-utils";

const QrRedirect = () => {
  const navigate = useNavigate();
  const { data } = useParams<{ data: string }>();

  useEffect(() => {
    if (data) {
      try {
        const decodedPath = decodeURIComponent(data);
        const decrypted = decrypt(decodedPath); // e.g., "1/table-5"

        const [businessId, tablePart] = decrypted.split("/table-");
        if (!businessId || !tablePart) {
          throw new Error("Invalid decrypted QR format");
        }

        // ✅ Store businessId and tableNumber
        localStorage.setItem("businessId", businessId);
        localStorage.setItem("table_number", tablePart);

        // ✅ Set business name manually (or fetch from backend later)
        localStorage.setItem("business_name", "Shree Ram Restro");

        navigate("/restaurant");
      } catch (err) {
        alert("Invalid QR code or decryption failed.");
        console.error("Invalid QR or decryption failed", err);
      }
    }
  }, [data, navigate]);

  return <p style={{ textAlign: "center", marginTop: 50 }}>Redirecting...</p>;
};

export default QrRedirect;
