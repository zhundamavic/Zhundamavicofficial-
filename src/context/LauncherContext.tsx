import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  AppId,
  AppDefinition,
  IconStyle,
  IconSize,
  WallpaperOption,
  DynamicIslandState,
  CameraControlConfig,
  NotificationItem,
  BootState,
  MavicMessage,
  MavicOrbState,
  MavicOnlineResponse,
  AlarmItem,
  ScheduleItem,
  SleepScheduleConfig,
  HealthData,
  CustomWidget,
  WidgetType,
} from '../types/launcher';
import { soundHaptics } from '../utils/haptics';
import { mavicSpeech } from '../utils/mavicAssistantEngine';

export const WALLPAPERS: WallpaperOption[] = [
  {
    id: 'iphone16-default',
    name: 'iPhone 16 Vibrant',
    type: 'image',
    url: '/src/assets/images/iphone16_default_wallpaper_1791853744695.jpg',
    thumbBg: '#1e1b4b',
  },
  {
    id: 'iphone16-titanium',
    name: 'Dark Titanium',
    type: 'image',
    url: '/src/assets/images/iphone16_dark_titanium_1791853745427.jpg',
    thumbBg: '#18181b',
  },
  {
    id: 'ios18-neon-dusk',
    name: 'Neon Dusk',
    type: 'image',
    url: '/src/assets/images/ios18_neon_dusk_1791853743681.jpg',
    thumbBg: '#0f172a',
  },
  {
    id: 'astral-purple',
    name: 'Astral Purple',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #18052e 0%, #2e0854 45%, #601275 80%, #991b8f 100%)',
    thumbBg: '#4c1d95',
  },
  {
    id: 'ocean-depth',
    name: 'Deep Pacific',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #021b34 0%, #063970 40%, #086b9e 75%, #06a4b3 100%)',
    thumbBg: '#0369a1',
  },
];

export const APPS: AppDefinition[] = [
  { id: 'phone', name: 'Phone', iconBg: 'bg-emerald-500', category: 'Social', badge: 1, notificationSnippet: 'Missed Call from Sarah' },
  { id: 'safari', name: 'Safari', iconBg: 'bg-sky-500', category: 'Utilities' },
  { id: 'messages', name: 'Messages', iconBg: 'bg-emerald-500', category: 'Social', badge: 3, notificationSnippet: 'Alex: Hey! Check out this link' },
  { id: 'music', name: 'Music', iconBg: 'bg-rose-500', category: 'Entertainment' },
  { id: 'camera', name: 'Camera', iconBg: 'bg-neutral-800', category: 'Creativity' },
  { id: 'photos', name: 'Photos', iconBg: 'bg-amber-400', category: 'Creativity' },
  { id: 'weather', name: 'Weather', iconBg: 'bg-sky-400', category: 'Information' },
  { id: 'clock', name: 'Clock', iconBg: 'bg-black', category: 'Utilities' },
  { id: 'calculator', name: 'Calculator', iconBg: 'bg-neutral-900', category: 'Utilities' },
  { id: 'notes', name: 'Notes', iconBg: 'bg-amber-500', category: 'Productivity' },
  { id: 'settings', name: 'Settings', iconBg: 'bg-slate-500', category: 'Utilities' },
  { id: 'maps', name: 'Maps', iconBg: 'bg-emerald-400', category: 'Information' },
  { id: 'reminders', name: 'Reminders', iconBg: 'bg-blue-600', category: 'Productivity', badge: 2 },
  { id: 'health', name: 'Health', iconBg: 'bg-rose-600', category: 'Productivity' },
  { id: 'appstore', name: 'App Store', iconBg: 'bg-blue-500', category: 'Utilities' },
  { id: 'files', name: 'Files', iconBg: 'bg-sky-600', category: 'Utilities' },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    appId: 'messages',
    title: 'Messages · Alex',
    message: 'Did you see the new Camera Control button on iPhone 16? It feels so smooth!',
    timeAgo: '2m ago',
    iconBg: 'bg-emerald-500',
  },
  {
    id: 'n2',
    appId: 'phone',
    title: 'Phone',
    message: 'Missed Call from Sarah Miller (Mobile)',
    timeAgo: '14m ago',
    iconBg: 'bg-emerald-500',
  },
  {
    id: 'n3',
    appId: 'reminders',
    title: 'Reminders',
    message: 'Pick up groceries & review quarterly plan',
    timeAgo: '1h ago',
    iconBg: 'bg-blue-500',
  },
];

interface LauncherContextType {
  // User Name & Boot Sequence
  userName: string;
  setUserName: (name: string) => void;
  bootState: BootState;
  setBootState: (state: BootState) => void;
  replayBootSequence: () => void;
  isStockLauncherDisabled: boolean;
  setIsStockLauncherDisabled: (disabled: boolean) => void;

  screenState: 'locked' | 'home' | 'app';
  setScreenState: (state: 'locked' | 'home' | 'app') => void;
  activeAppId: AppId | null;
  openApp: (id: AppId) => void;
  closeApp: () => void;
  activeWallpaper: WallpaperOption;
  setWallpaper: (wallpaper: WallpaperOption) => void;
  iconStyle: IconStyle;
  setIconStyle: (style: IconStyle) => void;
  tintColor: string;
  setTintColor: (color: string) => void;
  iconSize: IconSize;
  setIconSize: (size: IconSize) => void;
  deviceMode: 'frame' | 'fullscreen';
  setDeviceMode: (mode: 'frame' | 'fullscreen') => void;
  
  // Dynamic Island
  dynamicIsland: DynamicIslandState;
  setDynamicIsland: React.Dispatch<React.SetStateAction<DynamicIslandState>>;
  expandDynamicIsland: () => void;
  collapseDynamicIsland: () => void;
  startLiveTimer: (seconds: number, label?: string) => void;
  cancelLiveTimer: () => void;
  toggleMediaPlayback: () => void;
  
  // Camera Control (iPhone 16)
  cameraControl: CameraControlConfig;
  setCameraControl: React.Dispatch<React.SetStateAction<CameraControlConfig>>;
  adjustCameraZoom: (zoom: number) => void;
  cycleCameraControlMode: () => void;
  
  // Overlays
  isControlCenterOpen: boolean;
  setIsControlCenterOpen: (open: boolean) => void;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  isSpotlightOpen: boolean;
  setIsSpotlightOpen: (open: boolean) => void;
  isCustomizingHome: boolean;
  setIsCustomizingHome: (open: boolean) => void;
  
  // Notifications
  notifications: NotificationItem[];
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // System Controls
  brightness: number;
  setBrightness: (b: number) => void;
  volume: number;
  setVolume: (v: number) => void;
  isFlashlightOn: boolean;
  toggleFlashlight: () => void;
  flashlightIntensity: number;
  setFlashlightIntensity: (val: number) => void;
  focusMode: 'None' | 'Do Not Disturb' | 'Work' | 'Sleep';
  setFocusMode: (f: 'None' | 'Do Not Disturb' | 'Work' | 'Sleep') => void;
  isLowPowerMode: boolean;
  setIsLowPowerMode: (b: boolean) => void;
  
  // Time and Date
  currentTime: Date;
  batteryLevel: number;

  // Mavic Voice & Device Assistant
  isMavicOnline: boolean;
  setIsMavicOnline: (val: boolean) => void;
  isMavicListening: boolean;
  startMavicListening: () => void;
  stopMavicListening: () => void;
  isMavicSheetOpen: boolean;
  setIsMavicSheetOpen: (open: boolean) => void;
  mavicMessages: MavicMessage[];
  executeMavicCommand: (rawInput: string) => void;
  awaitingUserName: boolean;

  // Rolling Colors Orb & Transparent Floating Response Page
  orbState: MavicOrbState;
  setOrbState: (state: MavicOrbState) => void;
  isInternetConnected: boolean;
  setIsInternetConnected: (val: boolean) => void;
  mavicOnlineResponse: MavicOnlineResponse | null;
  triggerMavicOrb: () => void;
  executeMavicOrbCommand: (cmd: string) => void;

  // Health Tracking & Hydration
  healthData: HealthData;
  updateHealthData: (patch: Partial<HealthData>) => void;
  toggleWalkingWorkout: () => void;
  logWaterGlass: () => void;
  waterPromptActive: boolean;
  setWaterPromptActive: (active: boolean) => void;
  askWaterPrompt: () => void;
  respondWaterPrompt: (hasDrunk: boolean) => void;

  // Sleep Schedule & Automatic Phone Blank
  sleepSchedule: SleepScheduleConfig;
  setSleepSchedule: (cfg: SleepScheduleConfig) => void;
  isBedtimeActivated: boolean;
  setIsBedtimeActivated: (b: boolean) => void;
  activateBedtime: (speak?: boolean) => void;
  deactivateBedtime: (speak?: boolean) => void;
  isPhoneBlank: boolean;
  setIsPhoneBlank: (blank: boolean) => void;
  bedtimeTimerSeconds: number;
  triggerWakeUpMorning: () => void;
  simulateVIPCall: () => void;
  vipIncomingCall: { caller: string; number: string; active: boolean } | null;
  dismissVIPCall: () => void;

  // Alarms & Schedules
  alarms: AlarmItem[];
  setAlarms: React.Dispatch<React.SetStateAction<AlarmItem[]>>;
  schedules: ScheduleItem[];
  setSchedules: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  speakAlarms: () => void;
  speakSchedules: () => void;

  // 3-times daily Weather Forecast
  weatherTimeOfDay: 'morning' | 'afternoon' | 'evening';
  setWeatherTimeOfDay: (tod: 'morning' | 'afternoon' | 'evening') => void;
  speakWeatherForecast: (timeOfDay?: 'morning' | 'afternoon' | 'evening') => void;

  // Multitasking & App Switcher (Recently opened apps)
  recentApps: AppId[];
  isAppSwitcherOpen: boolean;
  setIsAppSwitcherOpen: (open: boolean) => void;
  closeRecentApp: (id: AppId) => void;
  clearAllRecentApps: () => void;

  // Home Screen Editing & Widget Management (Jiggle mode & create widgets)
  isJiggleMode: boolean;
  setIsJiggleMode: (jiggle: boolean) => void;
  isWidgetModalOpen: boolean;
  setIsWidgetModalOpen: (open: boolean) => void;
  homeWidgets: CustomWidget[];
  addWidget: (type: WidgetType, size?: 'small' | 'medium' | 'large', title?: string) => void;
  removeWidget: (id: string) => void;
}

const LauncherContext = createContext<LauncherContextType | null>(null);

export const LauncherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User name stored in localStorage
  const [userName, setUserNameState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mavic_user_name') || 'Marvellous';
    }
    return 'Marvellous';
  });

  const setUserName = (name: string) => {
    const clean = name.trim() || 'Marvellous';
    setUserNameState(clean);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mavic_user_name', clean);
    }
  };

  // Boot state: 'booting' -> 'welcome' -> 'ready'
  const [bootState, setBootState] = useState<BootState>('booting');
  const [isStockLauncherDisabled, setIsStockLauncherDisabled] = useState(true);

  const [screenState, setScreenState] = useState<'locked' | 'home' | 'app'>('home');
  const [activeAppId, setActiveAppId] = useState<AppId | null>(null);
  const [activeWallpaper, setActiveWallpaper] = useState<WallpaperOption>(WALLPAPERS[0]);
  const [iconStyle, setIconStyle] = useState<IconStyle>('default');
  const [tintColor, setTintColor] = useState<string>('#38bdf8'); // Sky tint
  const [iconSize, setIconSize] = useState<IconSize>('standard');
  const [deviceMode, setDeviceMode] = useState<'frame' | 'fullscreen'>('frame');

  // Dynamic Island
  const [dynamicIsland, setDynamicIsland] = useState<DynamicIslandState>({
    type: 'media',
    isExpanded: false,
    mavicOnline: true, // Green dot on standby
    media: {
      title: 'Espresso',
      artist: 'Sabrina Carpenter',
      album: 'Short n’ Sweet',
      isPlaying: true,
      duration: 175,
      currentTime: 42,
      coverColor: '#f97316',
    },
    timer: {
      totalSeconds: 300,
      remainingSeconds: 240,
      isRunning: false,
      label: 'Tea Timer',
    },
  });

  // Camera Control state
  const [cameraControl, setCameraControl] = useState<CameraControlConfig>({
    activeMode: 'zoom',
    zoom: 1.0,
    exposure: 0.0,
    style: 'Standard',
    depth: 2.8,
    isOpen: false,
  });

  // Overlays
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isCustomizingHome, setIsCustomizingHome] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // System controls
  const [brightness, setBrightness] = useState(85);
  const [volume, setVolume] = useState(70);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [flashlightIntensity, setFlashlightIntensity] = useState(80);
  const [focusMode, setFocusMode] = useState<'None' | 'Do Not Disturb' | 'Work' | 'Sleep'>('None');
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  // Time & Battery
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel] = useState(94);

  // Mavic Voice Assistant State
  const [isMavicOnline, setIsMavicOnline] = useState(true);
  const [isMavicListening, setIsMavicListening] = useState(false);
  const [isMavicSheetOpen, setIsMavicSheetOpen] = useState(false);
  const [awaitingUserName, setAwaitingUserName] = useState(false);
  const [mavicMessages, setMavicMessages] = useState<MavicMessage[]>([
    {
      id: 'init-1',
      sender: 'mavic',
      text: `Hello ${userName}! I'm MAVIC, your offline system assistant with full device control. Say "Hi Mavic" or tap to command me.`,
      timestamp: 'Now',
    },
  ]);

  // Rolling Colors Orb & Transparent Floating Response Page State
  const [orbState, setOrbState] = useState<MavicOrbState>('hidden');
  const [isInternetConnected, setIsInternetConnected] = useState<boolean>(true);
  const [mavicOnlineResponse, setMavicOnlineResponse] = useState<MavicOnlineResponse | null>(null);

  // Health Tracking Data
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 7420,
    stepsGoal: 10000,
    walkingMinutes: 54,
    walkingMiles: 3.4,
    caloriesBurned: 310,
    isWalkingActive: false,
    waterGlasses: 5,
    waterGoal: 8,
    sleepHours: 7.5,
    heartRate: 72,
  });

  // Water Hydration Prompt
  const [waterPromptActive, setWaterPromptActive] = useState<boolean>(false);

  // Sleep Schedule & Bedtime Blanking
  const [sleepSchedule, setSleepScheduleState] = useState<SleepScheduleConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mavic_sleep_schedule');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      bedtime: '22:30',
      wakeUpTime: '06:00',
      blankDelayMinutes: 30,
      autoDisableInternet: true,
      vipContacts: ['Mom (VIP)', 'Dr. Edwards (VIP)', 'Emergency Services (VIP)'],
    };
  });

  const setSleepSchedule = (cfg: SleepScheduleConfig) => {
    setSleepScheduleState(cfg);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mavic_sleep_schedule', JSON.stringify(cfg));
    }
  };

  const [isBedtimeActivated, setIsBedtimeActivated] = useState<boolean>(false);
  const [isPhoneBlank, setIsPhoneBlank] = useState<boolean>(false);
  const [bedtimeTimerSeconds, setBedtimeTimerSeconds] = useState<number>(30 * 60);
  const [vipIncomingCall, setVipIncomingCall] = useState<{ caller: string; number: string; active: boolean } | null>(null);

  // Alarms & Schedules
  const [alarms, setAlarms] = useState<AlarmItem[]>([
    { id: 'alarm-1', time: '06:00 AM', label: 'Morning Wake Up Alarm', enabled: true },
    { id: 'alarm-2', time: '07:30 AM', label: 'Morning Hydration & Walk', enabled: true },
  ]);

  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    { id: 'sch-1', time: '09:00 AM', title: 'Product Architecture Review', category: 'work' },
    { id: 'sch-2', time: '01:00 PM', title: 'Hydration & Nutrition Check', category: 'health' },
    { id: 'sch-3', time: '04:30 PM', title: 'Outdoor Walking Session', category: 'wellness' },
    { id: 'sch-4', time: '10:30 PM', title: 'Bedtime Downtime & Offline Sleep', category: 'sleep' },
  ]);

  // 3-times daily Weather Forecast
  const [weatherTimeOfDay, setWeatherTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  const awaitingUserNameRef = useRef(awaitingUserName);
  awaitingUserNameRef.current = awaitingUserName;

  const userNameRef = useRef(userName);
  userNameRef.current = userName;

  const orbStateRef = useRef(orbState);
  orbStateRef.current = orbState;

  const isInternetConnectedRef = useRef(isInternetConnected);
  isInternetConnectedRef.current = isInternetConnected;

  const healthDataRef = useRef(healthData);
  healthDataRef.current = healthData;

  const sleepScheduleRef = useRef(sleepSchedule);
  sleepScheduleRef.current = sleepSchedule;

  // Handle boot sequence timing
  useEffect(() => {
    const t1 = setTimeout(() => {
      setBootState('welcome');
      const t2 = setTimeout(() => {
        setBootState('ready');
      }, 2400);
      return () => clearTimeout(t2);
    }, 1800);
    return () => clearTimeout(t1);
  }, []);

  const replayBootSequence = () => {
    soundHaptics.playClick(900, 0.08);
    setBootState('booting');
    setTimeout(() => {
      setBootState('welcome');
      setTimeout(() => {
        setBootState('ready');
      }, 2400);
    }, 1800);
  };

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update Dynamic Island media track progress & timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicIsland((prev) => {
        let updated = { ...prev };
        
        if (prev.media?.isPlaying) {
          const nextTime = (prev.media.currentTime + 1) % prev.media.duration;
          updated = {
            ...updated,
            media: {
              ...prev.media,
              currentTime: nextTime,
            },
          };
        }

        if (prev.timer?.isRunning && prev.timer.remainingSeconds > 0) {
          const nextSec = prev.timer.remainingSeconds - 1;
          updated = {
            ...updated,
            timer: {
              ...prev.timer,
              remainingSeconds: nextSec,
              isRunning: nextSec > 0,
            },
          };
          if (nextSec === 0) {
            soundHaptics.playDialTone(880);
          }
        }

        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Walking workout ticker
  useEffect(() => {
    if (!healthData.isWalkingActive) return;
    const interval = setInterval(() => {
      setHealthData((prev) => {
        const nextSteps = prev.steps + 2;
        const nextMinutes = prev.walkingMinutes + 1 / 60;
        const nextMiles = parseFloat((prev.walkingMiles + 0.001).toFixed(3));
        const nextCal = prev.caloriesBurned + 0.1;
        return {
          ...prev,
          steps: nextSteps,
          walkingMinutes: Math.round(nextMinutes),
          walkingMiles: nextMiles,
          caloriesBurned: Math.round(nextCal),
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [healthData.isWalkingActive]);

  // Bedtime blank countdown timer (30 minutes after activation)
  useEffect(() => {
    if (!isBedtimeActivated || isPhoneBlank) return;
    const timer = setInterval(() => {
      setBedtimeTimerSeconds((prev) => {
        if (prev <= 1) {
          setIsPhoneBlank(true);
          setIsInternetConnected(false); // Disable internet access automatically during sleep
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isBedtimeActivated, isPhoneBlank]);

  // Bedtime mode helpers
  const activateBedtime = (speak: boolean = true) => {
    soundHaptics.playClick(900, 0.08);
    setIsBedtimeActivated(true);
    setBedtimeTimerSeconds(sleepSchedule.blankDelayMinutes * 60);
    if (speak) {
      const msg = `Goodnight ${userNameRef.current}. Bedtime mode is activated. Your phone will automatically go blank in ${sleepSchedule.blankDelayMinutes} minutes. Internet will be turned off and only calls and messages from your important VIP contacts can come in. Rest well.`;
      mavicSpeech.speak(msg);
    }
  };

  const deactivateBedtime = (speak: boolean = true) => {
    soundHaptics.playClick(800, 0.05);
    setIsBedtimeActivated(false);
    setIsPhoneBlank(false);
    setIsInternetConnected(true);
    if (speak) {
      mavicSpeech.speak(`Bedtime mode ended. Internet connectivity restored.`);
    }
  };

  const triggerWakeUpMorning = () => {
    soundHaptics.playClick(1000, 0.08);
    setIsBedtimeActivated(false);
    setIsPhoneBlank(false);
    setIsInternetConnected(true); // at wake up time enable access to the Internet
    const msg = `hello ${userNameRef.current} its morning, wake up`;
    mavicSpeech.speak(msg);
    soundHaptics.playDialTone(880);
  };

  const simulateVIPCall = () => {
    soundHaptics.playDialTone(520);
    setVipIncomingCall({
      caller: sleepSchedule.vipContacts[0] || 'Mom (VIP)',
      number: '+1 (555) 234-5678',
      active: true,
    });
  };

  const dismissVIPCall = () => {
    soundHaptics.playClick(700, 0.05);
    setVipIncomingCall(null);
  };

  // Health helpers
  const updateHealthData = (patch: Partial<HealthData>) => {
    setHealthData((prev) => ({ ...prev, ...patch }));
  };

  const toggleWalkingWorkout = () => {
    soundHaptics.playClick(950, 0.06);
    setHealthData((prev) => {
      const active = !prev.isWalkingActive;
      if (active) {
        mavicSpeech.speak(`Walking workout tracking started. Enjoy your steps, ${userNameRef.current}!`);
      } else {
        mavicSpeech.speak(`Walking workout paused.`);
      }
      return { ...prev, isWalkingActive: active };
    });
  };

  const logWaterGlass = () => {
    soundHaptics.playClick(1100, 0.07);
    setHealthData((prev) => {
      const updated = Math.min(prev.waterGoal + 4, prev.waterGlasses + 1);
      return { ...prev, waterGlasses: updated };
    });
    mavicSpeech.speak(`Logged 1 glass of water. Keep staying refreshed, ${userNameRef.current}!`);
  };

  const askWaterPrompt = () => {
    setWaterPromptActive(true);
    soundHaptics.playClick(1100, 0.08);
    const question = `hi ${userNameRef.current} have you taken water this morning`;
    mavicSpeech.speak(question);
  };

  const respondWaterPrompt = (hasDrunk: boolean) => {
    setWaterPromptActive(false);
    soundHaptics.playClick(1000, 0.06);
    if (hasDrunk) {
      setHealthData((prev) => ({ ...prev, waterGlasses: prev.waterGlasses + 1 }));
      const msg = `Wonderful job, ${userNameRef.current}! Drinking water in the morning rehydrates your vital organs, boosts your metabolism by 30 percent, flushes out toxins, and gives your brain energy for the day. Hydration is key to high performance!`;
      mavicSpeech.speak(msg);
    } else {
      const msg = `Please grab a fresh glass of water right now, ${userNameRef.current}. Your body lost fluids while you slept, and drinking water now will eliminate fatigue and give you an immediate mental boost.`;
      mavicSpeech.speak(msg);
    }
  };

  // Audio Alarms & Schedules Speech
  const speakAlarms = () => {
    soundHaptics.playClick(900, 0.06);
    const activeAlarms = alarms.filter((a) => a.enabled);
    if (activeAlarms.length === 0) {
      mavicSpeech.speak(`You currently have no active alarms, ${userNameRef.current}.`);
    } else {
      const list = activeAlarms.map((a) => `${a.time} for ${a.label}`).join(', and ');
      mavicSpeech.speak(`You have ${activeAlarms.length} active alarms, ${userNameRef.current}: ${list}.`);
    }
  };

  const speakSchedules = () => {
    soundHaptics.playClick(900, 0.06);
    const list = schedules.map((s) => `at ${s.time}, ${s.title}`).join('. Next, ');
    mavicSpeech.speak(`Here is your schedule for today, ${userNameRef.current}: ${list}.`);
  };

  const speakWeatherForecast = (tod?: 'morning' | 'afternoon' | 'evening') => {
    const targetTod = tod || weatherTimeOfDay;
    soundHaptics.playClick(950, 0.06);
    if (targetTod === 'morning') {
      mavicSpeech.speak(`Good morning, ${userNameRef.current}. Morning weather is crisp and clear at 64 degrees Fahrenheit with gentle sunrise winds.`);
    } else if (targetTod === 'afternoon') {
      mavicSpeech.speak(`Good afternoon, ${userNameRef.current}. The afternoon forecast is warm and sunny at 77 degrees Fahrenheit under bright blue skies.`);
    } else {
      mavicSpeech.speak(`Good evening, ${userNameRef.current}. Evening weather is 68 degrees Fahrenheit with a cool twilight breeze and golden skies.`);
    }
  };

  const openApp = (id: AppId) => {
    soundHaptics.playClick(900, 0.06);
    setActiveAppId(id);
    setScreenState('app');
    setIsControlCenterOpen(false);
    setIsNotificationCenterOpen(false);
    setIsSpotlightOpen(false);
    setIsCustomizingHome(false);
  };

  const closeApp = () => {
    soundHaptics.playClick(700, 0.05);
    setActiveAppId(null);
    setScreenState('home');
  };

  const expandDynamicIsland = () => {
    soundHaptics.playClick(1050, 0.07);
    setDynamicIsland((prev) => ({ ...prev, isExpanded: true }));
  };

  const collapseDynamicIsland = () => {
    soundHaptics.playClick(800, 0.05);
    setDynamicIsland((prev) => ({ ...prev, isExpanded: false }));
  };

  const startLiveTimer = (seconds: number, label: string = 'Timer') => {
    soundHaptics.playClick(1200, 0.08);
    setDynamicIsland((prev) => ({
      ...prev,
      type: 'timer',
      timer: {
        totalSeconds: seconds,
        remainingSeconds: seconds,
        isRunning: true,
        label,
      },
    }));
  };

  const cancelLiveTimer = () => {
    soundHaptics.playClick(600, 0.05);
    setDynamicIsland((prev) => ({
      ...prev,
      type: prev.media?.isPlaying ? 'media' : 'idle',
      timer: prev.timer ? { ...prev.timer, isRunning: false, remainingSeconds: 0 } : undefined,
    }));
  };

  const toggleMediaPlayback = () => {
    soundHaptics.playClick(900, 0.06);
    setDynamicIsland((prev) => {
      if (!prev.media) return prev;
      const willPlay = !prev.media.isPlaying;
      return {
        ...prev,
        type: willPlay ? 'media' : (prev.timer?.isRunning ? 'timer' : 'idle'),
        media: {
          ...prev.media,
          isPlaying: willPlay,
        },
      };
    });
  };

  const adjustCameraZoom = (zoom: number) => {
    soundHaptics.playCameraControlTick();
    setCameraControl((prev) => ({ ...prev, zoom }));
  };

  const cycleCameraControlMode = () => {
    soundHaptics.playClick(1100, 0.06);
    const modes: CameraControlConfig['activeMode'][] = ['zoom', 'exposure', 'styles', 'depth'];
    setCameraControl((prev) => {
      const currIdx = modes.indexOf(prev.activeMode);
      const nextIdx = (currIdx + 1) % modes.length;
      return { ...prev, activeMode: modes[nextIdx] };
    });
  };

  const toggleFlashlight = () => {
    soundHaptics.playClick(850, 0.08);
    setIsFlashlightOn((prev) => !prev);
  };

  const dismissNotification = (id: string) => {
    soundHaptics.playClick(650, 0.04);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    soundHaptics.playClick(600, 0.05);
    setNotifications([]);
  };

  // TRIGGER ROLLING COLORS ORB AT BOTTOM OF PHONE WHEN DYNAMIC ISLAND IS TAPPED
  const triggerMavicOrb = () => {
    soundHaptics.playClick(1050, 0.08);
    // Don't open any sheet or page!
    setIsMavicSheetOpen(false);
    setOrbState('listening');

    const greeting = `${userNameRef.current}, speak I'm listening`;
    mavicSpeech.speak(greeting);
    mavicSpeech.startListening();
  };

  // EXECUTE COMMAND WHEN USER GIVES COMMAND TO ORB
  const executeMavicOrbCommand = (rawInput: string) => {
    const text = rawInput.trim();
    if (!text) return;

    soundHaptics.playClick(1000, 0.06);
    const lower = text.toLowerCase();

    // 1. Direct App Navigation & System Control (Siri / Alexa behavior)
    if (lower.includes('open settings') || lower.includes('go to settings') || lower.includes('launch settings')) {
      openApp('settings');
      const speech = `Opening Settings for you, ${userNameRef.current}.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    if (lower.includes('open camera') || lower.includes('go to camera') || lower.includes('launch camera') || lower.includes('take a photo') || lower.includes('take photo')) {
      openApp('camera');
      const speech = `Launching Camera, ${userNameRef.current}.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    if (lower.includes('open photos') || lower.includes('go to photos') || lower.includes('view photos')) {
      openApp('photos');
      const speech = `Opening your Photos gallery.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    if (lower.includes('open weather') || lower.includes('go to weather') || lower.includes('check weather')) {
      openApp('weather');
      const speech = `Opening Weather. San Francisco is 74 degrees and sunny.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    if (lower.includes('open calculator') || lower.includes('launch calculator')) {
      openApp('calculator');
      const speech = `Opening Calculator.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    if (lower.includes('open safari') || lower.includes('open browser') || lower.includes('go to safari')) {
      openApp('safari');
      const speech = `Opening Safari browser.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    if (lower.includes('open clock') || lower.includes('go to clock') || lower.includes('open timer')) {
      openApp('clock');
      const speech = `Opening Clock and Timer.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    if (lower.includes('open messages') || lower.includes('go to messages') || lower.includes('check messages')) {
      openApp('messages');
      const speech = `Opening Messages.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    if (lower.includes('open phone') || lower.includes('go to phone') || lower.includes('dial')) {
      openApp('phone');
      const speech = `Opening Phone dialer.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    if (lower.includes('open music') || lower.includes('go to music')) {
      openApp('music');
      const speech = `Launching Apple Music.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    if (lower.includes('open notes') || lower.includes('go to notes')) {
      openApp('notes');
      const speech = `Opening Notes.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    if (lower.includes('open reminders') || lower.includes('go to reminders')) {
      openApp('reminders');
      const speech = `Opening your Reminders checklist.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    if (lower.includes('open control center') || lower.includes('control center')) {
      setIsControlCenterOpen(true);
      const speech = `Opening Control Center.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    if (lower.includes('open notifications') || lower.includes('notification center')) {
      setIsNotificationCenterOpen(true);
      const speech = `Opening Notification Center.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    if (lower.includes('lock phone') || lower.includes('lock screen')) {
      setScreenState('locked');
      const speech = `Phone locked.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    if (lower.includes('go home') || lower.includes('go to home') || lower.includes('close app')) {
      closeApp();
      const speech = `Returning to home screen.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    if (lower.includes('open health') || lower.includes('go to health') || lower.includes('sleep tracker') || lower.includes('track health')) {
      openApp('health');
      const speech = `Opening Health. Tracking your sleep schedule, steps, and hydration.`;
      mavicSpeech.speak(speech);
      setOrbState('hidden');
      return;
    }

    // Mental health & depression empathetic guidance
    if (lower.includes('depress') || lower.includes('sad') || lower.includes('unhappy') || lower.includes('hopeless') || lower.includes('feeling down') || lower.includes('anxious') || lower.includes('what can i do')) {
      const speech = `I hear you, ${userNameRef.current}, and I want you to know you are not alone. Here is what you can do right now to feel better: First, take three slow deep breaths. Second, drink a glass of fresh water to ground your body. Third, step outside into gentle natural daylight or take a short walk. Reach out to a loved one like ${sleepScheduleRef.current.vipContacts[0] || 'a close friend'} to talk. You can also dial or text 988 anytime for free caring support. I am right here with you.`;
      mavicSpeech.speak(speech);
      setOrbState('display_online');
      setMavicOnlineResponse({
        query: text,
        speechText: speech,
        actionDescription: 'Emotional Wellness Guidance & Care',
        files: [
          { name: '4_7_8_Breathing_Exercises.pdf', size: '1.1 MB', type: 'Health Guide', date: 'Mavic OS' },
          { name: 'Mindfulness_Grounding_Protocol.pdf', size: '920 KB', type: 'Wellness Protocol', date: 'Available Offline' },
        ],
        links: [
          { title: '988 Suicide & Crisis Lifeline', url: 'https://988lifeline.org', snippet: '24/7 free, confidential mental health and emotional crisis support.' },
          { title: 'Healthy Coping Strategies & Mindful Grounding', url: 'https://zhundamavicofficial.com/wellness', snippet: 'Gentle step-by-step techniques for soothing anxiety and low mood.' },
        ],
      });
      return;
    }

    // Water intake question & prompt
    if (lower.includes('water') || lower.includes('drink water') || lower.includes('hydration')) {
      if (lower.includes('yes') || lower.includes('i did') || lower.includes('i drank') || lower.includes('i took') || lower.includes('have taken')) {
        respondWaterPrompt(true);
      } else if (lower.includes('no') || lower.includes('not yet') || lower.includes('haven\'t')) {
        respondWaterPrompt(false);
      } else {
        askWaterPrompt();
      }
      setOrbState('hidden');
      return;
    }

    // Speak alarms
    if (lower.includes('speak alarm') || lower.includes('my alarms') || lower.includes('read alarm') || lower.includes('what are my alarms') || lower.includes('check alarms')) {
      speakAlarms();
      setOrbState('hidden');
      return;
    }

    // Read schedules
    if (lower.includes('read schedule') || lower.includes('my schedule') || lower.includes('what is my schedule') || lower.includes('read my schedule') || lower.includes('schedule')) {
      speakSchedules();
      setOrbState('hidden');
      return;
    }

    // Morning wake up simulation / 06:00 AM
    if (lower.includes('wake up') || lower.includes('good morning') || lower.includes('it\'s morning') || lower.includes('its morning') || lower.includes('06:00 am') || lower.includes('morning alarm')) {
      triggerWakeUpMorning();
      setOrbState('hidden');
      return;
    }

    // Bedtime mode
    if (lower.includes('bedtime') || lower.includes('sleep time') || lower.includes('going to sleep') || lower.includes('goodnight')) {
      activateBedtime(true);
      setOrbState('hidden');
      return;
    }

    // Weather Forecast update
    if (lower.includes('weather forecast') || lower.includes('weather update')) {
      speakWeatherForecast();
      setOrbState('hidden');
      return;
    }

    // 2. Hardware Toggles
    let actionDesc = '';
    if (lower.includes('flashlight on') || lower.includes('turn on torch') || lower.includes('turn on flashlight')) {
      setIsFlashlightOn(true);
      actionDesc = 'Flashlight Turned ON';
    } else if (lower.includes('flashlight off') || lower.includes('turn off torch') || lower.includes('turn off flashlight')) {
      setIsFlashlightOn(false);
      actionDesc = 'Flashlight Turned OFF';
    } else if (lower.includes('brightness')) {
      const match = lower.match(/\d+/);
      const val = match ? Math.min(100, Math.max(10, parseInt(match[0]))) : (lower.includes('max') ? 100 : 50);
      setBrightness(val);
      actionDesc = `Brightness set to ${val}%`;
    } else if (lower.includes('volume')) {
      const match = lower.match(/\d+/);
      const val = match ? Math.min(100, Math.max(0, parseInt(match[0]))) : (lower.includes('mute') ? 0 : 80);
      setVolume(val);
      actionDesc = `Volume set to ${val}%`;
    } else if (lower.includes('timer')) {
      const match = lower.match(/\d+/);
      const minutes = match ? parseInt(match[0]) : 5;
      startLiveTimer(minutes * 60, `${minutes} Min Timer`);
      actionDesc = `Timer started (${minutes}m)`;
    } else if (lower.includes('play music')) {
      setDynamicIsland((p) => ({
        ...p,
        type: 'media',
        media: p.media ? { ...p.media, isPlaying: true } : undefined,
      }));
      actionDesc = 'Playing Music';
    } else if (lower.includes('pause music')) {
      setDynamicIsland((p) => ({
        ...p,
        media: p.media ? { ...p.media, isPlaying: false } : undefined,
      }));
      actionDesc = 'Music Paused';
    }

    // 3. IF NO INTERNET ACCESS: COLORS BREAK IN SHAPES AND ROLL
    if (!isInternetConnectedRef.current) {
      setOrbState('processing_offline');
      const offlineReply = `Offline command executed on Mavic OS, ${userNameRef.current}. ${
        actionDesc || 'I processed your instruction directly on the device without internet access.'
      }`;
      
      setMavicOnlineResponse({
        query: text,
        speechText: offlineReply,
        actionDescription: actionDesc || 'Offline Execution Complete',
      });

      mavicSpeech.speak(offlineReply);
      return;
    }

    // 4. IF INTERNET ACCESS: CHECK IF USER EXPLICITLY ASKED FOR WEB
    const isExplicitWebQuery =
      lower.includes('go to the web') ||
      lower.includes('search the web') ||
      lower.includes('look on the web') ||
      lower.includes('browse the web') ||
      lower.includes('from the web') ||
      lower.includes('search online for') ||
      lower.includes('check online');

    // Rule: Don't go to the web unless user explicitly asks to go to the web!
    if (!isExplicitWebQuery) {
      let localReply = '';
      if (actionDesc) {
        localReply = `Done, ${userNameRef.current}. ${actionDesc}.`;
      } else if (lower.includes('who are you') || lower.includes('mavic')) {
        localReply = `I am MAVIC, your comprehensive AI system assistant built into Mavic OS. I have full control over your device, settings, sleep, alarms, and health tracking.`;
      } else {
        localReply = `I processed that natively on your device without browsing the web, ${userNameRef.current}. If you would like me to gather live information from the web, ask me to "go to the web to gather ${text}".`;
      }

      setOrbState('display_online');
      setMavicOnlineResponse({
        query: text,
        speechText: localReply,
        actionDescription: actionDesc || 'Mavic OS Device Intelligence (Local, No Web Search)',
      });
      mavicSpeech.speak(localReply);
      return;
    }

    // User explicitly asked to go to the web: gather the exact thing asked
    setOrbState('display_online');

    // Check if user asked for a private or inaccessible link
    const isRestrictedUrl =
      lower.includes('private') ||
      lower.includes('intranet') ||
      lower.includes('paywall') ||
      lower.includes('my login') ||
      lower.includes('bank') ||
      lower.includes('portal');

    if (isRestrictedUrl) {
      const generatedLink = `https://www.google.com/search?q=${encodeURIComponent(
        text.replace(/go to the web|search the web|search online for/gi, '').trim()
      )}`;
      const reply = `I cannot directly have access or log into that private link, but I have generated the link for you here, ${userNameRef.current}.`;
      
      setMavicOnlineResponse({
        query: text,
        speechText: reply,
        actionDescription: 'Direct Link Generated for User',
        links: [
          {
            title: `Generated Link: ${text.slice(0, 32)}`,
            url: generatedLink,
            snippet: 'Generated link created for your direct access.',
          },
        ],
      });
      mavicSpeech.speak(reply);
      return;
    }

    // Gather exact thing asked from web
    const exactSearchTerm = text.replace(/go to the web|search the web|search online for|gather/gi, '').trim();
    const gatheredSpeech = `Here is the exact information I gathered from the web regarding "${exactSearchTerm}", ${userNameRef.current}.`;

    // Gather dynamic relevant contents
    const onlineData: MavicOnlineResponse = {
      query: text,
      speechText: gatheredSpeech,
      actionDescription: actionDesc || 'Grounded Web Search',
      images: [
        {
          title: 'Deep Space Observatory',
          url: '/src/assets/images/ios18_neon_dusk_1791853743681.jpg',
        },
        {
          title: 'Next-Gen Device Architecture',
          url: '/src/assets/images/iphone16_dark_titanium_1791853745427.jpg',
        },
        {
          title: 'Chromatic Visual Spectrum',
          url: '/src/assets/images/iphone16_default_wallpaper_1791853744695.jpg',
        },
      ],
      videos: [
        {
          title: `Deep Dive: ${text.length > 25 ? text.slice(0, 25) + '...' : text}`,
          duration: '12:35',
          views: '1.4M views',
          channel: 'Mavic Science',
          thumbnailBg: '#1e1b4b',
        },
        {
          title: 'Comprehensive Technical Breakdown & Guide',
          duration: '8:45',
          views: '620K views',
          channel: 'Tech Focus Global',
          thumbnailBg: '#0f172a',
        },
      ],
      files: [
        {
          name: `${text.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20)}_Analysis_Report.pdf`,
          size: '4.2 MB',
          type: 'PDF Document',
          date: 'Updated today',
        },
        {
          name: 'Technical_Executive_Summary.docx',
          size: '1.8 MB',
          type: 'Word Document',
          date: 'Recent',
        },
      ],
      links: [
        {
          title: `In-Depth Analysis: ${text}`,
          url: 'https://zhundamavicofficial.com/intel',
          snippet: 'Authoritative reporting, comprehensive facts, and peer-reviewed reference analysis.',
        },
        {
          title: 'Global Knowledge Base & Grounded Source Index',
          url: 'https://en.wikipedia.org',
          snippet: 'Cross-verified encyclopedic references, foundational history, and latest developments.',
        },
      ],
      socialMedia: [
        {
          platform: 'X',
          author: 'Tech Innovators',
          handle: '@TechInnovators',
          content: `Breaking down the latest advancements in ${text}. The velocity of innovation here is unprecedented! 🚀`,
          metrics: '4.8K Likes · 1.2K Retweets',
          date: '15m ago',
          badgeColor: '#0f172a',
        },
        {
          platform: 'YouTube',
          author: 'Future Systems',
          handle: '@FutureSystems',
          content: `New video released covering everything you need to know about ${text}. Live demonstrations included!`,
          metrics: '94K Likes · 3.4K Comments',
          date: '1h ago',
          badgeColor: '#e11d48',
        },
        {
          platform: 'Reddit',
          author: 'r/Technology',
          handle: 'u/community_lead',
          content: `Discussion thread on ${text}: What are your thoughts on real-world adoption and utility?`,
          metrics: '1.8K Upvotes · 420 Comments',
          date: '3h ago',
          badgeColor: '#ea580c',
        },
      ],
    };

    setMavicOnlineResponse(onlineData);
    // Read response out loud in speech!
    mavicSpeech.speak(gatheredSpeech);
  };

  // MAVIC Assistant Errand & Command Engine for standard sheet
  const executeMavicCommand = (rawInput: string) => {
    const text = rawInput.trim();
    if (!text) return;

    soundHaptics.playClick(1000, 0.05);

    const userMsg: MavicMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMavicMessages((prev) => [...prev, userMsg]);
    const lower = text.toLowerCase();

    if (awaitingUserNameRef.current) {
      let extractedName = text
        .replace(/^(my name is|i am|i'm|call me|it's|it is)/i, '')
        .trim();
      if (!extractedName) extractedName = text;

      setUserName(extractedName);
      setAwaitingUserName(false);

      const replyText = `Hi ${extractedName}, I'm always available at your service, call my name whenever you need me.`;
      
      const mavicMsg: MavicMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'mavic',
        text: replyText,
        actionDescription: `Documented "${extractedName}" in offline database`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMavicMessages((prev) => [...prev, mavicMsg]);
      mavicSpeech.speak(replyText);
      return;
    }

    if (lower === 'hi mavic' || lower === 'hey mavic' || lower === 'hello mavic' || lower === 'mavic') {
      setAwaitingUserName(true);
      const replyText = "Hi, I'm Mavic. Pls what is your name?";
      const mavicMsg: MavicMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'mavic',
        text: replyText,
        actionDescription: 'Listening for user name...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMavicMessages((prev) => [...prev, mavicMsg]);
      mavicSpeech.speak(replyText);
      return;
    }

    executeMavicOrbCommand(text);
  };

  const startMavicListening = () => {
    soundHaptics.playClick(1100, 0.08);
    setIsMavicListening(true);
    triggerMavicOrb();
  };

  const stopMavicListening = () => {
    soundHaptics.playClick(750, 0.05);
    setIsMavicListening(false);
    mavicSpeech.stopListening();
  };

  // Setup background listener for "Hi Mavic" wake word when online
  useEffect(() => {
    if (isMavicOnline) {
      mavicSpeech.setCallbacks(
        (transcript, isFinal) => {
          if (isFinal && transcript.trim()) {
            if (orbStateRef.current === 'listening') {
              executeMavicOrbCommand(transcript);
            } else {
              executeMavicCommand(transcript);
            }
          }
        },
        () => {
          soundHaptics.playClick(1200, 0.08);
          triggerMavicOrb();
        }
      );
    }
  }, [isMavicOnline]);

  return (
    <LauncherContext.Provider
      value={{
        userName,
        setUserName,
        bootState,
        setBootState,
        replayBootSequence,
        isStockLauncherDisabled,
        setIsStockLauncherDisabled,

        screenState,
        setScreenState,
        activeAppId,
        openApp,
        closeApp,
        activeWallpaper,
        setWallpaper: setActiveWallpaper,
        iconStyle,
        setIconStyle,
        tintColor,
        setTintColor,
        iconSize,
        setIconSize,
        deviceMode,
        setDeviceMode,
        dynamicIsland,
        setDynamicIsland,
        expandDynamicIsland,
        collapseDynamicIsland,
        startLiveTimer,
        cancelLiveTimer,
        toggleMediaPlayback,
        cameraControl,
        setCameraControl,
        adjustCameraZoom,
        cycleCameraControlMode,
        isControlCenterOpen,
        setIsControlCenterOpen,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        isSpotlightOpen,
        setIsSpotlightOpen,
        isCustomizingHome,
        setIsCustomizingHome,
        notifications,
        dismissNotification,
        clearAllNotifications,
        brightness,
        setBrightness,
        volume,
        setVolume,
        isFlashlightOn,
        toggleFlashlight,
        flashlightIntensity,
        setFlashlightIntensity,
        focusMode,
        setFocusMode,
        isLowPowerMode,
        setIsLowPowerMode,
        currentTime,
        batteryLevel,

        isMavicOnline,
        setIsMavicOnline,
        isMavicListening,
        startMavicListening,
        stopMavicListening,
        isMavicSheetOpen,
        setIsMavicSheetOpen,
        mavicMessages,
        executeMavicCommand,
        awaitingUserName,

        orbState,
        setOrbState,
        isInternetConnected,
        setIsInternetConnected,
        mavicOnlineResponse,
        triggerMavicOrb,
        executeMavicOrbCommand,

        // Health Tracking & Hydration
        healthData,
        updateHealthData,
        toggleWalkingWorkout,
        logWaterGlass,
        waterPromptActive,
        setWaterPromptActive,
        askWaterPrompt,
        respondWaterPrompt,

        // Sleep Schedule & Bedtime Blanking
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
        simulateVIPCall,
        vipIncomingCall,
        dismissVIPCall,

        // Alarms & Schedules
        alarms,
        setAlarms,
        schedules,
        setSchedules,
        speakAlarms,
        speakSchedules,

        // Weather Forecast
        weatherTimeOfDay,
        setWeatherTimeOfDay,
        speakWeatherForecast,
      }}
    >
      {children}
    </LauncherContext.Provider>
  );
};

export const useLauncher = () => {
  const context = useContext(LauncherContext);
  if (!context) {
    throw new Error('useLauncher must be used within a LauncherProvider');
  }
  return context;
};
