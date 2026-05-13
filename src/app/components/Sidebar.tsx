import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronRight,
  UserCheck,
  Truck,
  Plane,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { UserRole } from '../types';

interface SidebarProps {
  onLogout: () => void;
  activeModule: string;
  onModuleChange: (module: string) => void;
  userRole: UserRole;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout, activeModule, onModuleChange, userRole, isCollapsed, onToggleCollapse }) => {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'planner', label: 'Planner', icon: LayoutDashboard, roles: ['admin', 'secretary'] },
    { id: 'clients', label: 'Clients', icon: UserCheck, roles: ['admin'] },
    { id: 'dashboard', label: t('dashboard'), icon: BarChart3, roles: ['admin', 'secretary'] },
    { id: 'jobs', label: t('jobs'), icon: Briefcase, roles: ['admin', 'secretary'] },
    { id: 'workers', label: t('workers'), icon: Users, roles: ['admin', 'secretary'] },
    { id: 'vehicles', label: 'Vehicles', icon: Truck, roles: ['admin', 'secretary'] },
    { id: 'attendance', label: 'Attendance', icon: CheckCircle2, roles: ['admin', 'secretary'] },
    { id: 'reports', label: t('reports'), icon: BarChart3, roles: ['admin'], disabled: true },
  ].filter(item => item.roles.includes(userRole));
  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-white text-slate-500 flex flex-col fixed left-0 top-0 z-50 shadow-[10px_0_40px_rgba(0,0,0,0.02)] border-r border-slate-50 transition-all duration-300`}>
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-4`}>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-9 h-9 bg-[#F59E0B] rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-orange-100 transition-transform group-hover:scale-110">
              L
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#2563EB] rounded-lg border-2 border-white shadow-sm" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-xl leading-tight text-slate-800 tracking-tight">Liman<span className="text-[#2563EB]"> .ok</span></h2>
              <p className="text-[9px] text-slate-400 tracking-[0.2em] uppercase font-semibold">SERVICES</p>
            </div>
          )}
        </div>
        
        <button 
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 ${isCollapsed ? 'hidden group-hover:block' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <LayoutDashboard size={18} className="rotate-180" style={{ transform: 'scaleX(-1)' }} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && onModuleChange(item.id)}
            title={isCollapsed ? item.label : ''}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-xl transition-all duration-300 group ${
              activeModule === item.id 
                ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 transition-colors ${activeModule === item.id ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-500'}`} strokeWidth={activeModule === item.id ? 2.5 : 2} />
              {!isCollapsed && <span className={`text-sm tracking-tight ${activeModule === item.id ? 'font-bold' : 'font-medium'}`}>{item.label}</span>}
            </div>
            {!isCollapsed && activeModule === item.id && (
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto space-y-4">
        {userRole === 'admin' ? (
          <div className={`${isCollapsed ? 'p-2' : 'p-4'} bg-orange-50/40 rounded-[20px] border border-orange-100/50`}>
            {!isCollapsed && (
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-400">Admin</span>
              </div>
            )}
            <button 
              onClick={() => onModuleChange('settings')}
              title={isCollapsed ? t('systemSettings') : ''}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} w-full text-slate-500 hover:text-orange-500 transition-colors`}
            >
              <Settings className="w-4 h-4" />
              {!isCollapsed && <span className="text-sm font-semibold tracking-tight">{t('systemSettings')}</span>}
            </button>
          </div>
        ) : (
          <div className={`${isCollapsed ? 'p-2 flex justify-center' : 'p-4'} bg-slate-50 rounded-[20px] border border-slate-100`}>
            <div className="flex items-center gap-2 mb-0">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              </div>
              {!isCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </span>
              )}
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          title={isCollapsed ? t('logout') : ''}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all font-semibold text-sm group`}
        >
          <LogOut className={`w-5 h-5 ${!isCollapsed ? 'group-hover:-translate-x-1' : ''} transition-transform`} />
          {!isCollapsed && <span>{t('logout')}</span>}
        </button>
      </div>
    </aside>
  );
};
