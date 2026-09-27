import React, { useState } from 'react';
import {
  Leaf,
  History,
  Settings,
  PlusCircle,
  LayoutDashboard,
  Menu,    // Hamburger icon
  X        // Close icon
} from 'lucide-react';

import DashboardView from './components/DashboardView';
import LogActivityView from './components/LogActivityView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import useAppStore from './hooks/useAppStore';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Naya state mobile menu ke liye
  const store = useAppStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'log', label: 'Log Activity', icon: PlusCircle },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Tab change aur menu close karne ka function
  const handleNavigation = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false); // Click hone par mobile menu close ho jayega
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Mobile Top Header (Sirf mobile screens par dikhega) */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
          <Leaf size={24} />
          PlanetPulse
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-slate-600 hover:text-emerald-600 focus:outline-none transition-colors"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Overlay Background (Jab menu open ho tab piche ka hissa dark karega) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <nav className={`
        fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
        transition-transform duration-300 ease-in-out
        bg-white/95 backdrop-blur w-64 border-r border-slate-200 p-4 flex flex-col gap-2 
        shadow-2xl md:shadow-sm md:sticky md:top-0 md:h-screen z-50
      `}>
        
        {/* Sidebar Header (App Name + Mobile Close Button) */}
        <div className="flex items-center justify-between text-emerald-600 font-bold text-xl mb-7 px-2 py-2">
          <div className="flex items-center gap-3">
            <Leaf size={28} />
            PlanetPulse
          </div>
          {/* Mobile mein X icon menu close karne ke liye */}
          <button 
            className="md:hidden text-slate-400 hover:text-slate-600" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Buttons */}
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)} // Custom function call kiya
              className={`group flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-bold shadow-sm translate-x-1'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
              }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-6 lg:p-10 overflow-hidden mt-0">
        {activeTab === 'dashboard' && (
          <DashboardView
            activities={store.activities}
            weeklyTarget={store.weeklyTarget}
          />
        )}

        {activeTab === 'log' && (
          <LogActivityView onSave={store.addActivity} />
        )}

        {activeTab === 'history' && (
          <HistoryView
            activities={store.activities}
            onDelete={store.deleteActivity}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            weeklyTarget={store.weeklyTarget}
            updateWeeklyTarget={store.updateWeeklyTarget}
            clearAllData={store.clearAllData}
          />
        )}
      </main>
    </div>
  );
}