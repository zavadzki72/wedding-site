import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string | null;
  familyName: string | null;
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose, url, familyName }) => {
  if (!isOpen || !url) return null;

  const handleDownload = () => {
    const svg = document.getElementById('QRCode');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `QRCode_${familyName?.replace(/\s+/g, '_')}.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <h2>QR Code para: {familyName}</h2>
        <div style={{ margin: '2rem 0', backgroundColor: 'white', padding: '1rem', display: 'inline-block' }}>
          <QRCodeSVG
            id="QRCode"
            value={url}
            size={256}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            includeMargin={true}
          />
        </div>
        <p style={{ color: '#666', marginBottom: '2rem', wordBreak: 'break-all' }}>{url}</p>
        <div className="modal-actions">
          <button type="button" className="button" onClick={onClose}>Fechar</button>
          <button type="button" className="button primary" onClick={handleDownload}>
            <i className="fas fa-download"></i> Baixar PNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrCodeModal;