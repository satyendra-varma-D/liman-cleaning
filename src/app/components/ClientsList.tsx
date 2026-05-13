import React from 'react';
import { User, MapPin, Phone, ChevronRight, Plus, Trash2, Edit2 } from 'lucide-react';
import { Client } from '../types';
import { BLUE } from '../constants';

interface Props {
  clients: Client[];
  onAddClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

const ClientsList: React.FC<Props> = ({ clients, onAddClient, onEditClient, onDeleteClient }) => {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0F1A2A', margin: 0 }}>Client Management</h2>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>{clients.length} Total Clients</p>
        </div>
        <button 
          onClick={onAddClient}
          style={{
            background: BLUE, color: '#fff', border: 'none', borderRadius: 14,
            padding: '12px 24px', fontSize: 13, fontWeight: 800, cursor: 'pointer',
            boxShadow: `0 8px 20px ${BLUE}33`, display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}
        >
          <Plus size={18} strokeWidth={2.5} /> Add Client
        </button>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: 24,
        border: '1px solid #F1F5F9',
        boxShadow: '0 20px 50px rgba(0,0,0,0.02)',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80px 250px 1fr 200px 120px',
          padding: '18px 24px',
          background: '#F8FAFD',
          borderBottom: '1px solid #F1F5F9',
        }}>
          {['ID', 'Client Name', 'Location', 'Mobile', 'Actions'].map((h, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {clients.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#94A3B8' }}>
            <User size={48} style={{ opacity: 0.1, marginBottom: 16 }} />
            <div style={{ fontSize: 16, fontWeight: 700 }}>No clients added yet</div>
            <p style={{ fontSize: 14, marginTop: 4 }}>Click "Add Client" to start building your database.</p>
          </div>
        ) : (
          clients.map((client, idx) => {
            const isLast = idx === clients.length - 1;
            return (
              <div
                key={client.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 250px 1fr 200px 120px',
                  padding: '16px 24px',
                  alignItems: 'center',
                  borderBottom: isLast ? 'none' : '1px solid #F8FAFD',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
                {/* ID */}
                <div style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8' }}>
                  #{client.id.slice(-4).toUpperCase()}
                </div>

                {/* Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 12,
                    background: '#EFF6FF', color: BLUE,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700
                  }}>
                    <User size={18} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>{client.name}</div>
                </div>

                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontSize: 14, fontWeight: 500 }}>
                  <MapPin size={14} color="#94A3B8" />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client.location}</span>
                </div>

                {/* Mobile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontSize: 14, fontWeight: 600 }}>
                  <Phone size={14} color="#94A3B8" />
                  {client.mobile}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button 
                    onClick={() => onEditClient(client)}
                    style={{ 
                      padding: 8, borderRadius: 10, border: 'none', background: '#F8FAFD', 
                      color: '#64748B', cursor: 'pointer', transition: 'all 0.2s' 
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = BLUE; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFD'; e.currentTarget.style.color = '#64748B'; }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDeleteClient(client.id)}
                    style={{ 
                      padding: 8, borderRadius: 10, border: 'none', background: '#F8FAFD', 
                      color: '#64748B', cursor: 'pointer', transition: 'all 0.2s' 
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFD'; e.currentTarget.style.color = '#64748B'; }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ClientsList;
