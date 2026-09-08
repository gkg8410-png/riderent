import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Copy, Check, ExternalLink, X, AlertTriangle, QrCode, Code, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { generateAndroidProjectZip } from '../../utils/androidProjectZip';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isZipping, setIsZipping] = useState(false);
  const [zipDownloaded, setZipDownloaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'apk' | 'explain'>('qr');

  const appUrl = typeof window !== 'undefined' 
    ? (window.location.origin.includes('localhost') 
        ? 'https://ais-pre-p2gglngqfbbv2mznviijcb-927155754150.asia-southeast1.run.app' 
        : window.location.origin)
    : 'https://ais-pre-p2gglngqfbbv2mznviijcb-927155754150.asia-southeast1.run.app';

  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(appUrl)}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(appUrl, {
        width: 240,
        margin: 1.5,
        color: {
          dark: '#1a1a1a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR generation failed:', err));
    }
  }, [isOpen, appUrl]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDirectInstall = async () => {
    if (isInstallable) {
      await install();
      onClose();
    }
  };

  const handleDownloadProjectZip = async () => {
    try {
      setIsZipping(true);
      const blob = await generateAndroidProjectZip(appUrl);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'RideRent-Android-Studio-Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setZipDownloaded(true);
      setTimeout(() => setZipDownloaded(false), 5000);
    } catch (err) {
      console.error('Failed to generate project zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/85 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#f4f1ea] border-2 border-[#1a1a1a] max-w-xl w-full p-6 space-y-4 shadow-[8px_8px_0px_#1a1a1a] animate-in fade-in zoom-in-95 my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-[#1a1a1a] pb-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ff5d22] block">
              Android Deployment & Installation Guide
            </span>
            <h2 className="text-xl font-serif font-bold text-[#1a1a1a]">Run RideRent on Android</h2>
            <p className="text-xs font-mono text-[#1a1a1a]/70">
              Zero parse errors: Choose 1-tap phone pairing or compile a native APK
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white hover:bg-[#ff5d22] hover:text-white flex items-center justify-center text-[#1a1a1a] border border-[#1a1a1a] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-2 border-[#1a1a1a] bg-white p-1 gap-1">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 font-mono text-xs font-bold uppercase transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'qr'
                ? 'bg-[#ff5d22] text-white'
                : 'text-[#1a1a1a] hover:bg-[#f4f1ea]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>1. Scan with Phone</span>
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 font-mono text-xs font-bold uppercase transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'apk'
                ? 'bg-[#ff5d22] text-white'
                : 'text-[#1a1a1a] hover:bg-[#f4f1ea]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>2. Build Official APK</span>
          </button>
          <button
            onClick={() => setActiveTab('explain')}
            className={`flex-1 py-2 font-mono text-xs font-bold uppercase transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'explain'
                ? 'bg-[#ff5d22] text-white'
                : 'text-[#1a1a1a] hover:bg-[#f4f1ea]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why Parse Error?</span>
          </button>
        </div>

        {/* TAB 1: Instant Phone Scan & WebAPK Installation */}
        {activeTab === 'qr' && (
          <div className="bg-white border-2 border-[#1a1a1a] p-4 shadow-[4px_4px_0px_#1a1a1a] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#ff5d22]">
                <Smartphone className="w-4 h-4" />
                <h3 className="font-serif font-bold text-sm text-[#1a1a1a]">Instant Android Phone Pairing</h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-[10px] font-bold uppercase">
                Zero Installation Errors
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#f4f1ea] p-4 border border-[#1a1a1a]">
              <div className="bg-white p-2 border-2 border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] shrink-0">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Scan to open on Android" className="w-36 h-36" />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center font-mono text-xs text-[#1a1a1a]/60">
                    Loading QR...
                  </div>
                )}
              </div>

              <div className="space-y-2 font-mono text-xs text-[#1a1a1a]">
                <p className="font-bold text-[#1a1a1a]">
                  Scan with your phone's camera or Google Lens:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-[#1a1a1a]/80 text-[11px]">
                  <li>Point your Android phone camera at this QR code.</li>
                  <li>Tap the link to open in <strong>Google Chrome</strong>.</li>
                  <li>Tap <strong>"Install app"</strong> or the <strong>⋮ (menu) &gt; "Add to Home screen"</strong>.</li>
                  <li>
                    Google Play Services installs the native <strong>WebAPK</strong> with high-res icon and full-screen support!
                  </li>
                </ol>
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <span className="text-[11px] text-[#1a1a1a]/60 block">Or copy the direct link on your phone:</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="flex-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] font-mono text-xs text-[#1a1a1a] truncate select-all"
                />
                <button
                  onClick={handleCopyUrl}
                  className="px-3.5 py-2 bg-white hover:bg-[#f4f1ea] text-[#1a1a1a] border border-[#1a1a1a] font-mono text-xs font-bold uppercase transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {isInstallable && (
              <button
                onClick={handleDirectInstall}
                className="w-full py-2.5 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white font-mono font-bold uppercase text-xs border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                Install on this Device Directly
              </button>
            )}
          </div>
        )}

        {/* TAB 2: Official Android Studio Project (.ZIP) or Cloud APK Compiler */}
        {activeTab === 'apk' && (
          <div className="bg-white border-2 border-[#1a1a1a] p-4 shadow-[4px_4px_0px_#1a1a1a] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#ff5d22]">
                <Code className="w-4 h-4" />
                <h3 className="font-serif font-bold text-sm text-[#1a1a1a]">Official APK Compilation</h3>
              </div>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-300 font-mono text-[10px] font-bold uppercase">
                Real Android SDK
              </span>
            </div>

            <p className="text-xs font-mono text-[#1a1a1a]/80 leading-relaxed">
              To obtain an authentic standalone <code>.apk</code> file that does not show parsing errors, the project must be compiled with the official Android SDK compiler (AAPT2 & D8):
            </p>

            {/* Option A: One-click Android Studio Project ZIP */}
            <div className="bg-[#f4f1ea] border border-[#1a1a1a] p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#1a1a1a] uppercase">
                  Option A: Download Android Studio Project
                </span>
                <span className="text-[10px] font-mono text-[#ff5d22] font-bold">1-Click Zip</span>
              </div>
              <p className="text-[11px] font-mono text-[#1a1a1a]/70">
                Contains complete Kotlin <code>MainActivity.kt</code>, WebView shell, full permissions (camera/GPS), and Gradle build script ready to compile into <code>app-debug.apk</code>.
              </p>
              <button
                onClick={handleDownloadProjectZip}
                disabled={isZipping}
                className="w-full py-2.5 bg-[#1a1a1a] hover:bg-[#ff5d22] text-white font-mono font-bold uppercase text-xs border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isZipping ? 'Packaging Project...' : 'Download RideRent Android Project (.ZIP)'}</span>
              </button>
              {zipDownloaded && (
                <p className="text-emerald-700 text-[10px] font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Downloaded! Open in Android Studio &gt; Build &gt; Build APK(s).
                </p>
              )}
            </div>

            {/* Option B: PWABuilder Cloud Compiler */}
            <div className="bg-[#f4f1ea] border border-[#1a1a1a] p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#1a1a1a] uppercase">
                  Option B: Cloud APK Compiler (PWABuilder)
                </span>
                <span className="text-[10px] font-mono text-blue-700 font-bold">Cloud Build</span>
              </div>
              <p className="text-[11px] font-mono text-[#1a1a1a]/70">
                Microsoft & Google's free cloud tool. Uses official Android SDK to generate signed APKs directly in the browser.
              </p>
              <a
                href={pwaBuilderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-white hover:bg-[#f4f1ea] text-[#1a1a1a] font-mono font-bold uppercase text-xs border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition flex items-center justify-center gap-2"
              >
                <span>Open PWABuilder with App URL</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* TAB 3: Why Did "Problem Parsing Package" Happen? */}
        {activeTab === 'explain' && (
          <div className="bg-white border-2 border-[#1a1a1a] p-4 shadow-[4px_4px_0px_#1a1a1a] space-y-3 font-mono text-xs text-[#1a1a1a]">
            <div className="flex items-center gap-2 text-amber-700 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="font-serif font-bold text-sm text-[#1a1a1a]">Technical Explanation: Android Parse Error</h3>
            </div>
            
            <p className="leading-relaxed text-[#1a1a1a]/80">
              When Android displays <em>"There was a problem while parsing the package"</em>, it means the operating system's <code>PackageParser</code> rejected the file before attempting installation.
            </p>

            <div className="bg-[#f4f1ea] p-3 border border-[#1a1a1a] space-y-2 text-[11px]">
              <span className="font-bold text-[#ff5d22] block uppercase">What Android strictly requires:</span>
              <ul className="list-disc list-inside space-y-1 text-[#1a1a1a]/85">
                <li>
                  <strong>Binary XML (AXML):</strong> Android refuses plain-text UTF-8 XML. Manifests must be compiled by Google's <code>aapt2</code> compiler.
                </li>
                <li>
                  <strong>Dalvik Bytecode (classes.dex):</strong> The APK must contain real executable code compiled by <code>d8</code>.
                </li>
                <li>
                  <strong>Keystore Signature:</strong> Android requires cryptographic APK v2/v3 signatures signed by an RSA/ECDSA key.
                </li>
              </ul>
            </div>

            <p className="text-[11px] leading-relaxed text-[#1a1a1a]/80">
              Because cloud web servers do not run the multi-gigabyte Android SDK compiler, mock zipped files will always fail Android's parser. Using the <strong>QR Code (WebAPK)</strong> or the <strong>Android Studio Project (.ZIP)</strong> gives you a 100% genuine, working installation!
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-[#1a1a1a]">
          <span className="text-[10px] font-mono text-[#1a1a1a]/60">
            Package: com.riderent.india • Version 4.0.0
          </span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-white hover:bg-[#f4f1ea] text-[#1a1a1a] font-mono font-bold uppercase text-xs border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
