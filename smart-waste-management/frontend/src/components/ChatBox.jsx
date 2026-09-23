import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, 
  MapPin, 
  Bot, 
  User, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles,
  AlertCircle,
  X,
  Compass,
  Camera,
  Image as ImageIcon,
  Eye
} from 'lucide-react';

const SUGGESTIONS = [
  "🗑️ Overflowing dumpster at Main St intersection",
  "🚛 Missed organic bin pickup this morning",
  "🔋 How should I recycle old rechargeable batteries?",
  "🚯 Construction debris dumped on public sidewalk"
];

export default function ChatBox({ msgs, busy, onSend, initialText = '' }) {
  const [text, setText] = useState(initialText);
  const [location, setLocation] = useState('');
  const [locating, setLocating] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [previewModalImg, setPreviewModalImg] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialText) {
      setText(initialText);
      inputRef.current?.focus();
    }
  }, [initialText]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [msgs, busy]);

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setShowLocationInput(true);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
        setLocation(`GPS: ${coords}`);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setShowLocationInput(true);
      },
      { timeout: 8000 }
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WebP)');
      return;
    }

    setPhotoName(file.name);

    // Read and compress slightly if large
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setPhoto(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed && !photo) return;
    if (busy) return;
    onSend(trimmed || 'Report attached with photo evidence', location.trim(), photo);
    setText('');
    setLocation('');
    setPhoto(null);
    setPhotoName('');
    setShowLocationInput(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectSuggestion = (s) => {
    onSend(s, location.trim(), photo);
    setLocation('');
    setPhoto(null);
    setPhotoName('');
    setShowLocationInput(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="chat-container">
      {/* Lightbox Preview Modal */}
      {previewModalImg && (
        <div className="modal-backdrop" onClick={() => setPreviewModalImg(null)}>
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
              onClick={() => setPreviewModalImg(null)}
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
              src={previewModalImg} 
              alt="Photo Evidence Preview" 
              style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} 
            />
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="chat-header">
        <div className="bot-profile">
          <div className="bot-avatar">
            <Bot size={22} />
          </div>
          <div className="bot-meta">
            <strong>EcoBot Municipal AI</strong>
            <span>
              <span className="live-dot" style={{ width: '6px', height: '6px' }} />
              Active Triage • Photo Inspection Ready
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={14} color="var(--primary)" />
            Real-time Dispatch
          </span>
        </div>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="chat-quick-chips">
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
          Suggestions:
        </span>
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            type="button"
            className="quick-chip"
            onClick={() => selectSuggestion(s)}
            disabled={busy}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="chat-messages" aria-live="polite">
        {msgs.map((m, i) => {
          const isMe = m.me;
          return (
            <div key={i} className={`msg-row ${isMe ? 'me' : ''}`}>
              {!isMe && (
                <div className="bot-avatar" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                  <Bot size={17} />
                </div>
              )}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxWidth: '100%' }}>
                {/* User Photo Bubble if uploaded */}
                {isMe && m.photo && (
                  <div 
                    style={{ 
                      borderRadius: '16px', 
                      overflow: 'hidden', 
                      border: '2px solid rgba(255,255,255,0.4)', 
                      maxWidth: '260px', 
                      cursor: 'pointer',
                      alignSelf: 'flex-end',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    onClick={() => setPreviewModalImg(m.photo)}
                    title="Click to view full photo"
                  >
                    <img 
                      src={m.photo} 
                      alt="Uploaded waste report" 
                      style={{ width: '100%', height: '160px', objectFit: 'cover' }} 
                    />
                  </div>
                )}

                <div className="msg-bubble">
                  {m.text}

                  {/* If user attached a location, show it in user bubble */}
                  {isMe && m.location && (
                    <div style={{ marginTop: '0.45rem', fontSize: '0.8rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} />
                      <span>{m.location}</span>
                    </div>
                  )}
                </div>

                {/* Structured Ticket Card if a complaint was registered */}
                {!isMe && m.complaint && (
                  <div className="chat-ticket-card">
                    <div className="ticket-header">
                      <div className="ticket-id-box">
                        <span className="ticket-id-tag">
                          {m.complaint.complaintId}
                        </span>
                        <button
                          type="button"
                          className="copy-btn"
                          title="Copy Complaint ID"
                          onClick={() => copyToClipboard(m.complaint.complaintId)}
                        >
                          {copiedId === m.complaint.complaintId ? (
                            <span style={{ color: 'var(--success)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
                              <Check size={14} /> Copied
                            </span>
                          ) : (
                            <Copy size={15} />
                          )}
                        </button>
                      </div>

                      <span className={`badge badge-${(m.complaint.priority || 'medium').toLowerCase()}`}>
                        {m.complaint.priority} Priority
                      </span>
                    </div>

                    {/* Show photo preview thumbnail in ticket card if available */}
                    {m.complaint.photo && (
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.65rem', 
                          background: 'var(--slate-50)', 
                          padding: '0.5rem', 
                          borderRadius: 'var(--radius-md)', 
                          border: '1px solid var(--card-border)',
                          cursor: 'pointer'
                        }}
                        onClick={() => setPreviewModalImg(m.complaint.photo)}
                        title="View photo evidence"
                      >
                        <img 
                          src={m.complaint.photo} 
                          alt="Evidence" 
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} 
                        />
                        <div style={{ fontSize: '0.82rem', flex: 1 }}>
                          <strong style={{ color: 'var(--ink)', display: 'block' }}>Photo Attached</strong>
                          <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Click to view full photo</span>
                        </div>
                        <Eye size={16} color="var(--primary)" />
                      </div>
                    )}

                    <div className="ticket-grid">
                      <div className="ticket-row-item">
                        <strong>Category</strong>
                        <span>{m.complaint.category || 'General Waste'}</span>
                      </div>
                      <div className="ticket-row-item">
                        <strong>Routed To</strong>
                        <span>{m.complaint.department || 'Operations Team'}</span>
                      </div>
                      <div className="ticket-row-item">
                        <strong>Status</strong>
                        <span className="status-badge status-pending" style={{ padding: '0.15rem 0.55rem', fontSize: '0.72rem' }}>
                          {m.complaint.status || 'Pending'}
                        </span>
                      </div>
                      {m.complaint.location && (
                        <div className="ticket-row-item">
                          <strong>Location</strong>
                          <span>{m.complaint.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="ticket-actions">
                      <Link to="/complaints" className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}>
                        <span>View My Complaints</span>
                        <ExternalLink size={13} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {isMe && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--forest-dark)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={16} />
                </div>
              )}
            </div>
          );
        })}

        {/* Animated Typing Indicator */}
        {busy && (
          <div className="msg-row">
            <div className="bot-avatar" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
              <Bot size={17} />
            </div>
            <div className="msg-bubble typing-bubble">
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)', marginRight: '0.4rem' }}>
                Analyzing severity, photo & routing
              </span>
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input Section, Photo Preview & Attachments */}
      <div className="chat-input-bar">
        {/* Photo Preview Attachment Bar */}
        {photo && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.45rem 0.75rem'
          }}>
            <img 
              src={photo} 
              alt="Upload preview" 
              style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }} 
            />
            <div style={{ flex: 1, fontSize: '0.82rem', color: 'var(--forest-dark)' }}>
              <strong>Photo attached</strong>
              <div style={{ color: 'var(--muted)', fontSize: '0.75rem', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {photoName || 'waste-site.jpg'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setPhoto(null);
                setPhotoName('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--forest-dark)', padding: '0.2rem' }}
              title="Remove photo"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Location selector / indicator */}
        <div className="location-attach-row">
          {location ? (
            <div className="location-chip active">
              <MapPin size={13} />
              <span>Location: {location}</span>
              <button 
                type="button" 
                onClick={() => setLocation('')}
                style={{ background: 'none', border: 'none', padding: '0 2px', cursor: 'pointer', color: 'inherit' }}
                title="Remove location"
              >
                <X size={13} />
              </button>
            </div>
          ) : showLocationInput ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
              <input
                placeholder="Enter street address or landmark (e.g. 5th Ave & Pine St)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', flex: 1 }}
                autoFocus
              />
              <button 
                type="button" 
                className="btn-ghost" 
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                onClick={() => setShowLocationInput(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="location-chip"
                onClick={handleGetLocation}
                disabled={locating || busy}
                title="Detect current location"
                style={{ cursor: 'pointer' }}
              >
                <Compass size={13} />
                <span>{locating ? 'Detecting GPS...' : '📍 Auto-detect GPS'}</span>
              </button>

              <button
                type="button"
                className="location-chip"
                onClick={() => setShowLocationInput(true)}
                disabled={busy}
                style={{ cursor: 'pointer' }}
              >
                <MapPin size={13} />
                <span>+ Street Address</span>
              </button>

              {/* Photo Upload Trigger */}
              <button
                type="button"
                className={`location-chip ${photo ? 'active' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                disabled={busy}
                title="Attach photo evidence"
                style={{ cursor: 'pointer' }}
              >
                <Camera size={13} />
                <span>{photo ? '📸 Photo Ready' : '📷 Attach Photo'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Hidden file input for photo upload */}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />

        {/* Message Input Form */}
        <form className="input-send-group" onSubmit={submit}>
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={photo ? "Add optional description for this photo..." : "Type your issue or question (e.g. Overflowing bin, missed route)..."}
            aria-label="Your message"
            disabled={busy}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={(!text.trim() && !photo) || busy}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.8rem 1.4rem' }}
          >
            <span>Send</span>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
