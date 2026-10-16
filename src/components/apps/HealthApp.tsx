import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Flame,
  Footprints,
  Droplets,
  Heart,
  Clock,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  WifiOff,
  UserPlus,
  Play,
  Pause,
  Check,
  ChevronRight,
  Smile,
  Frown,
  Volume2,
  Calendar,
} from 'lucide-react';
import { useLauncher } from '../../context/LauncherContext';
import { soundHaptics } from '../../utils/haptics';

export const HealthApp: React.FC = () => {
  const {
    userName,
    healthData,
    toggleWalkingWorkout,
    logWaterGlass,
    askWaterPrompt,
    waterPromptActive,
    respondWaterPrompt,
    sleepSchedule,
    setSleepSchedule,
    isBedtimeActivated,
    setIsBedtimeActivated,
    activateBedtime,
    deactivateBedtime,
    isPhoneBlank,
    setIsPhoneBlank,
    bedtimeTimerSeconds,
    triggerWakeUpMorning,
    executeMavicOrbCommand,
  } = useLauncher();

  const [activeTab, setActiveTab] = useState<'summary' | 'sleep' | 'steps' | 'water'>('summary');
  const [bedtimeInput, setBedtimeInput] = useState(sleepSchedule.bedtime);
  const [wakeUpInput, setWakeUpInput] = useState(sleepSchedule.wakeUpTime);
  const [newVIPName, setNewVIPName] = useState('');
  const [showAddVIP, setShowAddVIP] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    soundHaptics.playClick(1000, 0.08);
    setSleepSchedule({
      ...sleepSchedule,
      bedtime: bedtimeInput,
      wakeUpTime: wakeUpInput,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleAddVIP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVIPName.trim()) return;
    soundHaptics.playClick(950, 0.06);
    const updated = [...sleepSchedule.vipContacts, `${newVIPName.trim()} (VIP)`];
    setSleepSchedule({ ...sleepSchedule, vipContacts: updated });
    setNewVIPName('');
    setShowAddVIP(false);
  };

  const handleRemoveVIP = (idx: number) => {
    soundHaptics.playClick(750, 0.05);
    const updated = sleepSchedule.vipContacts.filter((_, i) => i !== idx);
    setSleepSchedule({ ...sleepSchedule, vipContacts: updated });
  };

  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full h-full bg-[#f2f2f7] dark:bg-black text-slate-900 dark:text-white pt-12 pb-24 px-4 overflow-y-auto select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <span className="text-[11px] font-bold text-rose-500 uppercase tracking-widest font-mono">
            Mavic Health OS
          </span>
          <h1 className="text-3xl font-black tracking-tight">Health</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={askWaterPrompt}
            className="p-2 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 active:scale-95 transition-all"
            title="Ask Water Hydration Check"
          >
            <Droplets size={16} />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-slate-200 dark:bg-neutral-900 p-1 rounded-2xl mb-4 gap-1 border border-slate-300 dark:border-neutral-800 text-xs font-semibold">
        {(['summary', 'sleep', 'steps', 'water'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              soundHaptics.playClick(900, 0.04);
              setActiveTab(tab);
            }}
            className={`flex-1 py-1.5 rounded-xl capitalize transition-all ${
              activeTab === tab
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab === 'sleep' ? 'Sleep & Bedtime' : tab === 'steps' ? 'Steps' : tab}
          </button>
        ))}
      </div>

      {/* ACTIVE WATER PROMPT BANNER (When Assistant asks: "Hi [userName] have you taken water this morning") */}
      {waterPromptActive && (
        <div className="bg-gradient-to-r from-sky-500/20 via-blue-500/15 to-indigo-500/20 border border-sky-500/40 rounded-2xl p-4 mb-4 shadow-lg flex flex-col gap-2.5 animate-pulse">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <Droplets size={16} />
            <span>MAVIC Hydration Check</span>
          </div>
          <p className="text-sm font-semibold text-white">
            &quot;Hi {userName}, have you taken water this morning?&quot;
          </p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => respondWaterPrompt(true)}
              className="flex-1 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              <Check size={14} />
              <span>Yes, I Drank Water</span>
            </button>
            <button
              onClick={() => respondWaterPrompt(false)}
              className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-white/20 active:scale-95"
            >
              <span>Not Yet</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: SUMMARY */}
      {activeTab === 'summary' && (
        <div className="flex flex-col gap-4">
          {/* Daily Highlights Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Steps Tile */}
            <div
              onClick={() => setActiveTab('steps')}
              className="bg-white dark:bg-[#1c1c1e] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5 shadow-sm cursor-pointer hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-500 uppercase">Steps</span>
                <Footprints size={16} className="text-emerald-500" />
              </div>
              <div className="my-2">
                <span className="text-2xl font-black">{healthData.steps.toLocaleString()}</span>
                <span className="text-[10px] text-neutral-400 block font-mono">
                  Goal: {healthData.stepsGoal.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, (healthData.steps / healthData.stepsGoal) * 100)}%` }}
                />
              </div>
            </div>

            {/* Sleep Tile */}
            <div
              onClick={() => setActiveTab('sleep')}
              className="bg-white dark:bg-[#1c1c1e] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5 shadow-sm cursor-pointer hover:border-indigo-500/50 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-400 uppercase">Sleep Time</span>
                <Moon size={16} className="text-indigo-400" />
              </div>
              <div className="my-2">
                <span className="text-2xl font-black">{healthData.sleepHours} hrs</span>
                <span className="text-[10px] text-neutral-400 block">
                  Wake: {sleepSchedule.wakeUpTime} · Bed: {sleepSchedule.bedtime}
                </span>
              </div>
              <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                <ShieldCheck size={12} />
                <span>30m Blank Mode Ready</span>
              </span>
            </div>

            {/* Hydration Tile */}
            <div
              onClick={() => setActiveTab('water')}
              className="bg-white dark:bg-[#1c1c1e] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5 shadow-sm cursor-pointer hover:border-sky-500/50 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-sky-400 uppercase">Hydration</span>
                <Droplets size={16} className="text-sky-400" />
              </div>
              <div className="my-2">
                <span className="text-2xl font-black">{healthData.waterGlasses} glasses</span>
                <span className="text-[10px] text-neutral-400 block font-mono">
                  Goal: {healthData.waterGoal} glasses/day
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-400 rounded-full"
                  style={{ width: `${Math.min(100, (healthData.waterGlasses / healthData.waterGoal) * 100)}%` }}
                />
              </div>
            </div>

            {/* Active Calories & Heart Rate */}
            <div className="bg-white dark:bg-[#1c1c1e] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-500 uppercase">Vitals</span>
                <Heart size={16} className="text-rose-500 animate-pulse" />
              </div>
              <div className="my-2">
                <span className="text-2xl font-black">{healthData.heartRate} bpm</span>
                <span className="text-[10px] text-neutral-400 block font-mono">
                  {healthData.caloriesBurned} kcal burned
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold font-mono">Resting Heart Rate: Normal</span>
            </div>
          </div>

          {/* Quick Mental & Emotional Well-Being Card */}
          <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-black rounded-2xl p-4 border border-purple-500/30 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={16} />
                <span>Emotional Wellness &amp; Care</span>
              </div>
              <span className="text-[10px] font-mono text-purple-300/80">Mavic AI Empathy</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              Feeling depressed, overwhelmed, or anxious? MAVIC is programmed to listen, ground you with breathing exercises, and provide comforting steps.
            </p>
            <button
              onClick={() => {
                soundHaptics.playClick(1000, 0.08);
                executeMavicOrbCommand("Hey Mavic, I'm depressed what can I do");
              }}
              className="w-full py-2 bg-purple-600/80 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Volume2 size={14} />
              <span>Ask: &quot;Hey Mavic I&apos;m depressed what can I do&quot;</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: SLEEP & BEDTIME (With 30-min Blanking, Wake Up 06:00 AM, VIP Contacts) */}
      {activeTab === 'sleep' && (
        <div className="flex flex-col gap-4">
          {/* Bedtime Status Banner */}
          <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-slate-200/80 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Moon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Bedtime Mode &amp; Screen Blanking</h3>
                  <span className="text-[11px] text-neutral-400">
                    {isBedtimeActivated
                      ? isPhoneBlank
                        ? 'Phone is Blank · Internet Disabled'
                        : `Bedtime Active · Blanks in ${formatCountdown(bedtimeTimerSeconds)}`
                      : 'Inactive · Ready for Sleep'}
                  </span>
                </div>
              </div>

              <span
                className={`w-3 h-3 rounded-full ${
                  isBedtimeActivated ? 'bg-indigo-400 shadow-[0_0_8px_#818cf8] animate-pulse' : 'bg-neutral-600'
                }`}
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => {
                  if (isBedtimeActivated) {
                    deactivateBedtime(true);
                  } else {
                    activateBedtime(true);
                  }
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                  isBedtimeActivated
                    ? 'bg-rose-600 text-white hover:bg-rose-500'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                <Moon size={13} />
                <span>{isBedtimeActivated ? 'Exit Bedtime' : 'Activate Bedtime'}</span>
              </button>

              <button
                onClick={() => {
                  soundHaptics.playClick(1000, 0.08);
                  setIsBedtimeActivated(true);
                  setIsPhoneBlank(true);
                }}
                className="py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                title="Immediately blank the phone screen to test bedtime downtime"
              >
                <WifiOff size={13} />
                <span>Test 30m Blank Now</span>
              </button>
            </div>

            {/* Wake Up Morning Simulation */}
            <button
              onClick={triggerWakeUpMorning}
              className="w-full mt-2 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Sun size={14} className="text-amber-400" />
              <span>Simulate 06:00 AM (&quot;Hello {userName} it&apos;s morning, wake up&quot;)</span>
            </button>
          </div>

          {/* Edit Sleeping Time (When to sleep & When to wake) */}
          <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-slate-200/80 dark:border-white/5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 mb-2">
              Edit Sleep Schedule
            </h3>
            <p className="text-xs text-neutral-400 mb-3">
              Customize when you go to bed and wake up. 30 minutes after bedtime activates, the screen goes blank and internet access is disabled.
            </p>

            <form onSubmit={handleSaveSchedule} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-100 dark:bg-neutral-800 p-2.5 rounded-xl border border-slate-200 dark:border-neutral-700">
                  <label className="text-[10px] font-bold text-neutral-400 block uppercase font-mono">
                    Bedtime
                  </label>
                  <input
                    type="time"
                    value={bedtimeInput}
                    onChange={(e) => setBedtimeInput(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-slate-900 dark:text-white focus:outline-none mt-1"
                  />
                </div>

                <div className="bg-slate-100 dark:bg-neutral-800 p-2.5 rounded-xl border border-slate-200 dark:border-neutral-700">
                  <label className="text-[10px] font-bold text-neutral-400 block uppercase font-mono">
                    Wake Up Time
                  </label>
                  <input
                    type="time"
                    value={wakeUpInput}
                    onChange={(e) => setWakeUpInput(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-slate-900 dark:text-white focus:outline-none mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                <span>Blank Screen Delay: <strong className="text-white">30 minutes</strong></span>
                <span>Internet Auto-Disable: <strong className="text-emerald-400">Enabled</strong></span>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
              >
                {saveSuccess ? <Check size={14} /> : null}
                <span>{saveSuccess ? 'Schedule Saved' : 'Save Sleep Schedule'}</span>
              </button>
            </form>
          </div>

          {/* Important VIP People (Allowed to call & message during bedtime blank) */}
          <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-slate-200/80 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                  Important VIP People Filter
                </h3>
                <span className="text-[11px] text-neutral-400">
                  Only calls &amp; messages from these contacts can come in while phone is blank
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddVIP(!showAddVIP)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800 text-indigo-400 hover:text-indigo-300"
              >
                <UserPlus size={16} />
              </button>
            </div>

            {showAddVIP && (
              <form onSubmit={handleAddVIP} className="flex gap-2 my-2">
                <input
                  type="text"
                  placeholder="Contact Name (e.g., Mom)"
                  value={newVIPName}
                  onChange={(e) => setNewVIPName(e.target.value)}
                  className="flex-1 bg-slate-100 dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  Add
                </button>
              </form>
            )}

            <div className="flex flex-col gap-1.5 mt-2">
              {sleepSchedule.vipContacts.map((contact, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700/60 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                      VIP
                    </div>
                    <span className="font-semibold">{contact}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveVIP(idx)}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-bold px-2 py-0.5 rounded-lg bg-rose-500/10"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WALKING STEPS & TIMING */}
      {activeTab === 'steps' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-5 border border-slate-200/80 dark:border-white/5 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-2 shadow-inner">
              <Footprints size={32} />
            </div>
            <span className="text-3xl font-black">{healthData.steps.toLocaleString()}</span>
            <span className="text-xs text-neutral-400 font-mono">
              of {healthData.stepsGoal.toLocaleString()} daily steps goal
            </span>

            {/* Pedometer Metric Stats */}
            <div className="grid grid-cols-3 gap-3 w-full mt-5 pt-4 border-t border-slate-100 dark:border-neutral-800 text-center">
              <div>
                <span className="text-base font-bold">{healthData.walkingMinutes} min</span>
                <span className="text-[10px] text-neutral-400 block uppercase font-mono">Active Timing</span>
              </div>
              <div>
                <span className="text-base font-bold">{healthData.walkingMiles} mi</span>
                <span className="text-[10px] text-neutral-400 block uppercase font-mono">Distance</span>
              </div>
              <div>
                <span className="text-base font-bold">{healthData.caloriesBurned} kcal</span>
                <span className="text-[10px] text-neutral-400 block uppercase font-mono">Burned</span>
              </div>
            </div>

            {/* Toggle Walking Workout Tracking */}
            <button
              onClick={toggleWalkingWorkout}
              className={`w-full mt-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 ${
                healthData.isWalkingActive
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {healthData.isWalkingActive ? <Pause size={14} /> : <Play size={14} />}
              <span>{healthData.isWalkingActive ? 'Pause Walking Workout' : 'Start Walking Workout Tracker'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: HYDRATION */}
      {activeTab === 'water' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-5 border border-slate-200/80 dark:border-white/5 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-sky-500/15 border border-sky-500/40 text-sky-400 flex items-center justify-center mb-2 shadow-inner">
              <Droplets size={32} />
            </div>
            <span className="text-3xl font-black">{healthData.waterGlasses} of {healthData.waterGoal} Glasses</span>
            <span className="text-xs text-neutral-400 font-mono">
              Daily Target: {healthData.waterGoal * 250} ml (approx 2 Litres)
            </span>

            {/* Visual Glass Row */}
            <div className="flex items-center gap-2 my-4">
              {Array.from({ length: healthData.waterGoal }).map((_, i) => (
                <div
                  key={i}
                  className={`w-7 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    i < healthData.waterGlasses
                      ? 'bg-sky-500 text-white shadow-[0_0_8px_#38bdf8]'
                      : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                  }`}
                >
                  🥛
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 w-full mt-2">
              <button
                onClick={logWaterGlass}
                className="py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <Droplets size={14} />
                <span>+ Log 1 Glass</span>
              </button>
              <button
                onClick={askWaterPrompt}
                className="py-2.5 bg-neutral-800 hover:bg-neutral-700 text-sky-300 border border-neutral-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Volume2 size={14} />
                <span>Prompt Question</span>
              </button>
            </div>
          </div>

          {/* Hydration Facts & Benefits Card */}
          <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-slate-200/80 dark:border-white/5 shadow-sm text-xs text-neutral-300 flex flex-col gap-2">
            <span className="font-bold text-sky-400 uppercase tracking-wider text-[10px] font-mono">
              Scientific Importance of Morning Water
            </span>
            <p className="leading-relaxed">
              Drinking water right after waking up restores hydration lost during 7-8 hours of sleep, stimulates bowel movement, fuels muscle building, and elevates alertness without the caffeine crash.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
