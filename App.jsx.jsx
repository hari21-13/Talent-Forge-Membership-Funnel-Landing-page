import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  FileSpreadsheet, 
  UserCheck, 
  Download
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [duration, setDuration] = useState('12 Months'); // '6 Months' | '12 Months'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    planSelected: 'LEVEL 3 - Specialist',
    duration: '12 Months',
    experienceLevel: 'Mid-Level (3-6 Years)',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetch('http://localhost:5000/api/leads/hima-bindu')
        .then(res => res.json())
        .then(data => { if (data.success) setLeads(data.data); })
        .catch(err => console.error('API Error:', err));
    }
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, duration })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Enquiry submitted successfully! Reference Code: ${data.leadId}`);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          planSelected: 'LEVEL 3 - Specialist',
          duration: duration,
          experienceLevel: 'Mid-Level (3-6 Years)',
          notes: ''
        });
      } else {
        alert('Submission failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error connecting to backend on port 5000.');
    } finally {
      setSubmitting(false);
    }
  };

  const plans = [
    {
      level: 'LEVEL 1',
      name: 'Starter',
      fee6: '₹7,500',
      fee12: '₹12,000',
      monthly: '₹3,500 – ₹5,000',
      frequency: '1 project / month',
      potential12: '₹42,000 – ₹60,000',
      popular: false
    },
    {
      level: 'LEVEL 2',
      name: 'Professional',
      fee6: '₹13,500',
      fee12: '₹24,000',
      monthly: '₹7,000 – ₹10,000',
      frequency: '1 project / month',
      potential12: '₹84,000 – ₹1,20,000',
      popular: false
    },
    {
      level: 'LEVEL 3',
      name: 'Specialist',
      fee6: '₹22,500',
      fee12: '₹42,000',
      monthly: '₹12,500 – ₹17,000',
      frequency: '1 project / month',
      potential12: '₹1,50,000 – ₹2,04,000',
      popular: true
    },
    {
      level: 'LEVEL 4',
      name: 'Elite',
      fee6: '₹36,500',
      fee12: '₹70,000',
      monthly: '₹20,500 – ₹28,000',
      frequency: '1 project / month',
      potential12: '₹2,46,000 – ₹3,36,000',
      popular: false
    },
    {
      level: 'LEVEL 5',
      name: 'Auron',
      fee6: '₹56,500',
      fee12: '₹1,10,000',
      monthly: '₹32,500 – ₹42,500',
      frequency: '1 project / month',
      potential12: '₹3,90,000 – ₹5,10,000',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-red-600 selection:text-white">
      {/* Background Red Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-red-900/15 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-neutral-950 border-b border-neutral-900 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-red-600/30">
              AA
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider text-white flex items-center gap-2">
                ALPHA AURON <span className="text-xs text-red-500 font-mono">TALENT FORGE</span>
              </h1>
              <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">PRIVATE LIMITED</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition ${
                activeTab === 'landing' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Public Funnel
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition flex items-center space-x-2 ${
                activeTab === 'dashboard' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Hima Bindu Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'landing' ? (
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-16">
          {/* Header Title Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <p className="text-xs font-mono tracking-widest text-red-500 uppercase">MEMBERSHIP LEVELS</p>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Five Levels. One Ladder.</h1>
            <p className="text-neutral-400 text-sm leading-relaxed">
              One-time program fee per membership period. Illustrative monthly project values are ranges — actual assignments and values are governed by project availability and applicable project agreements.
            </p>




            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs px-5 py-3 rounded-xl flex items-center space-x-2 transition">
                <Download className="w-4 h-4 text-red-500" />
                <span>Download Brochure (PDF)</span>
              </button>

              {/* 6 Months / 12 Months Toggle */}
              <div className="bg-neutral-900 p-1 rounded-xl border border-neutral-800 flex items-center space-x-1">
                <button
                  onClick={() => setDuration('6 Months')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    duration === '6 Months' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  6 Months
                </button>
                <button
                  onClick={() => setDuration('12 Months')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    duration === '12 Months' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  12 Months
                </button>
              </div>
            </div>

            <div className="inline-block mt-4 bg-red-950/40 border border-red-900/50 px-4 py-1.5 rounded-full text-xs text-red-400 font-medium">
              Assigned Executive: <strong>Hima Bindu (AA-TF-8842)</strong>
            </div>
          </div>

          {/* 5 Membership Plan Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((p, idx) => (
              <div
                key={idx}
                className={`bg-neutral-950 rounded-3xl p-8 border flex flex-col justify-between relative transition duration-300 hover:border-red-600/60 ${
                  p.popular ? 'border-red-600 shadow-2xl shadow-red-900/20' : 'border-neutral-900'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3.5 left-8 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md">
                    POPULAR
                  </span>
                )}
                <div>
                  <p className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">{p.level}</p>
                  <h3 className="text-2xl font-black text-white mt-1">{p.name}</h3>

                  <div className="my-6">
                    <span className="text-4xl font-black text-white">
                      {duration === '12 Months' ? p.fee12 : p.fee6}
                    </span>
                    <span className="text-neutral-500 text-xs font-mono ml-2">
                      One-time fee · {duration}
                    </span>
                  </div>

                  <div className="space-y-4 text-xs border-t border-neutral-900 pt-6">
                    <div>
                      <p className="text-neutral-500">Illustrative monthly project value</p>
                      <p className="text-white font-bold text-sm mt-0.5">{p.monthly}</p>
                    </div>

                    <div className="flex justify-between items-center text-neutral-400 border-t border-neutral-900/50 pt-3">
                      <span>Project frequency</span>
                      <span className="text-white font-semibold">{p.frequency}</span>
                    </div>

                    {duration === '12 Months' && (
                      <div className="border-t border-neutral-900/50 pt-3">
                        <p className="text-neutral-500">Illustrative 12-month potential</p>
                        <p className="text-red-500 font-bold text-sm mt-0.5">{p.potential12}</p>
                      </div>
                    )}
                  </div>
                </div>

                <a
                  href="#enquiry-section"
                  onClick={() => setFormData({ ...formData, planSelected: `${p.level} - ${p.name}` })}
                  className={`mt-8 block text-center font-bold text-xs py-3.5 rounded-xl transition ${
                    p.popular
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800'
                  }`}
                >
                  Apply for {p.name}
                </a>
              </div>
            ))}
          </div>

          {/* Fee Comparison Table Section */}
          <section className="bg-neutral-950 border border-neutral-900 rounded-3xl p-8 md:p-10 space-y-6">
            <div>
              <p className="text-xs font-mono tracking-widest text-red-500 uppercase">FEE COMPARISON</p>
              <h2 className="text-2xl font-black text-white mt-1">12 Months Costs Less Than 6 + 6.</h2>
              <p className="text-neutral-400 text-xs mt-1">Every 12-month membership is priced below two consecutive 6-month memberships at the same level.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead>
                  <tr className="border-b border-neutral-900 text-neutral-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Level</th>
                    <th className="py-3 px-4">6-Month Fee</th>
                    <th className="py-3 px-4">12-Month Fee</th>
                    <th className="py-3 px-4 text-red-500">Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {plans.map((p, idx) => (
                    <tr key={idx} className="hover:bg-neutral-900/40">
                      <td className="py-3 px-4 font-bold text-white">{p.name}</td>
                      <td className="py-3 px-4 text-neutral-400">{p.fee6}</td>
                      <td className="py-3 px-4 text-white font-bold">{p.fee12}</td>
                      <td className="py-3 px-4 text-red-500 font-bold">Save 20%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Lead Enquiry Form Section */}
          <section id="enquiry-section" className="bg-neutral-950 border border-neutral-900 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto shadow-2xl">
            <div className="text-center mb-8">
              <span className="text-[10px] font-mono tracking-widest text-red-500 bg-red-950/50 border border-red-900/50 px-3 py-1 rounded-full uppercase">
                Attributed Lead Form
              </span>
              <h2 className="text-3xl font-black text-white mt-3">Membership Enquiry Form</h2>
              <p className="text-neutral-400 text-xs mt-1">
                Directly attributed to Talent Forge Executive: <strong className="text-red-500">Hima Bindu (AA-TF-8842)</strong>
              </p>
            </div>

            {successMsg && (
              <div className="mb-6 bg-emerald-950/60 border border-emerald-900 text-emerald-400 p-4 rounded-xl text-xs flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2">Selected Level *</label>
                  <select
                    value={formData.planSelected}
                    onChange={e => setFormData({ ...formData, planSelected: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600"
                  >
                    <option>LEVEL 1 - Starter</option>
                    <option>LEVEL 2 - Professional</option>
                    <option>LEVEL 3 - Specialist</option>
                    <option>LEVEL 4 - Elite</option>
                    <option>LEVEL 5 - Auron</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2">Experience Level *</label>
                <select
                  value={formData.experienceLevel}
                  onChange={e => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600"
                >
                  <option>Fresher / Early Career (0-2 Years)</option>
                  <option>Mid-Level (3-6 Years)</option>
                  <option>Senior Professional (7+ Years)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2">Notes / Career Goals</label>
                <textarea
                  rows="3"
                  placeholder="State your domain preferences..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center space-x-2 text-xs uppercase tracking-wider"
              >
                <span>{submitting ? 'Submitting...' : 'Submit Enquiry to Hima Bindu'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </section>
        </main>
      ) : (
        /* Hima Bindu Executive Management Portal */
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-8">
          <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-3 py-1 rounded-full uppercase">
                EXECUTIVE DASHBOARD
              </span>
              <h2 className="text-3xl font-black text-white mt-3">Hima Bindu's Lead Management</h2>
              <p className="text-neutral-400 text-xs mt-1">Associate ID: <span className="text-red-500 font-mono">AA-TF-8842</span> • Alpha Auron Private Limited</p>
            </div>

            <a
              href="http://localhost:5000/api/leads/export-excel"
              target="_blank"
              rel="noreferrer"
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-red-600/20 transition flex items-center space-x-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Real-Time Excel (.xlsx)</span>
            </a>
          </div>

          <div className="bg-neutral-950 border border-neutral-900 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-neutral-900 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Attributed Enquiries ({leads.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead>
                  <tr className="bg-neutral-900 text-neutral-500 text-[10px] uppercase font-mono tracking-wider border-b border-neutral-800">
                    <th className="p-4">Lead ID</th>
                    <th className="p-4">Candidate Name</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Plan Selected</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {leads.map(lead => (
                    <tr key={lead._id} className="hover:bg-neutral-900/40 transition">
                      <td className="p-4 font-mono font-bold text-red-500">{lead.leadId}</td>
                      <td className="p-4 font-bold text-white">{lead.fullName}</td>
                      <td className="p-4">
                        <div>{lead.email}</div>
                        <div className="text-[10px] text-neutral-500">{lead.phone}</div>
                      </td>
                      <td className="p-4 text-white font-medium">{lead.planSelected}</td>
                      <td className="p-4 text-neutral-400">{lead.duration || '12 Months'}</td>
                      <td className="p-4">
                        <span className="bg-amber-950/50 border border-amber-900 text-amber-400 text-[10px] px-2.5 py-1 rounded-full font-mono">
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-900 py-10 px-6 text-center text-xs text-neutral-500">
        <p>© 2026 Alpha Auron Private Limited. All Rights Reserved. Talent Forge Division.</p>
        <p className="mt-1 font-mono">Assigned Executive: Hima Bindu (AA-TF-8842)</p>
      </footer>
    </div>
  );
}