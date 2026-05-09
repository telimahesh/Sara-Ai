import React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Activity, 
  Clock, 
  Smartphone, 
  Flame,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { cn } from "../lib/utils";

const data = [
  { name: "Mon", usage: 45, battery: 85 },
  { name: "Tue", usage: 52, battery: 78 },
  { name: "Wed", usage: 38, battery: 92 },
  { name: "Thu", usage: 65, battery: 70 },
  { name: "Fri", usage: 48, battery: 82 },
  { name: "Sat", usage: 30, battery: 95 },
  { name: "Sun", usage: 25, battery: 98 },
];

export const UsageStats = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="text-lg font-bold uppercase italic tracking-tight text-white">Usage Analytics</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Device interaction insights</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full">
          <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">Live Updates</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-pink-500" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Screen Time</span>
          </div>
          <div className="text-2xl font-black text-white italic">4h 22m</div>
          <div className="text-[8px] text-zinc-500 uppercase tracking-widest mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-400" />
            +12% from yesterday
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">AI Cycles</span>
          </div>
          <div className="text-2xl font-black text-white italic">1,284</div>
          <div className="text-[8px] text-zinc-500 uppercase tracking-widest mt-1">Deep analysis events</div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 h-64">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Weekly Activity Flow</span>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-cyan-500" />
              <span className="text-[8px] text-zinc-500 uppercase tracking-widest">Interaction</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-pink-500" />
              <span className="text-[8px] text-zinc-500 uppercase tracking-widest">Efficiency</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#52525b" 
              fontSize={8} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#71717a' }}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#09090b', 
                border: '1px solid #27272a',
                borderRadius: '12px',
                fontSize: '10px',
                color: '#fff'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="usage" 
              stroke="#22d3ee" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#usageGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
          <Smartphone className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">System Efficiency</h4>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-cyan-500 h-full w-[85%] rounded-full" />
          </div>
        </div>
        <div className="text-xs font-black text-cyan-400 italic">85%</div>
      </div>
    </div>
  );
};
