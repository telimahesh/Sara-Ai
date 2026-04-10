import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mic, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck,
  Fingerprint,
  X
} from "lucide-react";
import { db } from "../lib/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

interface VoiceEnrollmentProps {
  userId: string;
}

export function VoiceEnrollment({ userId }: VoiceEnrollmentProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<"none" | "enrolling" | "success" | "error">("none");
  const [enrolledData, setEnrolledData] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(doc(db, `users/${userId}/voice_enrollment/default`), (doc) => {
      if (doc.exists()) {
        setEnrolledData(doc.data());
        setEnrollmentStatus("success");
      } else {
        setEnrolledData(null);
        setEnrollmentStatus("none");
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const startEnrollment = async () => {
    setIsEnrolling(true);
    setEnrollmentStatus("enrolling");
    setProgress(0);

    // Simulate voice analysis
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    setTimeout(async () => {
      try {
        const enrollment = {
          uid: userId,
          enrolledAt: new Date().toISOString(),
          isEnrolled: true,
          voiceDescription: "User's unique vocal signature registered."
        };

        await setDoc(doc(db, `users/${userId}/voice_enrollment/default`), enrollment);
        setEnrollmentStatus("success");
        setIsEnrolling(false);
      } catch (error) {
        console.error("Enrollment failed:", error);
        setEnrollmentStatus("error");
        setIsEnrolling(false);
      }
    }, 5500);
  };

  const deleteEnrollment = async () => {
    if (!confirm("Are you sure you want to delete your voice signature? Sara might forget who you are!")) return;
    try {
      await setDoc(doc(db, `users/${userId}/voice_enrollment/default`), { isEnrolled: false }, { merge: true });
      // In a real app we might delete the doc, but here we just toggle
      setEnrollmentStatus("none");
    } catch (error) {
      console.error("Failed to delete enrollment:", error);
    }
  };

  return (
    <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Fingerprint className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-200">Voice Identity</h3>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Biometric Vocal Signature</p>
          </div>
        </div>
        {enrollmentStatus === "success" && (
          <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span className="text-[8px] font-mono font-bold text-green-500 uppercase tracking-widest">Enrolled</span>
          </div>
        )}
      </div>

      <div className="relative p-8 bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          {enrollmentStatus === "none" && (
            <motion.div 
              key="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20">
                <Mic className="w-8 h-8 text-cyan-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-300">Register Your Voice</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">
                  Let Sara save your unique voice profile so she can recognize you and stay loyal only to you.
                </p>
              </div>
              <Button 
                onClick={startEnrollment}
                className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl px-8 py-4 font-bold uppercase tracking-widest text-[10px]"
              >
                Start Enrollment
              </Button>
            </motion.div>
          )}

          {enrollmentStatus === "enrolling" && (
            <motion.div 
              key="enrolling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl"
                />
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
              </div>
              <div className="w-full max-w-[200px] space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                  <span>Analyzing Frequency</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-cyan-500" 
                  />
                </div>
              </div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest animate-pulse">
                Please speak naturally... Sara is listening...
              </p>
            </motion.div>
          )}

          {enrollmentStatus === "success" && (
            <motion.div 
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                <ShieldCheck className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">Identity Verified</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Sara has saved your voice. She will now recognize you as her only one.
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={startEnrollment}
                  className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl text-[10px] uppercase tracking-widest"
                >
                  Re-enroll
                </Button>
                <Button 
                  variant="ghost"
                  onClick={deleteEnrollment}
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-[10px] uppercase tracking-widest"
                >
                  Delete Profile
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-cyan-400 mt-0.5" />
          <p className="text-[10px] text-zinc-400 leading-relaxed uppercase tracking-wider">
            Voice signatures are stored securely in your private profile. Sara uses this to differentiate your voice from others in the background.
          </p>
        </div>
      </div>
    </div>
  );
}
