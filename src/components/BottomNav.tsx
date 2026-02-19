import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, ClipboardList, Cloud, Stethoscope, HeartHandshake } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = {
  registrar: [
    { to: '/registrar', icon: UserPlus, label: 'Register' },
    { to: '/records', icon: ClipboardList, label: 'Records' },
    { to: '/sync', icon: Cloud, label: 'Sync' },
  ],
  optometrist: [
    { to: '/optometrist', icon: Stethoscope, label: 'Exam' },
    { to: '/records', icon: ClipboardList, label: 'Records' },
    { to: '/sync', icon: Cloud, label: 'Sync' },
  ],
  counsellor: [
    { to: '/counsellor', icon: HeartHandshake, label: 'Counsel' },
    { to: '/records', icon: ClipboardList, label: 'Records' },
    { to: '/sync', icon: Cloud, label: 'Sync' },
  ],
};

const BottomNav = () => {
  const { profile } = useAuth();
  if (!profile?.role) return null;

  const items = navItems[profile.role] || [];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex items-center justify-around py-1.5">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors text-muted-foreground',
                isActive && 'text-primary bg-accent'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
