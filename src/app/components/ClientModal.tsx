import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { X, User, MapPin, Phone } from 'lucide-react';
import { BLUE } from '../constants';

interface ClientModalProps {
  client?: Client; // undefined for create
  onSave: (data: Omit<Client, 'id'>) => void;
  onClose: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1.5px solid #E2E8F0',
  borderRadius: 12,
  padding: '12px 16px',
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
  background: '#F8FAFD',
  color: '#1E293B',
  transition: 'all 0.2s ease',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 800,
  color: '#64748B',
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

const ClientModal: React.FC<ClientModalProps> = ({ client, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (client) {
      setName(client.name);
      setLocation(client.location);
      setMobile(client.mobile);
    } else {
      setName('');
      setLocation('');
      setMobile('');
    }
  }, [client]);

  const validate = () => {
    if (!name.trim() || !location.trim() || !mobile.trim()) {
      setError('All fields are required.');
      return false;
    }
    const mobileRegex = /^\+?[0-9\s-]{7,20}$/;
    if (!mobileRegex.test(mobile.trim())) {
      setError('Invalid mobile number format.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ name: name.trim(), location: location.trim(), mobile: mobile.trim() });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 9999,
      padding: '20px',
    }}>
      <div style={{
        background: '#fff',
        width: '100%', maxWidth: 480,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        animation: 'modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <style>{`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        {/* Header */}
        <div style={{
          padding: '24px 32px',
          background: BLUE, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              {client ? 'Edit Client' : 'Add Client'}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontWeight: 600 }}>
              {client ? 'Update client details and information' : 'Create a new client profile'}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: 12, padding: 10, color: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Body / Form */}
        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C',
              padding: '12px 16px', borderRadius: 12, fontSize: 14, fontWeight: 600,
              marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8
            }}>
              <span style={{ fontSize: 16 }}>⚠️</span> {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Name */}
            <div>
              <label style={labelStyle}>Client Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="e.g. Raiffeisen Bank AG"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 44 }}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label style={labelStyle}>Address / Location *</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="e.g. Mariahilfer Str. 77, 1060 Wien"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 44 }}
                  required
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label style={labelStyle}>Mobile / Phone *</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="e.g. +43 1 717070"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 44 }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px', borderRadius: 12, border: '1.5px solid #E2E8F0',
                background: '#fff', color: '#475569', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFD'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 28px', borderRadius: 12, border: 'none',
                background: BLUE, color: '#fff', fontSize: 14, fontWeight: 800,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: `0 8px 16px ${BLUE}33`
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              {client ? 'Save Changes' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;
