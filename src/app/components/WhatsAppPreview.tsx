import { useState } from 'react';
import { X, Copy, Check, MessageCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Job, Worker, JobType } from '../types';
import { BLUE } from '../constants';

const JOB_TYPE_LABELS = (t: any): Record<JobType, string> => ({
  window: t('windowCleaning'),
  special: t('specialCleaning'),
  snow: t('snowRemoval'),
  grass: 'Grass Cutting',
  machine: 'Machine Cleaning',
  general: t('generalCleaning'),
});

const JOB_TYPE_ICONS: Record<JobType, string> = {
  window: '🪟',
  special: '⭐',
  snow: '❄️',
  grass: '🌱',
  machine: '⚙️',
  general: '🧹',
};

interface Props {
  job: Job;
  workers: Worker[];
  onClose: () => void;
}

function buildMessage(job: Job, assignedWorkers: Worker[], t: any, language: string): string {
  const dateStr = (() => {
    try {
      const d = parseISO(job.date);
      const s = format(d, 'EEEE, d. MMMM yyyy', { locale: language === 'de' ? de : undefined });
      return s.charAt(0).toUpperCase() + s.slice(1);
    } catch {
      return job.date;
    }
  })();

  const labels = JOB_TYPE_LABELS(t);
  const lines: string[] = [
    `${JOB_TYPE_ICONS[job.type]} *${labels[job.type]}*`,
    '',
    `📋 *${t('client')}:* ${job.client}`,
    `📍 *${t('location')}:* ${job.location}`,
    `📅 *${t('date')}:* ${dateStr}`,
    `🕐 *${t('time')}:* ${job.time} Uhr`,
    '',
    `👥 *${t('staff')}:*`,
  ];

  if (assignedWorkers.length > 0) {
    assignedWorkers.forEach(w => {
      let role = '';
      if (w.isSupervisor) role = ' (Supervisor)';
      lines.push(`  • ${w.name}${role}`);
    });
  } else {
    lines.push(`  • (${t('noWorkersFound')})`);
  }

  if (job.notes) {
    lines.push('');
    lines.push(`📝 *${t('notes')}:* ${job.notes}`);
  }

  lines.push('');
  lines.push('—');
  lines.push(`Liman ${t('cleaningService')}`);

  return lines.join('\n');
}

function WaLine({ text }: { text: string }) {
  if (text === '') return <div style={{ height: 6 }} />;
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <div style={{ lineHeight: 1.6 }}>
      {parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
          <strong key={i}>{part.slice(1, -1)}</strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </div>
  );
}

export function WhatsAppPreview({ job, workers, onClose }: Props) {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const assignedWorkers = workers.filter(w => job.assignedWorkers.includes(w.id));
  const message = buildMessage(job, assignedWorkers, t, language);
  const lines = message.split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1100,
      padding: '20px',
    }}>
      <div style={{
        background: '#fff',
        width: '100%', maxWidth: 500, 
        height: 'auto', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        borderRadius: 24,
        overflow: 'hidden',
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
          background: '#128C7E',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#fff' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MessageCircle size={22} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>{t('whatsAppPreview')}</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2, fontWeight: 600 }}>{t('copyMessage')} & {language === 'de' ? 'versenden' : 'send'}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)', border: 'none',
              borderRadius: 10, padding: 8, color: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat mockup */}
        <div style={{
          flex: 1,
          background: '#E5DDD5',
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)',
          backgroundSize: '20px 20px',
          padding: '32px 24px',
          overflowY: 'auto',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '2px 18px 18px 18px',
            padding: '20px',
            maxWidth: '92%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}>
            <div style={{
              fontSize: 15,
              color: '#1F2937',
              fontFamily: '-apple-system, "Helvetica Neue", Arial, sans-serif',
            }}>
              {lines.map((line, i) => (
                <WaLine key={i} text={line} />
              ))}
            </div>
            <div style={{
              fontSize: 11, color: '#9CA3AF',
              textAlign: 'right', marginTop: 10, fontWeight: 600,
            }}>
              {format(new Date(), 'HH:mm')} ✓✓
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: '24px 32px', display: 'flex', gap: 12, background: '#fff', borderTop: '1px solid #F1F5F9' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '14px',
                border: '1.5px solid #CBD5E1', borderRadius: 12,
                background: '#fff', cursor: 'pointer',
                fontSize: 15, fontWeight: 700, color: '#475569',
              }}
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleCopy}
              style={{
                flex: 2, padding: '14px',
                border: 'none', borderRadius: 12,
                background: copied ? '#16A34A' : '#25D366',
                color: '#fff', cursor: 'pointer',
                fontSize: 15, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: copied ? '0 10px 20px rgba(22,163,74,0.2)' : '0 10px 20px rgba(37,211,102,0.2)',
              }}
            >
              {copied ? <><Check size={18} strokeWidth={3} /> {language === 'de' ? 'Kopiert!' : 'Copied!'}</> : <><Copy size={18} strokeWidth={3} /> {t('copyMessage')}</>}
            </button>
        </div>
      </div>
    </div>
  );
}
