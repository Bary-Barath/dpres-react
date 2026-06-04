import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, AlertTriangle, MapPin, Hospital, Navigation, X, Heart, Shield, ExternalLink, Droplets, Flame, Ambulance } from 'lucide-react';
import { navigate } from '../hooks/useRoute';

const EMERGENCY_CONTACTS = [
  { name: 'Ambulance', number: '108', icon: Ambulance, color: '#ef4444', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' },
  { name: 'Fire Service', number: '101', icon: Flame, color: '#f97316', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20' },
  { name: 'Police', number: '100', icon: Shield, color: '#3b82f6', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
  { name: 'Disaster Helpline', number: '1070', icon: AlertTriangle, color: '#a855f7', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/20' }
];

const SOS_MESSAGES = [
  'EMERGENCY — Tap to activate SOS mode',
  'YOUR SAFETY IS THE PRIORITY',
  'STAY CALM — HELP IS ON THE WAY',
  'EMERGENCY SERVICES ARE READY'
];

const NEARBY_HOSPITALS_MOCK = [
  { name: 'City General Hospital', distance: '1.2 km', phone: '+91-22-23456789', address: '123 Healthcare Ave, Downtown' },
  { name: 'University Medical Center', distance: '2.5 km', phone: '+91-22-34567890', address: '456 College Road, University Area' },
  { name: 'Apex Trauma Center', distance: '3.8 km', phone: '+91-22-45678901', address: '789 Emergency Blvd, West Side' }
];

function EmergencyContact({ contact, index, onCall }) {
  const Icon = contact.icon;
  return (
    <motion.a
      href={`tel:${contact.number}`}
      onClick={(e) => { e.preventDefault(); onCall(contact.number); }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`group flex items-center justify-between p-4 rounded-xl border ${contact.borderColor} ${contact.bgColor} hover:bg-[#f3f4f6] dark:hover:bg-slate-800 transition-all cursor-pointer`}
    >
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: `${contact.color}20` }}>
          <Icon className="h-6 w-6" style={{ color: contact.color }} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{contact.name}</h4>
          <p className="text-lg font-mono font-extrabold tracking-wider" style={{ color: contact.color }}>{contact.number}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border ${contact.borderColor}`} style={{ color: contact.color }}>
          <Phone className="h-3.5 w-3.5" /> CALL
        </span>
      </div>
    </motion.a>
  );
}

function HospitalCard({ hospital, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="premium-card p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Hospital className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{hospital.name}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">{hospital.distance} · {hospital.address}</p>
          </div>
        </div>
        <a
          href={`tel:${hospital.phone}`}
          className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
        >
          <Phone className="h-4 w-4" />
        </a>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-500">
        <Navigation className="h-3 w-3" />
        {hospital.address}
      </div>
    </motion.div>
  );
}

export default function SOSDashboard() {
  const [sosActive, setSosActive] = useState(false);
  const [currentMsg, setCurrentMsg] = useState(0);
  const [showHospitals, setShowHospitals] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [hospitals, setHospitals] = useState(NEARBY_HOSPITALS_MOCK);

  useEffect(() => {
    if (!sosActive) return;
    const interval = setInterval(() => {
      setCurrentMsg(prev => (prev + 1) % SOS_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [sosActive]);

  const handleSOS = useCallback(() => {
    setSosActive(prev => !prev);
    if (!sosActive) {
      setCurrentMsg(0);
      // Attempt to get location
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocationStatus('success');
            // In production, fetch hospitals from API using coords
            setHospitals(NEARBY_HOSPITALS_MOCK);
          },
          () => {
            setLocationStatus('denied');
            setHospitals(NEARBY_HOSPITALS_MOCK);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
        setShowHospitals(true);
      } else {
        setLocationStatus('unsupported');
        setHospitals(NEARBY_HOSPITALS_MOCK);
        setShowHospitals(true);
      }
    } else {
      setShowHospitals(false);
    }
  }, [sosActive]);

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-400">▶ Emergency Response</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          Emergency SOS Dashboard
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          One-tap access to emergency services. All emergency numbers are directly dialable from this dashboard.
        </p>
      </div>

      {/* SOS Button */}
      <div className="flex flex-col items-center py-6">
        <motion.button
          onClick={handleSOS}
          whileTap={{ scale: 0.95 }}
          className={`relative w-48 h-48 rounded-full font-extrabold text-2xl tracking-widest transition-all duration-300 shadow-2xl ${
            sosActive
              ? 'bg-red-600 text-white ring-8 ring-red-500/30 animate-pulse'
              : 'bg-gradient-to-br from-red-600 to-red-800 text-white hover:from-red-500 hover:to-red-700 ring-4 ring-red-500/20 hover:ring-red-500/40'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <AlertTriangle className={`h-10 w-10 mb-2 ${sosActive ? 'animate-bounce' : ''}`} />
            <span>SOS</span>
          </div>
          {sosActive && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-30" />
              <div className="absolute -inset-4 rounded-full border-2 border-red-500/20 animate-pulse" />
            </>
          )}
        </motion.button>
        <AnimatePresence mode="wait">
          {sosActive && (
            <motion.p
              key={currentMsg}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 text-lg font-bold text-red-400 tracking-wide text-center"
            >
              {SOS_MESSAGES[currentMsg]}
            </motion.p>
          )}
        </AnimatePresence>
        {!sosActive && (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-500 text-center">
            Tap the SOS button to display emergency contacts and nearby hospitals
          </p>
        )}
      </div>

      {/* Emergency Contacts */}
      <AnimatePresence>
        {sosActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Phone className="h-5 w-5 text-red-500" />
              Emergency Contacts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {EMERGENCY_CONTACTS.map((contact, idx) => (
                <EmergencyContact key={contact.number} contact={contact} index={idx} onCall={handleCall} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nearby Hospitals */}
      <AnimatePresence>
        {sosActive && showHospitals && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Hospital className="h-5 w-5 text-emerald-400" />
              Nearby Hospitals
              <span className="text-xs font-normal text-slate-600 dark:text-slate-500 ml-2">
                {locationStatus === 'success' ? '(Using your location)' : '(Sample data)'}
              </span>
            </h2>
            <div className="space-y-2">
              {hospitals.map((h, idx) => (
                <HospitalCard key={idx} hospital={h} index={idx} />
              ))}
            </div>
            {locationStatus === 'denied' && (
              <p className="text-xs text-slate-600 dark:text-slate-500 flex items-center gap-1.5">
                <Navigation className="h-3 w-3" />
                Enable location access to see hospitals near you.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => navigate('#/portal/contacts')}
          className="premium-card p-4 text-center transition-colors hover:shadow-lg"
        >
          <Phone className="h-5 w-5 text-blue-400 mx-auto mb-1" />
          <span className="text-xs text-slate-600 dark:text-slate-400">All Contacts</span>
        </button>
        <button
          onClick={() => navigate('#/risk-map')}
          className="premium-card p-4 text-center transition-colors hover:shadow-lg"
        >
          <MapPin className="h-5 w-5 text-orange-400 mx-auto mb-1" />
          <span className="text-xs text-slate-600 dark:text-slate-400">Risk Map</span>
        </button>
        <button
          onClick={() => navigate('#/learning-hub')}
          className="premium-card p-4 text-center transition-colors hover:shadow-lg"
        >
          <Heart className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
          <span className="text-xs text-slate-600 dark:text-slate-400">First Aid</span>
        </button>
        <button
          onClick={() => navigate('#/portal/simulator')}
          className="premium-card p-4 text-center transition-colors hover:shadow-lg"
        >
          <Shield className="h-5 w-5 text-purple-400 mx-auto mb-1" />
          <span className="text-xs text-slate-600 dark:text-slate-400">AI Assistant</span>
        </button>
      </div>
    </div>
  );
}
