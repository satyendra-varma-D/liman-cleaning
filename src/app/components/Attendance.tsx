import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Search, Calendar as CalendarIcon, Users, ChevronLeft, ChevronRight, UserCheck, UserX } from 'lucide-react';
import type { Worker, AttendanceRecord, AttendanceStatus } from '../types';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { BLUE } from '../constants';

interface Props {
  workers: Worker[];
  records: AttendanceRecord[];
  onUpdateAttendance: (date: string, workerId: string, status: AttendanceStatus) => void;
  onUpdateAllAttendance: (date: string, status: AttendanceStatus) => void;
}

export function Attendance({ workers, records, onUpdateAttendance, onUpdateAllAttendance }: Props) {
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [search, setSearch] = useState('');

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (workerId: string) => {
    const record = records.find(r => r.date === currentDate && r.workerId === workerId);
    return record?.status || 'not-set';
  };

  const statusConfig: Record<AttendanceStatus, { icon: any, color: string, bg: string, label: string }> = {
    present: { icon: CheckCircle2, color: '#16A34A', bg: '#F0FDF4', label: 'Present' },
    absent: { icon: XCircle, color: '#DC2626', bg: '#FEF2F2', label: 'Absent' },
    late: { icon: Clock, color: '#F59E0B', bg: '#FFFBEB', label: 'Late' },
    'not-set': { icon: Users, color: '#94A3B8', bg: '#F8FAFD', label: 'Not Set' }
  };

  const handlePrevDay = () => setCurrentDate(format(subDays(parseISO(currentDate), 1), 'yyyy-MM-dd'));
  const handleNextDay = () => setCurrentDate(format(addDays(parseISO(currentDate), 1), 'yyyy-MM-dd'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Daily Attendance
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: 8, background: '#fff', 
              padding: '6px 16px', borderRadius: 12, border: '1px solid #E2E8F0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <button onClick={handlePrevDay} style={navBtn}><ChevronLeft size={18} /></button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 160, justifyContent: 'center' }}>
                <CalendarIcon size={16} color={BLUE} />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>
                  {format(parseISO(currentDate), 'EEEE, dd MMM')}
                </span>
              </div>
              <button onClick={handleNextDay} style={navBtn}><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={() => onUpdateAllAttendance(currentDate, 'present')}
            style={{ ...actionBtn, background: '#F0FDF4', color: '#16A34A', border: '1.5px solid #DCFCE7' }}
          >
            <UserCheck size={18} /> Mark All Present
          </button>
          <button 
            onClick={() => onUpdateAllAttendance(currentDate, 'absent')}
            style={{ ...actionBtn, background: '#FEF2F2', color: '#DC2626', border: '1.5px solid #FEE2E2' }}
          >
            <UserX size={18} /> Mark All Absent
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div style={{ 
        background: '#fff', borderRadius: 24, border: '1px solid #F1F5F9',
        boxShadow: '0 10px 40px rgba(0,0,0,0.02)', overflow: 'hidden'
      }}>
        {/* Search & Filter Bar */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 320 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '12px 12px 12px 44px', borderRadius: 14,
                border: '1.5px solid #E2E8F0', background: '#F8FAFD', outline: 'none',
                fontSize: 14, fontWeight: 600, color: '#1E293B'
              }}
            />
          </div>
          <div style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>
            Total Employees: <span style={{ color: '#1E293B', fontWeight: 800 }}>{workers.length}</span>
          </div>
        </div>

        {/* Workers List Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#F8FAFD', borderBottom: '1px solid #F1F5F9' }}>
              <tr>
                <th style={thStyle}>Employee</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((worker, idx) => {
                const status = getStatus(worker.id);
                const config = statusConfig[status];
                const Icon = config.icon;

                return (
                  <tr key={worker.id} style={{ borderBottom: idx === filteredWorkers.length - 1 ? 'none' : '1px solid #F8FAFD' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ 
                          width: 40, height: 40, borderRadius: 12, background: worker.isSupervisor ? '#16A34A' : BLUE,
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800
                        }}>
                          {worker.avatar ? (
                            <img src={worker.avatar} alt={worker.name} style={{ width: '100%', height: '100%', borderRadius: 12, objectFit: 'cover' }} />
                          ) : (
                            worker.name[0]
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>{worker.name}</div>
                          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{worker.isSupervisor ? 'Supervisor' : 'Worker'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ 
                        display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', 
                        borderRadius: 10, background: config.bg, color: config.color, width: 'fit-content',
                        fontSize: 13, fontWeight: 800
                      }}>
                        <Icon size={14} /> {config.label}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => onUpdateAttendance(currentDate, worker.id, 'present')}
                          title="Present"
                          style={{ ...statusBtn, background: status === 'present' ? '#16A34A' : '#fff', color: status === 'present' ? '#fff' : '#16A34A', borderColor: '#16A34A' }}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button 
                          onClick={() => onUpdateAttendance(currentDate, worker.id, 'absent')}
                          title="Absent"
                          style={{ ...statusBtn, background: status === 'absent' ? '#DC2626' : '#fff', color: status === 'absent' ? '#fff' : '#DC2626', borderColor: '#DC2626' }}
                        >
                          <XCircle size={16} />
                        </button>
                        <button 
                          onClick={() => onUpdateAttendance(currentDate, worker.id, 'late')}
                          title="Late"
                          style={{ ...statusBtn, background: status === 'late' ? '#F59E0B' : '#fff', color: status === 'late' ? '#fff' : '#F59E0B', borderColor: '#F59E0B' }}
                        >
                          <Clock size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const navBtn: React.CSSProperties = {
  background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#94A3B8',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const actionBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 14,
  fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
  boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
};

const thStyle: React.CSSProperties = {
  padding: '16px 24px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#94A3B8',
  textTransform: 'uppercase', letterSpacing: '0.08em'
};

const statusBtn: React.CSSProperties = {
  width: 34, height: 34, borderRadius: 10, border: '1.5px solid', 
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  transition: 'all 0.2s'
};
