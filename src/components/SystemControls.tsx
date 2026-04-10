import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Phone, 
  Camera, 
  Users, 
  MapPin, 
  Mic, 
  Bell, 
  MessageSquare, 
  ShieldCheck,
  Smartphone,
  Wifi,
  Zap,
  Vibrate,
  Lock,
  Eye,
  Settings2,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Bluetooth,
  Activity,
  Globe,
  Volume2,
  Key,
  Monitor,
  Search,
  Layers,
  Accessibility,
  Keyboard,
  Battery
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface PermissionItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  status: "allowed" | "denied" | "prompt" | "unsupported" | "restricted";
  onToggle?: () => void;
}

const PermissionItem: React.FC<PermissionItemProps> = ({ icon: Icon, title, description, status, onToggle }) => {
  const getStatusColor = () => {
    switch (status) {
      case "allowed": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "denied": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "prompt": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "restricted": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      default: return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all group">
      <div className={cn("p-2.5 rounded-lg border shrink-0", getStatusColor())}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="text-[11px] font-bold text-zinc-100 truncate uppercase tracking-tight">{title}</h4>
          <span className={cn("text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0", getStatusColor())}>
            {status === "prompt" ? "Action Required" : status}
          </span>
        </div>
        <p className="text-[10px] text-zinc-500 leading-relaxed line-clamp-2">{description}</p>
      </div>
      {onToggle && status !== "unsupported" && status !== "restricted" && (
        <button 
          onClick={onToggle}
          className="self-center p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const SystemControls = () => {
  const [activeCategory, setActiveCategory] = useState<string>("communication");
  const [permissions, setPermissions] = useState<Record<string, any>>({
    microphone: "prompt",
    camera: "prompt",
    geolocation: "prompt",
    notifications: "prompt",
    contacts: "unsupported",
    vibration: "allowed",
    network: "allowed",
    wakelock: "prompt"
  });

  const [wakeLock, setWakeLock] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        try {
          const lock = await (navigator as any).wakeLock.request('screen');
          setWakeLock(lock);
        } catch (err) {
          console.error(`${err.name}, ${err.message}`);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [wakeLock]);

  useEffect(() => {
    const checkPermissions = async () => {
      if (!navigator.permissions) return;

      const types = ["microphone", "camera", "geolocation", "notifications"];
      const newStates: any = { ...permissions };

      for (const type of types) {
        try {
          const status = await navigator.permissions.query({ name: type as any });
          newStates[type] = status.state;
          status.onchange = () => {
            setPermissions(prev => ({ ...prev, [type]: status.state }));
          };
        } catch (e) {
          console.warn(`Permission check failed for ${type}:`, e);
        }
      }

      if ("contacts" in navigator && "ContactsManager" in window) {
        newStates.contacts = "prompt";
      }

      if ("wakeLock" in navigator) {
        newStates.wakelock = wakeLock ? "allowed" : "prompt";
      } else {
        newStates.wakelock = "unsupported";
      }

      setPermissions(newStates);
    };

    checkPermissions();
  }, [wakeLock]);

  const requestPermission = async (type: string) => {
    switch (type) {
      case "geolocation":
        navigator.geolocation.getCurrentPosition(
          () => setPermissions(prev => ({ ...prev, geolocation: "granted" })),
          () => setPermissions(prev => ({ ...prev, geolocation: "denied" }))
        );
        break;
      case "notifications":
        const result = await Notification.requestPermission();
        setPermissions(prev => ({ ...prev, notifications: result }));
        break;
      case "vibration":
        navigator.vibrate(200);
        break;
      case "wakelock":
        if (wakeLock) {
          wakeLock.release().then(() => setWakeLock(null));
        } else {
          try {
            const lock = await (navigator as any).wakeLock.request('screen');
            setWakeLock(lock);
            lock.addEventListener('release', () => {
              setWakeLock(null);
            });
          } catch (err) {
            console.error(`${err.name}, ${err.message}`);
          }
        }
        break;
      case "contacts":
        try {
          setErrorMessage(null);
          if (window.self !== window.top) {
            setErrorMessage("The Contact Picker API cannot be used inside an iframe. Please open Sara in a new tab to use this feature.");
            return;
          }
          const props = ["name", "email", "tel"];
          const opts = { multiple: false };
          await (navigator as any).contacts.select(props, opts);
          setPermissions(prev => ({ ...prev, contacts: "granted" }));
        } catch (e: any) {
          console.error("Contact picker failed:", e);
          if (e.message?.includes("top frame")) {
            setErrorMessage("This feature only works when the app is opened in a new tab (not inside an iframe).");
          } else {
            setErrorMessage("Contact picker failed: " + e.message);
          }
        }
        break;
    }
  };

  const categories = [
    { id: "communication", label: "Communication", icon: Phone },
    { id: "media", label: "Media & Sensors", icon: Camera },
    { id: "system", label: "System & Core", icon: Smartphone },
    { id: "connectivity", label: "Connectivity", icon: Wifi }
  ];

  const permissionGroups: Record<string, { icon: React.ElementType; title: string; desc: string; status: "allowed" | "denied" | "prompt" | "unsupported" | "restricted" }[]> = {
    communication: [
      { icon: Phone, title: "CALL_PHONE", desc: "Initiate phone calls directly.", status: "restricted" },
      { icon: Users, title: "READ_CONTACTS", desc: "Access your contact list.", status: permissions.contacts === "granted" ? "allowed" : "prompt" },
      { icon: Users, title: "WRITE_CONTACTS", desc: "Modify or add new contacts.", status: "restricted" },
      { icon: Key, title: "GET_ACCOUNTS", desc: "Access the list of accounts in the Accounts Service.", status: "restricted" },
      { icon: MessageSquare, title: "READ_SMS", desc: "Read received text messages.", status: "restricted" },
      { icon: MessageSquare, title: "SEND_SMS", desc: "Send text messages on your behalf.", status: "restricted" },
      { icon: MessageSquare, title: "RECEIVE_SMS", desc: "Monitor incoming text messages.", status: "restricted" },
      { icon: Calendar, title: "READ_CALENDAR", desc: "Access your calendar events.", status: "prompt" },
      { icon: Calendar, title: "WRITE_CALENDAR", desc: "Add or modify calendar events.", status: "restricted" },
    ],
    media: [
      { icon: Camera, title: "CAMERA", desc: "Take photos and record videos.", status: permissions.camera === "granted" ? "allowed" : "prompt" },
      { icon: Mic, title: "RECORD_AUDIO", desc: "Record audio through the microphone.", status: permissions.microphone === "granted" ? "allowed" : "prompt" },
      { icon: MapPin, title: "ACCESS_FINE_LOCATION", desc: "Access precise GPS location.", status: permissions.geolocation === "granted" ? "allowed" : "prompt" },
      { icon: MapPin, title: "ACCESS_COARSE_LOCATION", desc: "Access approximate network location.", status: permissions.geolocation === "granted" ? "allowed" : "prompt" },
      { icon: HardDrive, title: "READ_EXTERNAL_STORAGE", desc: "Read files from your device storage.", status: "prompt" },
      { icon: HardDrive, title: "WRITE_EXTERNAL_STORAGE", desc: "Save files to your device storage.", status: "restricted" },
      { icon: Eye, title: "READ_MEDIA_IMAGES", desc: "Access your photo gallery.", status: "prompt" },
      { icon: Monitor, title: "READ_MEDIA_VIDEO", desc: "Access your video library.", status: "prompt" },
      { icon: Volume2, title: "READ_MEDIA_AUDIO", desc: "Access your music and audio files.", status: "prompt" },
      { icon: ShieldCheck, title: "MANAGE_EXTERNAL_STORAGE", desc: "Full access to device storage.", status: "restricted" },
    ],
    system: [
      { icon: Lock, title: "WAKE_LOCK", desc: "Keep the screen active.", status: permissions.wakelock === "allowed" ? "allowed" : "prompt" },
      { icon: Bell, title: "POST_NOTIFICATIONS", desc: "Display alerts and notifications.", status: permissions.notifications === "granted" ? "allowed" : "prompt" },
      { icon: Smartphone, title: "SYSTEM_ALERT_WINDOW", desc: "Draw over other applications.", status: "restricted" },
      { icon: Activity, title: "PACKAGE_USAGE_STATS", desc: "Monitor app usage and statistics.", status: "restricted" },
      { icon: Bell, title: "BIND_NOTIFICATION_LISTENER", desc: "Listen to all system notifications.", status: "restricted" },
      { icon: Accessibility, title: "BIND_ACCESSIBILITY_SERVICE", desc: "Assistive technology access.", status: "restricted" },
      { icon: Keyboard, title: "BIND_INPUT_METHOD", desc: "Custom keyboard integration.", status: "restricted" },
      { icon: Battery, title: "IGNORE_BATTERY_OPTIMIZATIONS", desc: "Bypass power saving restrictions.", status: "restricted" },
      { icon: ShieldCheck, title: "DEVICE_ADMIN", desc: "Device administration privileges.", status: "restricted" },
      { icon: Search, title: "QUERY_ALL_PACKAGES", desc: "See all installed applications.", status: "restricted" },
      { icon: Zap, title: "FOREGROUND_SERVICE", desc: "Run persistent background tasks.", status: "allowed" },
      { icon: Zap, title: "RECEIVE_BOOT_COMPLETED", desc: "Start automatically on device boot.", status: "restricted" },
      { icon: Mic, title: "FOREGROUND_SERVICE_MIC", desc: "Background microphone access.", status: "allowed" },
      { icon: Camera, title: "FOREGROUND_SERVICE_CAMERA", desc: "Background camera access.", status: "allowed" },
      { icon: MapPin, title: "FOREGROUND_SERVICE_LOCATION", desc: "Background location tracking.", status: "allowed" },
    ],
    connectivity: [
      { icon: Globe, title: "INTERNET", desc: "Full network access.", status: "allowed" },
      { icon: Wifi, title: "ACCESS_WIFI_STATE", desc: "View Wi-Fi connection details.", status: "allowed" },
      { icon: Wifi, title: "CHANGE_WIFI_STATE", desc: "Connect/disconnect from Wi-Fi.", status: "restricted" },
      { icon: Bluetooth, title: "BLUETOOTH", desc: "Connect to paired devices.", status: "prompt" },
      { icon: Bluetooth, title: "BLUETOOTH_CONNECT", desc: "Discover and pair with new devices.", status: "restricted" },
      { icon: Bluetooth, title: "BLUETOOTH_ADMIN", desc: "Manage Bluetooth settings.", status: "restricted" },
      { icon: Vibrate, title: "VIBRATE", desc: "Control device haptics.", status: "allowed" },
      { icon: Volume2, title: "MODIFY_AUDIO_SETTINGS", desc: "Adjust system volume and modes.", status: "allowed" },
    ]
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck className="w-6 h-6 text-pink-500" />
        <div>
          <h3 className="text-lg font-bold uppercase italic tracking-tight">Sara's Mobile Control</h3>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Advanced Permission Matrix</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/5 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
              activeCategory === cat.id 
                ? "bg-pink-500 text-white shadow-lg" 
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            )}
          >
            <cat.icon className="w-3 h-3" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Permission Grid */}
      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {permissionGroups[activeCategory].map((perm, idx) => (
              <PermissionItem 
                key={idx}
                icon={perm.icon}
                title={perm.title}
                description={perm.desc}
                status={perm.status}
                onToggle={() => {
                  if (perm.title === "ACCESS_FINE_LOCATION") requestPermission("geolocation");
                  if (perm.title === "POST_NOTIFICATIONS") requestPermission("notifications");
                  if (perm.title === "WAKE_LOCK") requestPermission("wakelock");
                  if (perm.title === "READ_CONTACTS") requestPermission("contacts");
                  if (perm.title === "VIBRATE") requestPermission("vibration");
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {errorMessage && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
          <p className="text-[10px] text-red-200 leading-relaxed uppercase tracking-wider">{errorMessage}</p>
        </motion.div>
      )}

      <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/10 mt-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-pink-400 mt-0.5" />
          <div>
            <h5 className="text-[10px] font-bold text-pink-200 mb-1 uppercase tracking-widest">Native Integration Note</h5>
            <p className="text-[9px] text-zinc-400 leading-relaxed uppercase tracking-wider">
              Permissions marked as <span className="text-orange-400">RESTRICTED</span> are enforced by Android system policies. Full control over SMS, Call Logs, and System Services requires Sara to be installed as a native mobile application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

