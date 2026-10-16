import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BellOff, MessageSquare, Phone, ListTodo, ChevronUp } from 'lucide-react';
import { useLauncher } from '../context/LauncherContext';
import { soundHaptics } from '../utils/haptics';

export const NotificationCenter: React.FC = () => {
  const {
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    notifications,
    dismissNotification,
    clearAllNotifications,
    currentTime,
    openApp,
  } = useLauncher();

  if (!isNotificationCenterOpen) return null;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayName = days[currentTime.getDay()];
  const monthName = months[currentTime.getMonth()];
  const dateNum = currentTime.getDate();

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes}`;

  const getNotificationIcon = (appId: string) => {
    switch (appId) {
      case 'messages':
        return <MessageSquare size={14} className="text-white" />;
      case 'phone':
        return <Phone size={14} className="text-white" />;
      case 'reminders':
        return <ListTodo size={14} className="text-white" />;
      default:
        return <MessageSquare size={14} className="text-white" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsNotificationCenterOpen(false)}
        className="absolute inset-0 z-50 bg-black/60 backdrop-blur-2xl flex flex-col pt-12 pb-6 px-5 select-none overflow-y-auto"
      >
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm mx-auto flex flex-col gap-4 text-white"
        >
          {/* Header Time & Date */}
          <div className="flex flex-col items-center gap-1 my-2">
            <span className="text-xs font-semibold text-white/80">{dayName}, {monthName} {dateNum}</span>
            <span className="text-5xl font-bold tracking-tight font-mono">{formattedTime}</span>
          </div>

          {/* Notifications Title + Clear button */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60">
              Notification Center
            </span>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-colors"
                title="Clear all notifications"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Notifications Stack */}
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/40 gap-2">
              <BellOff size={32} />
              <span className="text-xs font-medium">No Older Notifications</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <AnimatePresence>
                {notifications.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-neutral-900/80 hover:bg-neutral-800/80 border border-white/10 p-3.5 rounded-2xl shadow-xl backdrop-blur-xl relative group cursor-pointer"
                    onClick={() => {
                      setIsNotificationCenterOpen(false);
                      openApp(item.appId);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center ${item.iconBg}`}>
                          {getNotificationIcon(item.appId)}
                        </div>
                        <span className="text-xs font-bold text-white tracking-tight">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-white/40 tabular-nums">{item.timeAgo}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(item.id);
                          }}
                          className="text-white/40 hover:text-white p-0.5"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed pl-7">{item.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Swipe indicator */}
          <button
            onClick={() => setIsNotificationCenterOpen(false)}
            className="flex flex-col items-center text-white/50 hover:text-white/80 pt-4"
          >
            <ChevronUp size={20} />
            <span className="text-[11px] font-medium">Swipe up to dismiss</span>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
