import React from "react";
import { 
  ShieldCheck, 
  Eye, 
  Lock, 
  ShieldAlert, 
  ChevronLeft,
  Server,
  Cloud,
  FileText
} from "lucide-react";
import { Button } from "./ui/button";

export const PrivacyPolicy = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black z-[110] flex flex-col p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-zinc-400">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-xl font-bold uppercase italic tracking-tight">Privacy Policy</h2>
      </div>

      <div className="space-y-8 pb-12">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-pink-500">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Our Commitment</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed uppercase tracking-wider">
            Epic Assistant is designed with privacy as a core principle. We believe your data belongs to you. Our assistant only listens or "sees" when you explicitly activate its sensory modes.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <Eye className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Data Collection</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
              <Mic className="w-4 h-4 text-zinc-400 mt-1 shrink-0" />
              <div>
                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-1">Voice Data</h4>
                <p className="text-[9px] text-zinc-500 uppercase tracking-tight">Audio is processed in real-time to generate responses. We do not store raw audio recordings on our servers.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
              <Monitor className="w-4 h-4 text-zinc-400 mt-1 shrink-0" />
              <div>
                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-1">Visual Context</h4>
                <p className="text-[9px] text-zinc-500 uppercase tracking-tight">Screen frames are sent to the AI for context only when Vision is active. Frames are discarded immediately after processing.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-yellow-400">
            <Lock className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest">On-Device Processing</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed uppercase tracking-wider">
            Whenever possible, Epic Assistant performs processing on your device. Local permissions (Contacts, Calendar, Location) are used to perform actions locally or to provide context to the AI via secure, encrypted channels.
          </p>
        </section>

        <section className="space-y-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 text-red-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Third-Party Services</h3>
          </div>
          <p className="text-[10px] text-red-200 leading-relaxed uppercase tracking-wider">
            We use Google Gemini API for the assistant's intelligence. By using this app, you agree to Google's Privacy Policy regarding AI processing. We never sell your personal data to third parties.
          </p>
        </section>

        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-[8px] text-zinc-600 uppercase tracking-widest mb-4">Version 1.0.0 (Epic Assistant Build)</p>
          <Button 
            onClick={onBack}
            className="w-full py-6 bg-zinc-900 border border-zinc-800 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-800"
          >
            I Acknowledge
          </Button>
        </div>
      </div>
    </div>
  );
};
