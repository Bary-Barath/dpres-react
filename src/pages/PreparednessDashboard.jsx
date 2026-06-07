import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Shield, Users, AlertTriangle, CheckCircle2, FireExtinguisher,
  DoorOpen, MapPin, Heart, Bell, Activity, TrendingUp, Building2, Zap
} from 'lucide-react';
import { useThemeContext } from '../App';
import BackToHomeButton from '../components/common/BackToHomeButton';
import ResourceCard from '../components/ResourceCard';
import ResourceLocationModal from '../components/ResourceLocationModal';
import { RESOURCE_LOCATIONS } from '../data/resourceLocations';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

const ICON_MAP = {
  'fire-extinguisher': FireExtinguisher,
  'emergency-exit': DoorOpen,
  'assembly-point': MapPin,
  'first-aid-kit': Heart,
  'emergency-alarm': Bell,
  'spare-extinguisher': FireExtinguisher
};

const SAFETY_RESOURCES = RESOURCE_LOCATIONS.map((r) => ({
  ...r,
  icon: ICON_MAP[r.id] ?? Shield
}));

const POPULATION_DATA = { Students: 850, Faculty: 65, Visitors: 25, Staff: 35 };
const POPULATION_COLORS = { Students: '#2563EB', Faculty: '#10B981', Visitors: '#F59E0B', Staff: '#8B5CF6' };

const PREPAREDNESS_METRICS = [
  { label: 'Preparedness Score', value: 82, max: 100, color: '#10B981', icon: Shield, trend: '+4%' },
  { label: 'Safety Compliance', value: 88, max: 100, color: '#2563EB', icon: CheckCircle2, trend: '+2%' },
  { label: 'Risk Level', value: 15, max: 100, color: '#EAB308', icon: AlertTriangle, invert: true, display: 'Low' },
  { label: 'Drill Readiness', value: 76, max: 100, color: '#8B5CF6', icon: Activity, trend: '+6%' }
];

const MONTHLY_DATA = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  drills: [2, 1, 3, 1, 4, 2, 1, 3, 2, 3, 1, 2],
  participants: [62, 48, 85, 30, 110, 72, 45, 92, 68, 98, 41, 87],
  incidents: [1, 0, 2, 0, 1, 0, 3, 1, 0, 1, 0, 0]
};

const COURSE_COMPLETION = {
  labels: ['Fire Safety', 'Flood Protocol', 'Earthquake', 'Cyclone Safety', 'First Aid'],
  data: [85, 62, 73, 58, 44],
  colors: ['#EF4444', '#3B82F6', '#F97316', '#06B6D4', '#10B981']
};

export default function PreparednessDashboard() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const [activeResource, setActiveResource] = useState(null);

  const chartOptions = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: textColor, font: { size: 10, family: 'Inter' }, padding: 12 } }
    },
    scales: {
      x: { ticks: { color: textColor, font: { size: 9 } }, grid: { color: gridColor } },
      y: { ticks: { color: textColor, font: { size: 9 } }, grid: { color: gridColor }, beginAtZero: true }
    }
  }), [isDark]);

  const barOptions = useMemo(() => ({
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y1: { position: 'right', grid: { display: false }, ticks: { color: textColor, font: { size: 9 } }, beginAtZero: true }
    }
  }), [chartOptions, isDark]);

  const totalPop = Object.values(POPULATION_DATA).reduce((a, b) => a + b, 0);

  const doughnutData = {
    labels: COURSE_COMPLETION.labels,
    datasets: [{
      data: COURSE_COMPLETION.data,
      backgroundColor: COURSE_COMPLETION.colors.map(c => `${c}70`),
      borderColor: COURSE_COMPLETION.colors,
      borderWidth: 2,
      hoverOffset: 6
    }]
  };

  const barData = {
    labels: MONTHLY_DATA.labels,
    datasets: [
      { label: 'Drills Conducted', data: MONTHLY_DATA.drills, backgroundColor: '#EF444480', borderColor: '#EF4444', borderWidth: 1.5, borderRadius: 6, yAxisID: 'y' },
      { label: 'Participants', data: MONTHLY_DATA.participants, backgroundColor: '#3B82F680', borderColor: '#3B82F6', borderWidth: 1.5, borderRadius: 6, yAxisID: 'y1' }
    ]
  };

  const lineData = {
    labels: MONTHLY_DATA.labels,
    datasets: [{
      label: 'Safety Incidents',
      data: MONTHLY_DATA.incidents,
      borderColor: '#EAB308',
      backgroundColor: 'rgba(234, 179, 8, 0.08)',
      fill: true, tension: 0.4,
      pointBackgroundColor: MONTHLY_DATA.incidents.map(v => v === 0 ? '#10b981' : '#eab308'),
      pointRadius: 5, pointBorderWidth: 2, pointBorderColor: '#fff'
    }]
  };

  const cardBase = isDark ? 'bg-[#0f172a] border border-white/[0.06]' : 'bg-white border border-slate-100';
  const cardShadow = isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.05)';

  return (
    <div className="space-y-7">
      <BackToHomeButton />
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <span className="section-label">Institution Dashboard</span>
        <h1 className={`text-2xl font-extrabold tracking-tight mt-1 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
            style={{ boxShadow: '0 6px 20px rgba(16,185,129,0.3)' }}>
            <Shield className="h-5 w-5 text-white" />
          </div>
          Campus Preparedness Dashboard
        </h1>
        <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Real-time institution safety metrics, resource tracking, and preparedness analytics.
        </p>
      </motion.div>

      {/* ── Population Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {Object.entries(POPULATION_DATA).map(([key, val], idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className={`rounded-2xl p-4 ${cardBase}`}
            style={{ boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : `0 4px 16px ${POPULATION_COLORS[key]}15, 0 1px 4px rgba(0,0,0,0.03)` }}
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{ background: `${POPULATION_COLORS[key]}15` }}>
                <Users className="h-4.5 w-4.5" style={{ color: POPULATION_COLORS[key] }} />
              </div>
              <div>
                <p className={`text-xl font-extrabold tabular-nums ${isDark ? 'text-white' : 'text-slate-800'}`}>{val.toLocaleString()}</p>
                <p className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{key}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Preparedness Metrics ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {PREPAREDNESS_METRICS.map((metric, idx) => {
          const Icon = metric.icon;
          const displayVal = metric.invert ? metric.max - metric.value : metric.value;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.07 }}
              className={`rounded-2xl p-5 ${cardBase}`}
              style={{ boxShadow: cardShadow }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {metric.label}
                </span>
                <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: `${metric.color}15` }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: metric.color }} />
                </div>
              </div>
              <div className={`text-2xl font-extrabold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {metric.display ? (
                  <span className="text-emerald-500">{metric.display}</span>
                ) : (
                  <>{metric.value}<span className={`text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/{metric.max}</span></>
                )}
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(displayVal / metric.max) * 100}%` }}
                  transition={{ duration: 1.1, delay: 0.4 + idx * 0.08, ease: 'easeOut' }}
                  style={{ background: metric.color, boxShadow: `0 0 8px ${metric.color}60` }}
                />
              </div>
              {metric.trend && (
                <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                  <TrendingUp className="h-3 w-3" /> {metric.trend}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── Safety Resources ── */}
      <div>
        <h2 className={`text-base font-bold mb-1.5 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <Building2 className="h-4.5 w-4.5 text-red-500" />
          Safety Resources
        </h2>
        <p className={`text-xs mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Click any card to view exact locations across campus.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SAFETY_RESOURCES.map((r, idx) => (
            <ResourceCard
              key={r.id}
              resource={r}
              isDark={isDark}
              cardBase={cardBase}
              idx={idx}
              onViewLocations={setActiveResource}
            />
          ))}
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl p-6 ${cardBase}`}
          style={{ boxShadow: cardShadow }}
        >
          <h3 className={`text-sm font-bold mb-5 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <div className="h-6 w-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-blue-500" />
            </div>
            Course Completion Rates
          </h3>
          <div className="h-64">
            <Doughnut
              data={doughnutData}
              options={{ ...chartOptions, plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 10, family: 'Inter' }, padding: 14 } } } }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          className={`rounded-2xl p-6 ${cardBase}`}
          style={{ boxShadow: cardShadow }}
        >
          <h3 className={`text-sm font-bold mb-5 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <div className="h-6 w-6 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Bell className="h-3.5 w-3.5 text-red-500" />
            </div>
            Monthly Drill Activity
          </h3>
          <div className="h-64"><Bar data={barData} options={barOptions} /></div>
        </motion.div>
      </div>

      {/* ── Incident Trend ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42 }}
        className={`rounded-2xl p-6 ${cardBase}`}
        style={{ boxShadow: cardShadow }}
      >
        <h3 className={`text-sm font-bold mb-5 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <div className="h-6 w-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Activity className="h-3.5 w-3.5 text-amber-500" />
          </div>
          Safety Incidents Trend (Annual)
        </h3>
        <div className="h-48"><Line data={lineData} options={chartOptions} /></div>
      </motion.div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {[
          { label: 'Total Population', value: totalPop.toLocaleString(), color: '#10B981', icon: Users },
          { label: 'Safety Resources', value: SAFETY_RESOURCES.reduce((a, r) => a + r.count, 0), color: '#2563EB', icon: Shield },
          { label: 'Annual Drills', value: MONTHLY_DATA.drills.reduce((a, b) => a + b, 0), color: '#8B5CF6', icon: Bell },
          { label: 'Incidents YTD', value: MONTHLY_DATA.incidents.reduce((a, b) => a + b, 0), color: '#F59E0B', icon: AlertTriangle }
        ].map((s, idx) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 + idx * 0.06 }}
            className={`rounded-2xl p-4 ${cardBase} text-center`}
            style={{ boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.25)' : `0 4px 16px ${s.color}12` }}
          >
            <div className="h-9 w-9 rounded-xl flex items-center justify-center mx-auto mb-2"
              style={{ background: `${s.color}15` }}>
              <s.icon className="h-4.5 w-4.5" style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
            <div className={`text-[11px] font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Resource Location Modal ── */}
      {activeResource && (
        <ResourceLocationModal
          resource={activeResource}
          onClose={() => setActiveResource(null)}
        />
      )}
    </div>
  );
}
