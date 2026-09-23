import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import { 
  ClipboardList, 
  Search, 
  Plus, 
  Filter, 
  RotateCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

const TABS = ['All', 'Pending', 'Assigned', 'In Progress', 'Resolved'];

export default function Complaints() {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchComplaints = async () => {
    try {
      setRefreshing(true);
      const data = await api('/complaints');
      setList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Filtered complaints based on active tab and search query
  const filteredList = useMemo(() => {
    if (!list) return [];
    return list.filter((c) => {
      const matchTab = activeTab === 'All' 
        ? true 
        : activeTab === 'Resolved' 
          ? (c.status === 'Resolved' || c.status === 'Closed')
          : c.status === activeTab;

      const q = search.toLowerCase().trim();
      const matchSearch = !q || (
        c.complaintId?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.message?.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q) ||
        c.department?.toLowerCase().includes(q)
      );

      return matchTab && matchSearch;
    });
  }, [list, activeTab, search]);

  // Tab counts
  const counts = useMemo(() => {
    if (!list) return {};
    const res = { All: list.length };
    TABS.slice(1).forEach((tab) => {
      if (tab === 'Resolved') {
        res[tab] = list.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
      } else {
        res[tab] = list.filter((c) => c.status === tab).length;
      }
    });
    return res;
  }, [list]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem' }}>
        <div className="live-dot" style={{ width: '12px', height: '12px' }} />
        <p style={{ color: 'var(--muted)', fontWeight: 600 }}>Loading your waste complaints...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <ClipboardList size={28} color="var(--primary)" />
            <span>My Submitted Complaints</span>
          </h1>
          <p>Track live municipal routing, crew assignments, and resolution statuses for all your reported issues.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button 
            type="button" 
            className="secondary-btn" 
            onClick={fetchComplaints}
            disabled={refreshing}
            style={{ padding: '0.55rem 0.95rem', fontSize: '0.88rem' }}
          >
            <RotateCw size={15} className={refreshing ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          
          <Link to="/assistant" className="btn btn-primary" style={{ padding: '0.55rem 1.15rem', fontSize: '0.88rem' }}>
            <Plus size={16} />
            <span>New Report</span>
          </Link>
        </div>
      </div>

      {/* Toolbar: Search and Filter Tabs */}
      <div className="complaints-toolbar">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by ID (e.g. SWM-1025), category, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <span>{tab}</span>
              {counts[tab] !== undefined && (
                <span style={{ 
                  marginLeft: '0.35rem', 
                  fontSize: '0.72rem', 
                  padding: '0.1rem 0.45rem', 
                  borderRadius: 'var(--radius-full)',
                  background: activeTab === tab ? 'var(--primary)' : 'var(--slate-200)',
                  color: activeTab === tab ? '#fff' : 'var(--muted)'
                }}>
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* List / Empty State */}
      {filteredList.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredList.map((c) => (
            <ComplaintCard key={c._id || c.complaintId} c={c} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon-circle">
            <ClipboardList size={30} />
          </div>
          <h3>No complaints found</h3>
          <p style={{ maxWidth: '420px', margin: '0 auto', fontSize: '0.92rem' }}>
            {search
              ? `No complaints match "${search}". Try searching for another keyword or clear the search.`
              : activeTab !== 'All'
                ? `You have no complaints currently in the "${activeTab}" state.`
                : 'You have not reported any waste management issues yet.'}
          </p>
          <div style={{ marginTop: '0.5rem' }}>
            {search ? (
              <button type="button" className="secondary-btn" onClick={() => setSearch('')}>
                Clear Search
              </button>
            ) : (
              <Link to="/assistant" className="btn btn-primary">
                <Plus size={16} />
                <span>Report an Issue with AI</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
