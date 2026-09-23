import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Trash2, 
  Truck, 
  Zap, 
  AlertTriangle, 
  ShieldCheck, 
  RotateCcw,
  CheckCircle2,
  Clock,
  MapPin,
  HelpCircle,
  FileText
} from 'lucide-react';

const COMMON_ISSUES = [
  {
    title: 'Overflowing Public Bin',
    desc: 'Public waste bin is full and trash is spilling onto sidewalks or roadway.',
    icon: Trash2,
    prompt: 'There is an overflowing garbage bin overflowing onto the pedestrian pathway.',
    badge: 'Urgent Priority'
  },
  {
    title: 'Missed Weekly Pickup',
    desc: 'Scheduled municipal waste or recycling pickup was missed today.',
    icon: Truck,
    prompt: 'Our scheduled curbside waste collection was missed this morning.',
    badge: 'Operations'
  },
  {
    title: 'Hazardous / E-Waste Disposal',
    desc: 'Need proper safe disposal for old batteries, paint, motor oil, or electronics.',
    icon: Zap,
    prompt: 'How do I safely dispose of old lithium batteries and paint thinner?',
    badge: 'Eco Guidance'
  },
  {
    title: 'Illegal Dumping / Debris',
    desc: 'Large household items, construction debris, or bulk waste abandoned in public.',
    icon: AlertTriangle,
    prompt: 'Someone dumped old furniture and construction debris in the alleyway.',
    badge: 'Sanitation'
  },
  {
    title: 'Damaged Municipal Bin',
    desc: 'Residential bin is cracked, missing wheels, or broken beyond use.',
    icon: RotateCcw,
    prompt: 'My green organic waste bin has a cracked lid and broken wheel.',
    badge: 'Equipment'
  },
  {
    title: 'Recycling Sorting Questions',
    desc: 'Check if specific materials, plastics, or containers can be recycled.',
    icon: HelpCircle,
    prompt: 'Can greasy pizza boxes and plastic bubble wrap be recycled?',
    badge: 'Resident Tip'
  }
];

export default function Home() {
  const navigate = useNavigate();

  const handleLaunchIssue = (promptText) => {
    navigate('/assistant', { state: { prefill: promptText } });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-pill">
            <Sparkles size={15} color="var(--primary)" />
            <span>AI-POWERED CIVIC WASTE PLATFORM</span>
          </div>

          <h1>
            Cleaner neighborhoods, <br />
            <span className="gradient-text">triaged in seconds.</span>
          </h1>

          <p>
            Report missed collections, overflowing bins, or hazardous waste in real time. 
            Our autonomous AI triage evaluates urgency, tags municipal departments, and dispatches field teams instantly.
          </p>

          <div className="cta-row">
            <Link to="/assistant" className="btn btn-primary cta-btn-large">
              <span>Report an Issue with AI</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/complaints" className="btn secondary-btn cta-btn-large">
              <FileText size={18} />
              <span>Track Complaints</span>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="var(--primary)" /> Instant Classification
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="var(--primary)" /> Real-Time RPA Routing
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="var(--primary)" /> Transparent Tracking
            </span>
          </div>
        </div>

        {/* Live Interactive Triage Simulation */}
        {/* Live Interactive Triage Simulation */}
        <div className="hero-visual">
          <div className="hero-card-preview">
            <div className="preview-header">
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)', display: 'block', marginBottom: '0.15rem' }}>
                  Municipal Telemetry
                </span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>Live Dispatch Pipeline</strong>
              </div>
              <span className="live-pill">
                <span className="live-dot" /> AI ACTIVE
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted)', background: 'var(--slate-50)', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.85rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={12} color="var(--primary)" /> Avg Triage: <strong>18s</strong>
              </span>
              <span>•</span>
              <span>14 Active Crews</span>
              <span>•</span>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>99.2% SLA</span>
            </div>

            <div className="preview-ticket-body">
              {/* Ticket 1: Urgent */}
              <div className="preview-item critical">
                <div className="preview-item-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span className="badge badge-high">
                      <AlertTriangle size={11} /> High
                    </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: 'var(--muted)', background: 'var(--slate-100)', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                      #SWM-1042
                    </span>
                  </div>
                  <span className="status-badge status-in-progress">
                    <span className="live-dot" style={{ width: '5px', height: '5px' }} /> In Progress
                  </span>
                </div>

                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink)' }}>
                  Overflowing Bin at Pedestrian Crossing
                </div>

                <div className="preview-item-bottom">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={12} color="var(--danger)" /> Elm St Crossing • CleanTeam Alpha
                  </span>
                  <span style={{ color: 'var(--subtle)' }}>Just now</span>
                </div>
              </div>

              {/* Ticket 2: Operations */}
              <div className="preview-item medium">
                <div className="preview-item-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span className="badge badge-medium">Medium</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: 'var(--muted)', background: 'var(--slate-100)', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                      #SWM-1041
                    </span>
                  </div>
                  <span className="status-badge status-assigned">
                    Assigned
                  </span>
                </div>

                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink)' }}>
                  Missed Weekly Curbside Collection
                </div>

                <div className="preview-item-bottom">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={12} color="var(--warning)" /> Sector 4 Curbside • Truck 12
                  </span>
                  <span style={{ color: 'var(--subtle)' }}>4m ago</span>
                </div>
              </div>

              {/* Ticket 3: Guidance */}
              <div className="preview-item guidance">
                <div className="preview-item-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span className="badge badge-low">
                      <Sparkles size={11} /> Guidance
                    </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: 'var(--muted)', background: 'var(--slate-100)', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                      #RES-309
                    </span>
                  </div>
                  <span className="status-badge status-resolved">
                    <CheckCircle2 size={12} /> Resolved
                  </span>
                </div>

                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink)' }}>
                  Lead-Acid Battery Disposal Guidance
                </div>

                <div className="preview-item-bottom">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={12} color="var(--primary)" /> Citizen redirected to Central EcoCenter
                  </span>
                  <span style={{ color: 'var(--subtle)' }}>12m ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Launch Common Issues */}
      <section className="section-wrapper">
        <div className="section-head">
          <span className="hero-pill" style={{ margin: '0 auto 0.75rem' }}>ONE-TAP REPORTING</span>
          <h2>What waste issue are you facing?</h2>
          <p>Select any common situation below to instantly launch the AI assistant with a pre-configured report.</p>
        </div>

        <div className="category-grid">
          {COMMON_ISSUES.map((issue, idx) => {
            const Icon = issue.icon;
            return (
              <div 
                key={idx} 
                className="category-card"
                onClick={() => handleLaunchIssue(issue.prompt)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleLaunchIssue(issue.prompt)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="category-icon-box">
                    <Icon size={24} />
                  </div>
                  <span style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 700, 
                    color: 'var(--muted)',
                    background: 'var(--slate-100)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {issue.badge}
                  </span>
                </div>
                <div>
                  <h3 style={{ marginBottom: '0.25rem' }}>{issue.title}</h3>
                  <p>{issue.desc}</p>
                </div>
                <span className="category-action">
                  <span>Report this now</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3-Step Process Flow */}
      <section className="section-wrapper">
        <div className="section-head">
          <span className="hero-pill" style={{ margin: '0 auto 0.75rem' }}>HOW IT WORKS</span>
          <h2>From resident report to rapid resolution</h2>
          <p>EcoTrack connects citizens and municipal maintenance through automated triage.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <div>
              <h3>Describe or Snap</h3>
              <p>Type your complaint, pick a quick preset, or attach your street location in seconds.</p>
            </div>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <div>
              <h3>Instant AI Triage</h3>
              <p>Natural language processing assigns waste type, urgency level, and the responsible municipal department.</p>
            </div>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <div>
              <h3>Automated Dispatch</h3>
              <p>Workflows immediately alert field sanitation crews while you track progress in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Banner */}
      <section className="stats-banner">
        <div className="stat-item">
          <b>24/7</b>
          <span>Autonomous AI Triage</span>
        </div>
        <div className="stat-item">
          <b>&lt; 30s</b>
          <span>Average Ticket Creation</span>
        </div>
        <div className="stat-item">
          <b>94%</b>
          <span>Faster Crew Dispatch</span>
        </div>
        <div className="stat-item">
          <b>100%</b>
          <span>Segregation Guidance Accuracy</span>
        </div>
      </section>

      {/* Waste Sorting Quick Reference */}
      <section className="section-wrapper" style={{ marginBottom: '2rem' }}>
        <div className="section-head">
          <span className="hero-pill" style={{ margin: '0 auto 0.75rem' }}>RESIDENTIAL CHEAT SHEET</span>
          <h2>Waste Segregation Quick Guide</h2>
          <p>Follow municipal bin standards to improve neighborhood recycling and composting.</p>
        </div>

        <div className="segregation-grid">
          <div className="bin-guide-card blue">
            <h4><span style={{ fontSize: '1.25rem' }}>🟦</span> Blue Bin: Dry Recyclables</h4>
            <ul>
              <li>Clean plastic bottles & containers</li>
              <li>Flattened cardboard & paper boxes</li>
              <li>Aluminum drink cans & metal tins</li>
              <li>Rinsed glass jars & containers</li>
            </ul>
          </div>

          <div className="bin-guide-card green">
            <h4><span style={{ fontSize: '1.25rem' }}>🟩</span> Green Bin: Compost & Organics</h4>
            <ul>
              <li>Fruit & vegetable peels, coffee grounds</li>
              <li>Leftover food scraps & eggshells</li>
              <li>Lawn trimmings, leaves & small branches</li>
              <li>Soiled paper napkins & pizza boxes</li>
            </ul>
          </div>

          <div className="bin-guide-card red">
            <h4><span style={{ fontSize: '1.25rem' }}>🟥</span> Red: Hazardous & E-Waste</h4>
            <ul>
              <li>Household batteries & lithium packs</li>
              <li>Paint cans, chemical cleaners & solvents</li>
              <li>Old mobile phones, chargers & laptops</li>
              <li>Fluorescent tubes & CFL bulbs</li>
            </ul>
          </div>

          <div className="bin-guide-card yellow">
            <h4><span style={{ fontSize: '1.25rem' }}>🟨</span> Yellow/Grey: General Waste</h4>
            <ul>
              <li>Sanitary products & diapers</li>
              <li>Ceramics, mirrors & broken glass</li>
              <li>Multi-layer chip bags & plastic wraps</li>
              <li>Non-recyclable domestic items</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
