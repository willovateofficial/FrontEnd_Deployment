// components/QRCodeGenerator.tsx
import React from "react";
import QRCode from "react-qr-code";

interface QRCodeGeneratorProps {
  value: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ value }) => {
  return (
    <div style={{ background: "white", padding: "16px", borderRadius: "8px" }}>
      <QRCode value={value} size={256} />
    </div>
  );
};

export default QRCodeGenerator;
