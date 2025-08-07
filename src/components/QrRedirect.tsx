import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../utils/crypto-utils";
import axios from "axios";
import { frontEndbaseUrl, baseUrl } from "../config"; // Adjust the import path as

const baseURL = "https://front-end-deployment-testing.vercel.app";

const QrRedirect = () => {
  const navigate = useNavigate();
  const { data } = useParams<{ data: string }>();

  useEffect(() => {
    const fetchBusinessInfo = async (businessId: string) => {
      try {
        const res = await axios.get(
          `${baseURL}/api/auth/business/${businessId}`
        );
        const business = res.data;

        if (business?.name) {
          localStorage.setItem("business_name", business.name);
        }
        if (business?.logoUrl) {
          localStorage.setItem("business_logo", business.logoUrl);
        }
      } catch (err) {
        console.error("Failed to fetch business info", err);
      } finally {
        // ✅ Navigate regardless of success/failure
        navigate("/restaurant");
      }
    };

    if (data) {
      try {
        const decodedPath = decodeURIComponent(data);
        const decrypted = decrypt(decodedPath); // e.g., "1/table-5"

        const [businessId, tablePart] = decrypted.split("/table-");
        if (!businessId || !tablePart) {
          throw new Error("Invalid QR format");
        }

        localStorage.setItem("businessId", businessId);
        localStorage.setItem("table_number", tablePart);

        // ✅ Fetch business info
        fetchBusinessInfo(businessId);
      } catch (err) {
        alert("Invalid QR code or decryption failed.");
        console.error("Invalid QR or decryption failed", err);
      }
    }
  }, [data, navigate]);

  return <p style={{ textAlign: "center", marginTop: 50 }}>Redirecting...</p>;
};

export default QrRedirect;
