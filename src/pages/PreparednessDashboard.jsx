import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Shield, Users, AlertTriangle, CheckCircle2, FireExtinguisher, DoorOpen, MapPin, Heart, Bell, Activity, TrendingUp } from 'lucide-react';
import { useThemeContext } from '../App';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

const SAFETY_RESOURCES = [
  { name: 'Fire Extinguishers', count: 48, icon: FireExtinguisher, color: '#ef4444', bgColor: 'bg-red-500/10', textColor: 'text-red-400', borderColor: 'border-red-500/20', status: 'Adequate' },
  { name: 'Emergency Exits', count: 36, icon: DoorOpen, color: '#3b82f6', bgColor: 'bg-blue-500/10', textColor: 'text-blue-400', borderColor: 'border-blue-500/20', status: 'Adequate' },
  { name: 'Assembly Points', count: 12, icon: MapPin, color: '#f97316', bgColor: 'bg-orange-500/10', textColor: 'text-orange-400', borderColor: 'border-orange-500/20', status: 'Adequate' },
  { name: 'First Aid Kits', count: 72, icon: Heart, color: '#10b981', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-400', borderColor: 'border-emerald-500/20', status: 'Well Stocked' },
  { name: 'Emergency Alarms', count: 24, icon: Bell, color: '#a855f7', bgColor: 'bg-violet-500/10', textColor: 'text-violet-400', borderColor: 'border-violet-500/20', status: 'All Functional' },
  { name: 'Fire Extinguishers (Additional)', count: 24, icon: FireExtinguisher, color: '#eab308', bgColor: 'bg-yellow-500/10', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/20', status: 'Spare Units' }
];

const POPULATION_DATA = { students: 2450, faculty: 180, visitors: 120, staff: 85 };

const PREPAREDNESS_METRICS = [
  { label: 'Preparedness Score', value: 82, max: 100, color: '#10b981', icon: Shield },
  { label: 'Safety Compliance', value: 88, max: 100, color: '#3b82f6', icon: CheckCircle2 },
  { label: 'Risk Level (Low)', value: 15, max: 100, color: '#eab308', icon: AlertTriangle, invert: true },
  { label: 'Drill Readiness', value: 76, max: 100, color: '#a855f7', icon: Activity }
];

const MONTHLY_DATA = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  drills: [3, 2, 4, 1, 5, 3, 2, 4, 3, 5, 2, 4],
  participants: [180, 150, 240, 90, 310, 200, 140, 260, 190, 290, 130, 250],
  incidents: [1, 0, 2, 0, 1, 0, 3, 1, 0, 1, 0, 0]
};

const COURSE_COMPLETION = {
  labels: ['Fire Safety', 'Flood Protocol', 'Earthquake', 'Active Threat', 'First Aid', 'Cyclone'],
  data: [85, 62, 73, 58, 44, 39],
  colors: ['#ef4444', '#3b82f6', '#f97316', '#8b5cf6', '#10b981', '#a855f7']
};

const doughnutData = {
  labels: COURSE_COMPLETION.labels,
  datasets: [{ data: COURSE_COMPLETION.data, backgroundColor: COURSE_COMPLETION.colors.map(c => `${c}80`), borderColor: COURSE_COMPLETION.colors, borderWidth: 2 }]
};

const barData = {
  labels: MONTHLY_DATA.labels,
  datasets: [
    { label: 'Drills Conducted', data: MONTHLY_DATA.drills, backgroundColor: '#ef444480', borderColor: '#ef4444', borderWidth: 1, borderRadius: 4, yAxisID: 'y' },
    { label: 'Participants', data: MONTHLY_DATA.participants, backgroundColor: '#3b82f680', borderColor: '#3b82f6', borderWidth: 1, borderRadius: 4, yAxisID: 'y1' }
  ]
};

const lineData = {
  labels: MONTHLY_DATA.labels,
  datasets: [{
    label: 'Safety Incidents', data: MONTHLY_DATA.incidents, borderColor: '#eab308',
    backgroundColor: 'rgba(234, 179, 8, 0.1)', fill: true, tension: 0.4,
    pointBackgroundColor: MONTHLY_DATA.incidents.map(v => v === 0 ? '#10b981' : '#eab308'), pointRadius: 4
  }]
};

function MetricCard({ metric, index }) {
  const Icon = metric.icon;
  const val = metric.invert ? metric.max - metric.value : metric.value;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="premium-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{metric.label}</span>
        <Icon className="h-5 w-5" style={{ color: metric.color }} />
      </div>
      <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
        {metric.label === 'Risk Level (Low)' ? (
          <span className="text-emerald-500 dark:text-emerald-400">Low</span>
        ) : (
          <>{metric.value}<span className="text-lg text-slate-600 dark:text-slate-500">/{metric.max}</span></>
        )}
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(val / metric.max) * 100}%` }}
          transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
          style={{ background: metric.color }}
        />
      </div>
    </motion.div>
  );
}

function ResourceCard({ resource, index }) {
  const Icon = resource.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl border ${resource.borderColor} ${resource.bgColor}`}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className="h-5 w-5" style={{ color: resource.color }} />
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${resource.borderColor} ${resource.textColor}`}>{resource.status}</span>
      </div>
      <div className={`text-2xl font-extrabold ${resource.textColor}`}>{resource.count}</div>
      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{resource.name}</div>
    </motion.div>
  );
}

export default function PreparednessDashboard() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const chartOptions = useMemo(() => ({
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: textColor, font: { size: 10 } } } },
    scales: {
      x: { ticks: { color: textColor, font: { size: 9 } }, grid: { color: gridColor } },
      y: { ticks: { color: textColor, font: { size: 9 } }, grid: { color: gridColor }, beginAtZero: true }
    }
  }), [isDark]);

  const barOptions = useMemo(() => ({
    ...chartOptions,
    scales: { ...chartOptions.scales, y1: { position: 'right', grid: { display: false }, ticks: { color: textColor, font: { size: 9 } }, beginAtZero: true } }
  }), [chartOptions, isDark]);

  const totalPop = POPULATION_DATA.students + POPULATION_DATA.faculty + POPULATION_DATA.visitors + POPULATION_DATA.staff;

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500 dark:text-red-400">▶ Institution Dashboard</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-3">
          <Shield className="h-8 w-8 text-emerald-500" />
          School & College Preparedness Dashboard
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Real-time institution safety metrics, resource tracking, and preparedness analytics.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(POPULATION_DATA).map(([key, val], idx) => (
          <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
            className="premium-card p-4"
          >
            <div className="text-xs text-slate-600 dark:text-slate-500 uppercase tracking-wider font-bold mb-1">{key}</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{val.toLocaleString()}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {PREPAREDNESS_METRICS.map((metric, idx) => <MetricCard key={metric.label} metric={metric} index={idx} />)}
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-500" />
          Safety Resources
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {SAFETY_RESOURCES.map((r, idx) => <ResourceCard key={r.name} resource={r} index={idx} />)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="premium-card-static p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Course Completion Rates</h3>
          <div className="h-64">
            <Doughnut data={doughnutData} options={{ ...chartOptions, plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 10 }, padding: 12 } } } }} />
          </div>
        </div>
        <div className="premium-card-static p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Monthly Drill Activity</h3>
          <div className="h-64"><Bar data={barData} options={barOptions} /></div>
        </div>
      </div>

      <div className="premium-card-static p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
          Safety Incidents Trend
        </h3>
        <div className="h-48"><Line data={lineData} options={chartOptions} /></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{totalPop.toLocaleString()}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Total Population</div>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{SAFETY_RESOURCES.reduce((a, r) => a + r.count, 0)}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Safety Resources</div>
        </div>
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">{MONTHLY_DATA.drills.reduce((a, b) => a + b, 0)}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Annual Drills</div>
        </div>
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
          <div className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">{MONTHLY_DATA.incidents.reduce((a, b) => a + b, 0)}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Incidents (YTD)</div>
        </div>
      </div>
    </div>
  );
}
