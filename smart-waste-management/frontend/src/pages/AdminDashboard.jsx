import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  RotateCw, 
  Search, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Building2, 
  User, 
  MapPin, 
  Eye, 
  X, 
  Check, 
  Filter,
  BarChart3,
  Layers,
  ArrowUpRight,
  Camera
} from 'lucide-react';

const STATUS = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
const DEPARTMENTS = [
  'Sanitation & Waste Ops',
  'Recycling Operations',
  'Hazardous & E-Waste Team',
  'Street Cleaning Division',
  'Equipment & Maintenance',
  'General Support'
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [s, l] = await Promise.all([
        api('/admin/statistics'),
        api('/admin/complaints')
      ]);
      setStats(s);
      setList(l);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      await api(`/complaints/${id}`, { method: 'PUT', body: { status } });
      showToast(`Complaint ${id} status updated to "${status}"`);
      await loadData();
      if (selectedComplaint && selectedComplaint.complaintId === id) {
        setSelectedComplaint(prev => ({ ...prev, status }));
      }
    } catch (e) {
      alert(`Failed to update status: ${e.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDepartmentChange = async (id, department) => {
    try {
      setUpdatingId(id);
      await api(`/complaints/${id}`, { method: 'PUT', body: { department } });
      showToast(`Complaint ${id} re-routed to "${department}"`);
      await loadData();
      if (selectedComplaint && selectedComplaint.complaintId === id) {
        setSelectedComplaint(prev => ({ ...prev, department }));
      }
    } catch (e) {
      alert(`Failed to update department: ${e.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter complaints based on status and search query
  const filteredComplaints = useMemo(() => {
    return list.filter((c) => {
      const matchStatus = statusFilter === 'All' 
        ? true 
        : statusFilter === 'Resolved'
          ? (c.status === 'Resolved' || c.status === 'Closed')
          : c.status === statusFilter;

      const q = search.toLowerCase().trim();
      const matchSearch = !q || (
        c.complaintId?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.department?.toLowerCase().includes(q) ||
        c.userId?.name?.toLowerCase().includes(q) ||
        c.userId?.email?.toLowerCase().includes(q) ||
        c.message?.toLowerCase().includes(q)
      );

      return matchStatus && matchSearch;
    });
  }, [list, statusFilter, search]);

  const highPriorityCount = useMemo(() => {
    return list.filter(c => c.priority === 'High' && c.status !== 'Resolved' && c.status !== 'Closed').length;
  }, [list]);

  if (loading || !stats) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem' }}>
        <div className="live-dot" style={{ width: '12px', height: '12px' }} />
        <p style={{ color: 'var(--muted)', fontWeight: 600 }}>Loading Operations Dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--forest-dark)',
          color: '#fff',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          zIndex: 2000,
          animation: 'fadeIn 0.2s ease'
        }}>
          <Check size={16} color="var(--primary)" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <ShieldCheck size={30} color="var(--primary)" />
            <span>Operations Command Center</span>
          </h1>
          <p>Real-time municipal dispatch overview, AI triage telemetry, and complaint resolution management.</p>
        </div>

        <button 
          type="button" 
          className="secondary-btn" 
          onClick={loadData}
          disabled={refreshing}
          style={{ padding: '0.6rem 1rem' }}
        >
          <RotateCw size={16} className={refreshing ? 'spin' : ''} />
          <span>{refreshing ? 'Updating...' : 'Refresh Data'}</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-metrics-grid">
        <div className="admin-kpi-card">
          <div className="kpi-text">
            <span>Total Reported</span>
            <b>{stats.total}</b>
          </div>
          <div className="kpi-icon" style={{ background: 'var(--slate-100)', color: 'var(--ink)' }}>
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-text">
            <span>Pending Triage</span>
            <b style={{ color: 'var(--warning)' }}>{stats.byStatus?.Pending || 0}</b>
          </div>
          <div className="kpi-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-text">
            <span>Active Workflows</span>
            <b style={{ color: 'var(--purple)' }}>{(stats.byStatus?.Assigned || 0) + (stats.byStatus?.['In Progress'] || 0)}</b>
          </div>
          <div className="kpi-icon" style={{ background: 'var(--purple-bg)', color: 'var(--purple)' }}>
            <Layers size={22} />
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-text">
            <span>Resolved Tickets</span>
            <b style={{ color: 'var(--primary)' }}>{(stats.byStatus?.Resolved || 0) + (stats.byStatus?.Closed || 0)}</b>
          </div>
          <div className="kpi-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-text">
            <span>Critical Urgent</span>
            <b style={{ color: 'var(--danger)' }}>{highPriorityCount}</b>
          </div>
          <div className="kpi-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Visual Bars */}
      <div className="admin-charts-grid">
        {/* Categories Breakdown */}
        <div className="chart-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <strong style={{ fontSize: '1rem', color: 'var(--ink)' }}>Issue Categories</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Distribution</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(stats.byCategory || {}).map(([cat, count]) => {
              const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={cat} className="chart-item">
                  <div className="chart-label-row">
                    <span style={{ color: 'var(--ink)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cat}
                    </span>
                    <span style={{ color: 'var(--muted)' }}>{count} ({pct}%)</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%`, background: 'var(--primary)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="chart-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <strong style={{ fontSize: '1rem', color: 'var(--ink)' }}>Priority Triage</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Severity Level</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {['High', 'Medium', 'Low'].map((p) => {
              const count = stats.byPriority?.[p] || 0;
              const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
              const color = p === 'High' ? 'var(--danger)' : p === 'Medium' ? 'var(--warning)' : 'var(--primary)';
              return (
                <div key={p} className="chart-item">
                  <div className="chart-label-row">
                    <span style={{ color: 'var(--ink)' }}>{p} Priority</span>
                    <span style={{ color: 'var(--muted)' }}>{count} ({pct}%)</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Workload */}
        <div className="chart-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <strong style={{ fontSize: '1rem', color: 'var(--ink)' }}>Department Workload</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Dispatch Load</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(stats.byDepartment || {}).map(([dept, count]) => {
              const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={dept} className="chart-item">
                  <div className="chart-label-row">
                    <span style={{ color: 'var(--ink)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {dept}
                    </span>
                    <span style={{ color: 'var(--muted)' }}>{count} ({pct}%)</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%`, background: 'var(--info)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Complaints Table Section */}
      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-input-wrapper" style={{ maxWidth: '360px' }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by ID, citizen, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            {['All', 'Pending', 'Assigned', 'In Progress', 'Resolved'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`filter-tab ${statusFilter === tab ? 'active' : ''}`}
                onClick={() => setStatusFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Department</th>
                <th>Citizen</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--forest-dark)', background: 'var(--slate-100)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                        {c.complaintId}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <strong style={{ fontSize: '0.88rem' }}>{c.category}</strong>
                        {c.photo && (
                          <span title="Photo evidence attached" style={{ color: 'var(--primary)', display: 'inline-flex' }}>
                            <Camera size={14} />
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${c.priority === 'High' ? 'badge-high' : c.priority === 'Medium' ? 'badge-medium' : 'badge-low'}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--ink)' }}>{c.department || 'Unassigned'}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.userId?.name || 'Citizen'}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{c.userId?.email}</span>
                      </div>
                    </td>
                    <td>
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.complaintId, e.target.value)}
                        disabled={updatingId === c.complaintId}
                        style={{
                          padding: '0.35rem 0.65rem',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-full)',
                          cursor: 'pointer',
                          background: c.status === 'Resolved' || c.status === 'Closed' 
                            ? '#d1fae5' 
                            : c.status === 'In Progress' 
                              ? '#ede9fe' 
                              : c.status === 'Assigned' 
                                ? '#dbeafe' 
                                : '#fef3c7',
                          color: c.status === 'Resolved' || c.status === 'Closed' 
                            ? '#065f46' 
                            : c.status === 'In Progress' 
                              ? '#5b21b6' 
                              : c.status === 'Assigned' 
                                ? '#1e40af' 
                                : '#92400e',
                          border: 'none'
                        }}
                      >
                        {STATUS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-outline"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => setSelectedComplaint(c)}
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--muted)' }}>
                    No complaints match current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Inspection Modal */}
      {selectedComplaint && (
        <div className="modal-backdrop" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.2rem', color: 'var(--forest-dark)' }}>
                  {selectedComplaint.complaintId}
                </span>
                <span className={`badge ${selectedComplaint.priority === 'High' ? 'badge-high' : selectedComplaint.priority === 'Medium' ? 'badge-medium' : 'badge-low'}`}>
                  {selectedComplaint.priority} Priority
                </span>
              </div>
              <button 
                type="button" 
                className="btn-ghost" 
                onClick={() => setSelectedComplaint(null)}
                style={{ padding: '0.35rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Category & Status update */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Status</span>
                  <select
                    value={selectedComplaint.status}
                    onChange={(e) => handleStatusChange(selectedComplaint.complaintId, e.target.value)}
                    style={{ marginTop: '0.3rem', padding: '0.45rem 0.75rem', fontSize: '0.88rem' }}
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Department</span>
                  <select
                    value={selectedComplaint.department || ''}
                    onChange={(e) => handleDepartmentChange(selectedComplaint.complaintId, e.target.value)}
                    style={{ marginTop: '0.3rem', padding: '0.45rem 0.75rem', fontSize: '0.88rem' }}
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Reported Problem</strong>
                <p style={{ marginTop: '0.4rem', fontSize: '0.98rem', color: 'var(--ink)' }}>
                  {selectedComplaint.message}
                </p>
              </div>

              {/* Citizen & Location */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <User size={13} /> Citizen Information
                  </strong>
                  <div style={{ marginTop: '0.35rem', fontSize: '0.9rem' }}>
                    <strong>{selectedComplaint.userId?.name || 'Anonymous Citizen'}</strong>
                    <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{selectedComplaint.userId?.email}</div>
                  </div>
                </div>

                {selectedComplaint.location && (
                  <div>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={13} /> Incident Location
                    </strong>
                    <div style={{ marginTop: '0.35rem', fontSize: '0.9rem', color: 'var(--ink)' }}>
                      {selectedComplaint.location}
                    </div>
                  </div>
                )}
              </div>

              {/* Photo Evidence Section */}
              {selectedComplaint.photo && (
                <div>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.45rem' }}>
                    <Camera size={14} color="var(--primary)" /> Citizen Photo Evidence
                  </strong>
                  <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--card-border)', background: '#0f172a', textAlign: 'center', padding: '0.5rem' }}>
                    <img 
                      src={selectedComplaint.photo} 
                      alt={`Evidence for ${selectedComplaint.complaintId}`} 
                      style={{ maxWidth: '100%', maxHeight: '340px', objectFit: 'contain', display: 'block', margin: '0 auto', borderRadius: '4px' }} 
                    />
                  </div>
                </div>
              )}

              {/* Guidance */}
              {selectedComplaint.guidance && (
                <div style={{ background: 'var(--primary-light)', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-border)' }}>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--forest-dark)', textTransform: 'uppercase' }}>AI Guidance Delivered to Citizen</strong>
                  <p style={{ fontSize: '0.88rem', color: 'var(--forest-dark)', marginTop: '0.25rem', margin: 0 }}>
                    {selectedComplaint.guidance}
                  </p>
                </div>
              )}

              {/* Audit Logs History */}
              {selectedComplaint.logs && selectedComplaint.logs.length > 0 && (
                <div>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                    <Clock size={13} /> RPA & Admin Event History
                  </strong>
                  <div className="complaint-logs">
                    <div className="logs-timeline">
                      {selectedComplaint.logs.map((log, i) => (
                        <div key={i} className="log-entry">
                          <div className="log-dot" />
                          <div style={{ flex: 1 }}>
                            <span>{log.msg}</span>
                          </div>
                          {log.at && (
                            <span className="log-time">
                              {new Date(log.at).toLocaleString()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
