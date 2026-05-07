import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Languages,
  Truck
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { UserRole } from '../types';

interface SidebarProps {
  onLogout: () => void;
  activeModule: string;
  onModuleChange: (module: string) => void;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout, activeModule, onModuleChange, userRole }) => {
  const { language, setLanguage, t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, roles: ['admin', 'secretary', 'supervisor'] },
    { id: 'jobs', label: t('jobs'), icon: Briefcase, roles: ['admin', 'secretary'] },
    { id: 'workers', label: t('workers'), icon: Users, roles: ['admin', 'secretary', 'supervisor'] },
    { id: 'vehicles', label: 'Vehicles', icon: Truck, roles: ['admin', 'secretary', 'supervisor'] },
    { id: 'schedule', label: t('schedule'), icon: Calendar, roles: ['admin', 'secretary', 'supervisor'] },
    { id: 'reports', label: t('reports'), icon: BarChart3, roles: ['admin'] },
  ].filter(item => item.roles.includes(userRole));
  return (
    <aside className="w-64 h-screen bg-white text-slate-500 flex flex-col fixed left-0 top-0 z-50 shadow-[10px_0_40px_rgba(0,0,0,0.02)] border-r border-slate-50">
      <div className="p-8 flex items-center gap-4">
        <div className="relative group">
          <div className="w-11 h-11 bg-[#F59E0B] rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-orange-100 transition-transform group-hover:scale-110">
            L
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#2563EB] rounded-lg border-2 border-white shadow-sm" />
        </div>
        <div>
          <h2 className="font-bold text-xl leading-tight text-slate-800 tracking-tight">Liman<span className="text-[#2563EB]"> .ok</span></h2>
          <p className="text-[9px] text-slate-400 tracking-[0.2em] uppercase font-semibold">SERVICES</p>
        </div>
      </div>

      <nav className="flex-1 px-5 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onModuleChange(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
              activeModule === item.id 
                ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 transition-colors ${activeModule === item.id ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-500'}`} strokeWidth={activeModule === item.id ? 2.5 : 2} />
              <span className={`text-sm tracking-tight ${activeModule === item.id ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </div>
            {activeModule === item.id && (
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto space-y-5">
        {userRole === 'admin' ? (
          <div className="bg-orange-50/40 rounded-[24px] p-5 border border-orange-100/50">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-400">Admin</span>
            </div>
            <button 
              onClick={() => onModuleChange('settings')}
              className="flex items-center gap-3 w-full text-slate-500 hover:text-orange-500 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-tight">{t('systemSettings')}</span>
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-[24px] p-5 border border-slate-100">
            <div className="flex items-center gap-2 mb-0">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
          <Languages className="w-4 h-4 text-slate-400" />
          <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
            <button
              onClick={() => setLanguage('de')}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                language === 'de' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              DE
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                language === 'en' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-5 py-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all font-semibold text-sm group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
};
