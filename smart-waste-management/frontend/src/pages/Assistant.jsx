import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import ChatBox from '../components/ChatBox';
import { Sparkles, MessageSquare } from 'lucide-react';

export default function Assistant() {
  const location = useLocation();
  const initialPrefill = location.state?.prefill || '';

  const [msgs, setMsgs] = useState([
    { 
      me: false, 
      text: 'Hello! I am EcoBot, your smart waste assistant.\n\nTell me about any waste issue (overflowing bin, missed pickup, illegal dump) or ask how to properly segregate and dispose of tricky materials.' 
    }
  ]);
  const [busy, setBusy] = useState(false);

  const send = async (text, locString, photoString) => {
    // Append user message with optional photo and location
    setMsgs((m) => [...m, { me: true, text, location: locString, photo: photoString }]);
    setBusy(true);

    try {
      const payload = { message: text };
      if (locString) payload.location = locString;
      if (photoString) payload.photo = photoString;

      const d = await api('/ai/chat', { 
        method: 'POST', 
        body: payload 
      });

      setMsgs((m) => [
        ...m, 
        { 
          me: false, 
          text: d.reply, 
          complaint: d.complaint, 
          analysis: d.analysis 
        }
      ]);
    } catch (e) {
      setMsgs((m) => [
        ...m, 
        { 
          me: false, 
          text: `⚠️ Unable to process request: ${e.message}. Please check your connection and try again.` 
        }
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="assistant-layout">
      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div className="page-header-text">
          <h1>
            <Sparkles size={28} color="var(--primary)" />
            <span>AI Waste Assistant & Reporter</span>
          </h1>
          <p>Describe your issue in plain language. Our AI will automatically categorize, assign priority, and route it to sanitation teams.</p>
        </div>
      </div>

      <ChatBox 
        msgs={msgs} 
        busy={busy} 
        onSend={send} 
        initialText={initialPrefill} 
      />
    </div>
  );
}
