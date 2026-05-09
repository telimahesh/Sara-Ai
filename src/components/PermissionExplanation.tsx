import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Info, 
  X,
  Lock,
  Eye,
  Activity,
  Zap,
  Smartphone,
  CheckCircle2
} from "lucide-react";
import { Button } from "./ui/button";

interface PermissionExplanationProps {
  title: string;
  description: string;
  icon: React.ElementType;
  reason: string;
  benefits: string[];
  isOpen: boolean;
  onClose: () => void;
  onGrant: () => void;
}

export const PermissionExplanation: React.FC<PermissionExplanationProps> = ({
  title,
  description,
  icon: Icon,
  reason,
  benefits,
  isOpen,
  onClose,
  onGrant
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="relative p-8 text-center bg-zinc-900 border-b border-zinc-800">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mx-auto mb-6 transform rotate-6">
                <Icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">{title}</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">{description}</p>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <Info className="w-5 h-5 text-cyan-400 mt-1 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-1">Why do we need this?</h4>
                  <p className="text-[9px] text-zinc-400 uppercase tracking-tight leading-relaxed">{reason}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Unlocks Features:</h4>
                <div className="space-y-2">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 px-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      <span className="text-[10px] text-zinc-200 uppercase tracking-tight">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 flex flex-col gap-3">
              <Button 
                onClick={onGrant}
                className="w-full py-7 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black uppercase italic tracking-widest text-sm shadow-lg"
              >
                Grant Access
              </Button>
              <Button 
                onClick={onClose}
                variant="ghost"
                className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold h-10"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
