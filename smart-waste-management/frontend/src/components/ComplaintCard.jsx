import { useState } from 'react';
import { 
  Copy, 
  Check, 
  MapPin, 
  Building2, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Lightbulb, 
  CheckCircle2,
  Trash2,
  Layers,
  Camera,
  X
} from 'lucide-react';

const STEPS = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];

export default function ComplaintCard({ c }) {
  const [copied, setCopied] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(c.complaintId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine stepper index
  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Assigned': return 1;
      case 'In Progress': return 2;
      case 'Resolved':
      case 'Closed': return 3;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(c.status);
  const progressPercent = (currentStep / (STEPS.length - 1)) * 100;

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Assigned': return 'status-assigned';
      case 'In Progress': return 'status-in-progress';
      case 'Resolved': return 'status-resolved';
      case 'Closed': return 'status-closed';
      default: return 'status-pending';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      case 'Low': return 'badge-low';
      default: return 'badge-medium';
    }
  };

  return (
    <article className="complaint-card">
      {/* Photo Lightbox Modal */}
      {showPhotoModal && c.photo && (
        <div className="modal-backdrop" onClick={() => setShowPhotoModal(false)}>
          <div 
            style={{ 
              maxWidth: '750px', 
              width: '95%', 
              background: '#000', 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden', 
              position: 'relative',
              boxShadow: 'var(--shadow-lg)'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              onClick={() => setShowPhotoModal(false)}
              style={{ 
                position: 'absolute', 
                top: '12px', 
                right: '12px', 
                background: 'rgba(0,0,0,0.6)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '50%', 
                width: '36px', 
                height: '36px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer' 
              }}
            >
              <X size={20} />
            </button>
            <img 
              src={c.photo} 
              alt={`Photo evidence for ${c.complaintId}`} 
              style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} 
            />
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="complaint-card-header">
        <div className="complaint-id-box">
          <span style={{ 
            fontFamily: 'monospace', 
            fontWeight: 800, 
            fontSize: '1.05rem', 
            background: 'var(--slate-100)', 
            padding: '0.25rem 0.65rem', 
            borderRadius: 'var(--radius-sm)',
            color: 'var(--forest-dark)'
          }}>
            {c.complaintId}
          </span>
          <button 
            type="button" 
            className="copy-btn" 
            onClick={copyId}
            title="Copy Complaint ID"
          >
            {copied ? (
              <span style={{ color: 'var(--success)', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <Check size={14} /> Copied
              </span>
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className={`badge ${getPriorityClass(c.priority)}`}>
            {c.priority} Priority
          </span>
          <span className={`status-badge ${getStatusClass(c.status)}`}>
            {c.status}
          </span>
        </div>
      </div>

      {/* Progress Stepper */}
      <div style={{ padding: '0.5rem 0' }}>
        <div className="stepper-container">
          <div className="stepper-progress-bg" />
          <div 
            className="stepper-progress-bar" 
            style={{ width: `calc(${progressPercent}% * 0.88)` }} 
          />
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep || (currentStep === 3 && idx === 3);
            const isCurrent = idx === currentStep && currentStep !== 3;
            return (
              <div 
                key={step} 
                className={`stepper-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <div className="step-circle">
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : idx + 1}
                </div>
                <span className="step-label">{step}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complaint Message */}
      <div>
        <strong style={{ fontSize: '1.05rem', color: 'var(--ink)', display: 'block', marginBottom: '0.25rem' }}>
          {c.category}
        </strong>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '0.95rem' }}>{c.message}</p>
      </div>

      {/* Photo Evidence Preview if attached */}
      {c.photo && (
        <div>
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: 'var(--slate-50)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem 0.75rem',
              cursor: 'pointer',
              color: 'var(--ink)'
            }}
            onClick={() => setShowPhotoModal(true)}
            title="Click to view full photo evidence"
          >
            <img 
              src={c.photo} 
              alt="Evidence thumbnail" 
              style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} 
            />
            <div style={{ textAlign: 'left', fontSize: '0.82rem' }}>
              <strong style={{ display: 'block' }}>Photo Evidence Attached</strong>
              <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Click to view full size</span>
            </div>
            <Camera size={15} color="var(--primary)" style={{ marginLeft: '0.25rem' }} />
          </button>
        </div>
      )}

      {/* AI Guidance if available */}
      {c.guidance && (
        <div style={{ 
          background: 'var(--primary-light)', 
          border: '1px solid var(--primary-border)', 
          borderRadius: 'var(--radius-md)', 
          padding: '0.75rem 1rem',
          display: 'flex',
          gap: '0.65rem',
          alignItems: 'flex-start'
        }}>
          <Lightbulb size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.85rem', color: 'var(--forest-dark)' }}>
            <strong>Guidance Provided:</strong> {c.guidance}
          </div>
        </div>
      )}

      {/* Metadata Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', fontSize: '0.82rem', color: 'var(--muted)', paddingTop: '0.25rem', borderTop: '1px solid var(--slate-100)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Building2 size={14} color="var(--primary)" />
          {c.department || 'Sanitation Dept'}
        </span>

        {c.location && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} color="var(--danger)" />
            {c.location}
          </span>
        )}

        {c.wasteType && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Layers size={14} color="var(--info)" />
            {c.wasteType}
          </span>
        )}

        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginLeft: 'auto' }}>
          <Calendar size={14} />
          {new Date(c.createdAt).toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>

      {/* Activity Timeline Accordion */}
      {c.logs && c.logs.length > 0 && (
        <div>
          <button 
            type="button" 
            className="btn-ghost" 
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--muted)' }}
            onClick={() => setShowLogs(!showLogs)}
          >
            <Clock size={13} />
            <span>Activity History ({c.logs.length} events)</span>
            {showLogs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showLogs && (
            <div className="complaint-logs">
              <div className="logs-timeline">
                {c.logs.map((log, idx) => (
                  <div key={idx} className="log-entry">
                    <div className="log-dot" />
                    <div>
                      <span>{log.msg}</span>
                    </div>
                    {log.at && (
                      <span className="log-time">
                        {new Date(log.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
