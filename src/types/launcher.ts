export type AppId =
  | 'camera'
  | 'settings'
  | 'weather'
  | 'calculator'
  | 'notes'
  | 'photos'
  | 'safari'
  | 'clock'
  | 'messages'
  | 'phone'
  | 'maps'
  | 'music'
  | 'appstore'
  | 'reminders'
  | 'health'
  | 'files';

export interface AppDefinition {
  id: AppId;
  name: string;
  iconBg: string;
  category: 'Social' | 'Utilities' | 'Productivity' | 'Entertainment' | 'Creativity' | 'Information';
  badge?: number;
  notificationSnippet?: string;
  description?: string;
}

export type IconStyle = 'default' | 'dark' | 'tinted';
export type IconSize = 'standard' | 'large';

export interface WallpaperOption {
  id: string;
  name: string;
  type: 'image' | 'gradient';
  url?: string;
  gradient?: string;
  thumbBg: string;
}

export type BootState = 'booting' | 'welcome' | 'ready';

export type MavicOrbState = 'hidden' | 'listening' | 'processing_offline' | 'display_online';

export interface MavicOnlineResponse {
  query: string;
  speechText: string;
  actionDescription?: string;
  images?: Array<{ title: string; url: string; category?: string }>;
  videos?: Array<{ title: string; duration: string; views: string; thumbnailBg: string; channel?: string }>;
  files?: Array<{ name: string; size: string; type: string; date: string }>;
  links?: Array<{ title: string; url: string; snippet: string }>;
  socialMedia?: Array<{
    platform: 'X' | 'YouTube' | 'Instagram' | 'Reddit';
    author: string;
    handle: string;
    content: string;
    metrics: string;
    date: string;
    badgeColor: string;
  }>;
}

export interface MavicMessage {
  id: string;
  sender: 'user' | 'mavic';
  text: string;
  actionDescription?: string;
  timestamp: string;
}

export interface DynamicIslandState {
  type: 'idle' | 'media' | 'timer' | 'call' | 'charging' | 'mavic';
  isExpanded: boolean;
  mavicOnline?: boolean; // When true, Dynamic Island stays active with green indicator dot
  mavic?: {
    isListening: boolean;
    transcript: string;
    reply: string;
  };
  media?: {
    title: string;
    artist: string;
    album: string;
    isPlaying: boolean;
    duration: number;
    currentTime: number;
    coverColor: string;
  };
  timer?: {
    totalSeconds: number;
    remainingSeconds: number;
    isRunning: boolean;
    label: string;
  };
  call?: {
    contact: string;
    number: string;
    duration: number;
    status: 'connected' | 'incoming';
  };
}

export interface CameraControlConfig {
  activeMode: 'zoom' | 'exposure' | 'styles' | 'depth';
  zoom: number; // 0.5, 1.0, 2.0, 5.0
  exposure: number; // -2.0 to +2.0
  style: 'Standard' | 'Vibrant' | 'Rich Warm' | 'Muted Amber';
  depth: number; // f/1.4 to f/16
  isOpen: boolean;
}

export interface AlarmItem {
  id: string;
  time: string; // e.g. "06:00 AM"
  label: string;
  enabled: boolean;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  category: 'work' | 'health' | 'wellness' | 'sleep';
}

export interface SleepScheduleConfig {
  bedtime: string; // e.g. "22:30" (10:30 PM)
  wakeUpTime: string; // e.g. "06:00" (06:00 AM)
  blankDelayMinutes: number; // 30 min
  autoDisableInternet: boolean;
  vipContacts: string[];
}

export interface HealthData {
  steps: number;
  stepsGoal: number;
  walkingMinutes: number;
  walkingMiles: number;
  caloriesBurned: number;
  isWalkingActive: boolean;
  waterGlasses: number;
  waterGoal: number;
  sleepHours: number;
  heartRate: number;
}

export interface NotificationItem {
  id: string;
  appId: AppId;
  title: string;
  message: string;
  timeAgo: string;
  iconBg: string;
  isVIP?: boolean;
}

export type WidgetType =
  | 'weather'
  | 'battery'
  | 'activity'
  | 'calendar'
  | 'hydration'
  | 'sleep'
  | 'mavic'
  | 'music'
  | 'clock';

export interface CustomWidget {
  id: string;
  type: WidgetType;
  title: string;
  size: 'small' | 'medium' | 'large';
}
