import React from 'react';
import {
  Phone,
  Compass,
  MessageSquare,
  Music2,
  Camera,
  Image,
  CloudSun,
  Clock,
  Calculator,
  FileText,
  Settings,
  MapPin,
  ListTodo,
  HeartPulse,
  ShoppingBag,
  Folder,
} from 'lucide-react';
import { AppId, AppDefinition } from '../types/launcher';
import { useLauncher } from '../context/LauncherContext';

interface AppIconProps {
  app: AppDefinition;
  onClick?: () => void;
  showName?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({ app, onClick, showName = true }) => {
  const { iconStyle, tintColor, iconSize, isCustomizingHome } = useLauncher();

  const getIconGlyph = (id: AppId) => {
    const size = iconSize === 'large' ? 32 : 28;
    const strokeWidth = 2;

    switch (id) {
      case 'phone':
        return <Phone size={size} strokeWidth={strokeWidth} className="text-white drop-shadow-sm" />;
      case 'safari':
        return <Compass size={size} strokeWidth={strokeWidth} className="text-white drop-shadow-sm" />;
      case 'messages':
        return <MessageSquare size={size} strokeWidth={strokeWidth} className="text-white drop-shadow-sm" />;
      case 'music':
        return <Music2 size={size} strokeWidth={strokeWidth} className="text-white drop-shadow-sm" />;
      case 'camera':
        return <Camera size={size} strokeWidth={strokeWidth} className="text-white drop-shadow-sm" />;
      case 'photos':
        return (
          <div className="relative flex items-center justify-center">
            <Image size={size} strokeWidth={strokeWidth} className="text-amber-100" />
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/40 via-yellow-400/40 to-cyan-400/40 rounded-full blur-[2px]" />
          </div>
        );
      case 'weather':
        return <CloudSun size={size} strokeWidth={strokeWidth} className="text-white drop-shadow-sm" />;
      case 'clock':
        return <Clock size={size} strokeWidth={strokeWidth} className="text-white drop-shadow-sm" />;
      case 'calculator':
        return <Calculator size={size} strokeWidth={strokeWidth} className="text-amber-400 drop-shadow-sm" />;
      case 'notes':
        return <FileText size={size} strokeWidth={strokeWidth} className="text-white drop-shadow-sm" />;
      case 'settings':
        return <Settings size={size} strokeWidth={strokeWidth} className="text-slate-100 drop-shadow-sm" />;
      case 'maps':
        return <MapPin size={size} strokeWidth={strokeWidth} className="text-white drop-shadow-sm" />;
      case 'reminders':
        return <ListTodo size={size} strokeWidth={strokeWidth} className="text-white drop-shadow-sm" />;
      case 'health':
        return <HeartPulse size={size} strokeWidth={strokeWidth} className="text-white drop-shadow-sm" />;
      case 'appstore':
        return <ShoppingBag size={size} strokeWidth={strokeWidth} className="text-white drop-shadow-sm" />;
      case 'files':
        return <Folder size={size} strokeWidth={strokeWidth} className="text-white drop-shadow-sm" />;
      default:
        return <Settings size={size} strokeWidth={strokeWidth} className="text-white" />;
    }
  };

  // Determine styling based on iOS 18 icon style
  const getIconStyles = () => {
    if (iconStyle === 'tinted') {
      return {
        background: 'rgba(24, 24, 27, 0.88)',
        border: `1.5px solid ${tintColor}40`,
        color: tintColor,
      };
    }
    if (iconStyle === 'dark') {
      return {
        background: '#1c1c1e',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      };
    }
    return {};
  };

  const getBackgroundClass = () => {
    if (iconStyle === 'tinted') return '';
    if (iconStyle === 'dark') return 'bg-[#18181b]';

    switch (app.id) {
      case 'phone':
        return 'bg-gradient-to-b from-emerald-400 to-emerald-600';
      case 'safari':
        return 'bg-gradient-to-b from-sky-300 via-sky-500 to-blue-600';
      case 'messages':
        return 'bg-gradient-to-b from-emerald-400 to-green-600';
      case 'music':
        return 'bg-gradient-to-b from-rose-500 to-red-600';
      case 'camera':
        return 'bg-gradient-to-b from-zinc-700 to-zinc-900';
      case 'photos':
        return 'bg-white';
      case 'weather':
        return 'bg-gradient-to-b from-sky-400 to-blue-600';
      case 'clock':
        return 'bg-zinc-950 border border-zinc-800';
      case 'calculator':
        return 'bg-zinc-900 border border-zinc-800';
      case 'notes':
        return 'bg-gradient-to-b from-amber-400 to-amber-500';
      case 'settings':
        return 'bg-gradient-to-b from-slate-400 to-slate-600';
      case 'maps':
        return 'bg-gradient-to-b from-emerald-400 to-teal-600';
      case 'reminders':
        return 'bg-gradient-to-b from-sky-400 to-blue-500';
      case 'health':
        return 'bg-white';
      case 'appstore':
        return 'bg-gradient-to-b from-blue-400 to-blue-600';
      case 'files':
        return 'bg-gradient-to-b from-sky-400 to-sky-600';
      default:
        return app.iconBg;
    }
  };

  const dimensions = iconSize === 'large' ? 'w-[64px] h-[64px]' : 'w-[58px] h-[58px]';

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center select-none cursor-pointer group ${
        isCustomizingHome ? 'animate-[wiggle_0.25s_ease-in-out_infinite_alternate]' : ''
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* App Squircle */}
      <div
        className={`${dimensions} rounded-[22%] flex items-center justify-center shadow-md active:scale-90 active:opacity-85 transition-all duration-150 relative overflow-hidden ${getBackgroundClass()}`}
        style={getIconStyles()}
      >
        {/* Subtle glass reflection highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none rounded-[22%]" />

        {/* Tinted Overlay if in iOS 18 Tinted Mode */}
        {iconStyle === 'tinted' ? (
          <div style={{ color: tintColor }} className="drop-shadow-sm">
            {getIconGlyph(app.id)}
          </div>
        ) : (
          getIconGlyph(app.id)
        )}

        {/* Badge */}
        {app.badge && app.badge > 0 && !isCustomizingHome && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm tabular-nums">
            {app.badge}
          </div>
        )}

        {/* Jiggle remove indicator */}
        {isCustomizingHome && (
          <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-slate-700/80 backdrop-blur-sm text-white text-xs flex items-center justify-center border border-white/50">
            -
          </div>
        )}
      </div>

      {/* Label (hidden in iOS 18 Large icon mode) */}
      {showName && iconSize === 'standard' && (
        <span className="text-[11.5px] font-medium tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] mt-1.5 truncate max-w-[68px] text-center">
          {app.name}
        </span>
      )}
    </div>
  );
};
