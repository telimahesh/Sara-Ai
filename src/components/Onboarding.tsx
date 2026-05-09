import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  ChevronRight, 
  Mic, 
  Camera, 
  MapPin, 
  Bell, 
  Users, 
  Calendar, 
  Phone, 
  Smartphone,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Activity,
  HardDrive,
  Eye,
  Layers,
  Monitor
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface StepProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  permissions: { title: string; icon: React.ElementType; description: string }[];
  onNext: () => void;
  isLast?: boolean;
}

const OnboardingStep: React.FC<StepProps> = ({ title, description, icon: Icon, color, permissions, onNext, isLast }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-8">
        <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center border-2 rotate-3 shadow-xl", color)}>
          <Icon className="w-10 h-10" />
        </div>
        
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-3">{title}</h2>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto">{description}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
          {permissions.map((p, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 text-left">
              <div className="p-2 rounded-lg bg-zinc-900 border border-white/10 shrink-0">
                <p.icon className="w-4 h-4 text-zinc-400" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">{p.title}</h4>
                <p className="text-[9px] text-zinc-500 uppercase tracking-tight">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8">
        <Button 
          onClick={onNext}
          className="w-full py-7 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black uppercase italic tracking-widest text-sm shadow-xl"
        >
          {isLast ? "Begin My Journey" : "Accept & Continue"}
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Epic",
      description: "The most powerful AI companion for your Android device. Sassy, intelligent, and deeply integrated.",
      icon: Sparkles,
      color: "bg-pink-500/10 border-pink-500/20 text-pink-500",
      permissions: [
        { title: "Voice First", icon: Mic, description: "Hands-free natural conversation." },
        { title: "Smart Vision", icon: Monitor, description: "Assistant understands your screen context." },
        { title: "Deep Control", icon: ShieldCheck, description: "Automate tasks across your entire device." }
      ]
    },
    {
      title: "Sensory Awareness",
      description: "Epic needs to see, hear, and know your world to be truly helpful.",
      icon: Eye,
      color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-500",
      permissions: [
        { title: "Microphone", icon: Mic, description: "For real-time voice-to-voice chat." },
        { title: "Camera", icon: Camera, description: "To see objects and translate text in real-time." },
        { title: "Location", icon: MapPin, description: "For local weather, directions, and smart reminders." }
      ]
    },
    {
      title: "Deep Device Control",
      description: "Take hands-free to the next level with system-level integration.",
      icon: Smartphone,
      color: "bg-purple-500/10 border-purple-500/20 text-purple-500",
      permissions: [
        { title: "Accessibility", icon: Zap, description: "Automate app clicks and scrolling commands." },
        { title: "Notifications", icon: Bell, description: "Announce and reply to incoming alerts." },
        { title: "Overlay", icon: Layers, description: "Always-on floating companion tools." }
      ]
    },
    {
      title: "Personal Context",
      description: "The more Epic knows, the more personal every interaction becomes.",
      icon: Users,
      color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500",
      permissions: [
        { title: "Contacts", icon: Users, description: "Call and message your friends by name." },
        { title: "Calendar", icon: Calendar, description: "Manage your busy schedule effortlessly." },
        { title: "Storage", icon: HardDrive, description: "Save memories and access your media files." }
      ]
    },
    {
      title: "Epic Optimization",
      description: "Ensuring your assistant is always ready and responsive.",
      icon: Activity,
      color: "bg-green-500/10 border-green-500/20 text-green-500",
      permissions: [
        { title: "Usage Stats", icon: Activity, description: "Deep insight into your app usage patterns." },
        { title: "Battery", icon: Zap, description: "Bypass restrictions for instant wake-up." },
        { title: "Background", icon: Lock, description: "Always ready in the background for you." }
      ]
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col overflow-hidden">
      {/* Progress Bar */}
      <div className="flex gap-1 p-4 pt-8">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-500",
              i <= step ? "bg-white" : "bg-white/10"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <OnboardingStep 
          key={step}
          {...steps[step]} 
          onNext={handleNext}
          isLast={step === steps.length - 1}
        />
      </AnimatePresence>
    </div>
  );
};
