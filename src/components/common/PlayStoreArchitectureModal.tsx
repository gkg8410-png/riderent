import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  Code2,
  Layers,
  Shield,
  FileCode,
  Copy,
  Check,
} from 'lucide-react';

interface PlayStoreArchitectureModalProps {
  onClose: () => void;
}

export const PlayStoreArchitectureModal: React.FC<PlayStoreArchitectureModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'FLUTTER' | 'PERMISSIONS' | 'CONSOLE'>('FLUTTER');

  const flutterArchitectureCode = `// lib/main.dart - Unified Single Codebase Architecture for RideRent (Play Store & App Store)
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: RideRentApp()));
}

class RideRentApp extends ConsumerWidget {
  const RideRentApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userRole = ref.watch(currentUserRoleProvider);

    return MaterialApp(
      title: 'RideRent - Peer-to-Peer Car Sharing',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFFF59E0B),
        useMaterial3: true,
      ),
      home: userRole == UserRole.owner
          ? const OwnerDashboardScreen()
          : const CustomerHomeScreen(),
    );
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(flutterArchitectureCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Google Play Store & Native Architecture</h3>
              <p className="text-[11px] text-slate-400">
                Single Codebase (Customer & Host) • Target SDK 35 Compliant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-bold bg-slate-50">
          <button
            onClick={() => setActiveTab('FLUTTER')}
            className={`flex-1 py-3 text-center transition ${
              activeTab === 'FLUTTER'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-500'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Flutter Monorepo Architecture
          </button>
          <button
            onClick={() => setActiveTab('PERMISSIONS')}
            className={`flex-1 py-3 text-center transition ${
              activeTab === 'PERMISSIONS'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-500'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Android Manifest & Permissions
          </button>
          <button
            onClick={() => setActiveTab('CONSOLE')}
            className={`flex-1 py-3 text-center transition ${
              activeTab === 'CONSOLE'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-500'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Play Console Listing Specs
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[480px] overflow-y-auto text-xs">
          {activeTab === 'FLUTTER' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">
                  Role-Adaptive Monorepo Architecture
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-2xl overflow-x-auto leading-relaxed">
                <pre>{flutterArchitectureCode}</pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Single App Package</strong>
                  <p className="text-slate-600 text-[11px]">
                    Allows customers to toggle to Host mode in-app without downloading two separate apps, maximizing conversion.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Fast App Bundle (.AAB)</strong>
                  <p className="text-slate-600 text-[11px]">
                    Optimized asset splitting and dynamic feature delivery per Android architecture (ARM64-v8a, x86_64).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PERMISSIONS' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">
                Strict Google Play Policy Permissions
              </h4>
              <ul className="space-y-2">
                <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block font-mono text-xs">
                      ACCESS_FINE_LOCATION & ACCESS_COARSE_LOCATION
                    </strong>
                    <span className="text-slate-500 text-[11px]">
                      Used solely while app is in foreground to calculate pickup distance and proximity to owner handover point.
                    </span>
                  </div>
                </li>
                <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block font-mono text-xs">CAMERA</strong>
                    <span className="text-slate-500 text-[11px]">
                      Pre-trip & post-trip odometer/fuel level inspection photos and Driving License KYC scan.
                    </span>
                  </div>
                </li>
                <li className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block font-mono text-xs">
                      POST_NOTIFICATIONS (Android 13+)
                    </strong>
                    <span className="text-slate-500 text-[11px]">
                      FCM push notifications for booking confirmations, trip extensions, and chat messages.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'CONSOLE' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">
                Google Play Store Listing Assets & Metadata
              </h4>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">App Name:</span>
                  <strong className="text-slate-900">RideRent: Self Drive Car Rental</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Short Description (80 chars):</span>
                  <strong className="text-slate-900">
                    Rent verified cars from trusted local owners across India with Fastag & Roadside cover.
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <strong className="text-slate-900">Auto & Vehicles / Travel & Local</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Content Rating:</span>
                  <strong className="text-slate-900">Everyone (3+)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target SDK:</span>
                  <strong className="text-emerald-700 font-mono">35 (Android 15 Ready)</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
