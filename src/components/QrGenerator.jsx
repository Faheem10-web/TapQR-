import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, QrCode, Image as ImageIcon } from 'lucide-react';

export default function QrGenerator({ profileUrl, profile }) {
  const canvasRef = useRef(null);
  const [fgColor, setFgColor] = useState('#1c1c1e');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoType, setLogoType] = useState('none'); // none, avatar, custom
  const [customLogo, setCustomLogo] = useState(null);
  const [qrSize, setQrSize] = useState(256);
  const [copied, setCopied] = useState(false);

  // Trigger QR generation whenever options change
  useEffect(() => {
    generateQr();
  }, [profileUrl, profile?.avatar, fgColor, bgColor, logoType, customLogo, qrSize]);

  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const generateQr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const qrOptions = {
      width: qrSize,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: 'H', // Use high error correction to allow center logo overlay
    };

    QRCode.toCanvas(canvas, profileUrl || 'https://tapqr.link/p/default', qrOptions, (error) => {
      if (error) {
        console.error('Failed to generate QR Code:', error);
        return;
      }

      // Draw center logo if selected
      const ctx = canvas.getContext('2d');
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      let logoUrl = null;
      if (logoType === 'avatar' && profile?.avatar) {
        logoUrl = profile.avatar;
      } else if (logoType === 'custom' && customLogo) {
        logoUrl = customLogo;
      }

      if (logoUrl) {
        const logoSize = canvas.width * 0.22; // 22% of QR width
        const rx = cx - logoSize / 2;
        const ry = cy - logoSize / 2;

        const img = new Image();
        // Allow cross-origin image drawing (required for Unsplash urls to avoid tainted canvas error)
        img.crossOrigin = 'anonymous';
        img.src = logoUrl;
        img.onload = () => {
          ctx.save();
          
          // Draw white card badge in center
          ctx.fillStyle = bgColor;
          drawRoundedRect(ctx, rx - 3, ry - 3, logoSize + 6, logoSize + 6, 12);
          ctx.fill();
          
          // Draw soft border around center card
          ctx.lineWidth = 2;
          ctx.strokeStyle = profile?.theme?.primaryColor || '#a855f7';
          ctx.stroke();

          // Clip and draw image
          ctx.beginPath();
          drawRoundedRect(ctx, rx, ry, logoSize, logoSize, 9);
          ctx.clip();
          ctx.drawImage(img, rx, ry, logoSize, logoSize);
          
          ctx.restore();
        };
      }
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomLogo(reader.result);
        setLogoType('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQrCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${profile?.name?.replace(/\s+/g, '_') || 'tapqr'}_qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start w-full text-neutral-800">
      {/* QR Canvas Render */}
      <div className="flex flex-col items-center gap-4 shrink-0">
        <div className="p-3 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-neutral-100 inline-block">
          <canvas ref={canvasRef} className="rounded-lg max-w-full" style={{ width: '200px', height: '200px' }} />
        </div>
        
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider text-center">
          High error correction (Level H)
        </p>

        <div className="flex w-full gap-2 mt-1">
          <button
            onClick={downloadQrCode}
            aria-label="Download QR Code image"
            className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 duration-100 cursor-pointer shadow-md shadow-purple-500/10"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
          
          <button
            onClick={copyProfileLink}
            aria-label="Copy Profile Link URL"
            className="py-2.5 px-4 bg-neutral-100 hover:bg-neutral-250 active:scale-95 text-neutral-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 duration-100 cursor-pointer shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Customize Panel */}
      <div className="flex-1 w-full space-y-4">
        
        {/* Colors Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1.5">Dark Pattern Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-8 h-8 rounded-lg border-none cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-neutral-600 uppercase font-semibold">{fgColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1.5">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded-lg border-none cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-neutral-600 uppercase font-semibold">{bgColor}</span>
            </div>
          </div>
        </div>

        {/* Center Logo Option */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Center Logo Brand</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setLogoType('none')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                logoType === 'none'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/10'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 shadow-sm'
              }`}
            >
              None
            </button>
            
            <button
              onClick={() => setLogoType('avatar')}
              disabled={!profile?.avatar}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                logoType === 'avatar'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/10'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 shadow-sm'
              }`}
            >
              Profile Avatar
            </button>

            <label
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                logoType === 'custom'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/10'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 shadow-sm'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <ImageIcon className="w-3.5 h-3.5" /> Upload Logo
            </label>
          </div>
        </div>

        {/* Dynamic Warning Alert */}
        {(logoType === 'avatar' && !profile?.avatar) && (
          <p className="text-[10px] text-amber-600 font-bold">
            Please set a profile avatar under details to enable it on the QR code.
          </p>
        )}

        {/* QR Resolution / Size Option */}
        <div className="pt-2">
          <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1.5">Download Resolution</label>
          <select
            value={qrSize}
            onChange={(e) => setQrSize(Number(e.target.value))}
            className="w-full glass-input rounded-xl px-3 py-2.5 text-xs focus:outline-none"
          >
            <option value={128}>128 x 128 px (Web-optimized)</option>
            <option value={256}>256 x 256 px (Standard)</option>
            <option value={512}>512 x 512 px (High-Res)</option>
            <option value={1024}>1024 x 1024 px (Print-ready)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
