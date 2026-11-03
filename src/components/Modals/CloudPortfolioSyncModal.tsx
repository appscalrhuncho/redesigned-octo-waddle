import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { 
  ShieldCheck, 
  X, 
  Cloud, 
  Lock, 
  Server, 
  Smartphone, 
  Database, 
  CheckCircle2, 
  Building2, 
  Users, 
  Key, 
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  Wifi,
  RefreshCw,
  FolderGit2
} from 'lucide-react';

export const CloudPortfolioSyncModal: React.FC = () => {
  const { isCloudSyncModalOpen, closeCloudSyncModal, properties, activeProperty } = useHotel();
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'tenant_sim' | 'roadmap'>('overview');
  
  // Interactive Simulator State
  const [simulatedOrg, setSimulatedOrg] = useState<'aura_resorts' | 'luxe_ventures'>('aura_resorts');

  if (!isCloudSyncModalOpen) return null;

  const orgs = {
    aura_resorts: {
      name: 'Aura Luxury Resorts Group',
      orgId: 'org_aura_8892',
      tier: 'Enterprise SaaS Tier',
      plan: 'Multi-Property Global',
      allowedProperties: ['The Azure Sanctuary (Cliffside)', 'Azure Alpine Lodge (Zermatt)'],
      teamMembers: [
        { name: 'Sarah Chen', role: 'Group Portfolio VP', email: 's.chen@aurahotels.com' },
        { name: 'Marcus Vance', role: 'General Manager (Cliffside)', email: 'm.vance@aurahotels.com' },
        { name: 'Elena Vasquez', role: 'Head of Housekeeping', email: 'e.vasquez@aurahotels.com' }
      ]
    },
    luxe_ventures: {
      name: 'Luxe Heritage Boutique Inc.',
      orgId: 'org_luxe_4102',
      tier: 'Professional Tier',
      plan: 'Single Brand Cluster',
      allowedProperties: ['Grand Palais Suite Hotel (Paris)', 'Villa Bellagio (Lake Como)'],
      teamMembers: [
        { name: 'Jean-Paul Laurent', role: 'Managing Partner', email: 'jp@luxeboutique.fr' },
        { name: 'Claire Dubois', role: 'Front Office Director', email: 'c.dubois@luxeboutique.fr' }
      ]
    }
  };

  const currentSimOrg = orgs[simulatedOrg];

  return (
    <div 
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#060D12]/80 p-3 sm:p-5 backdrop-blur-md"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeCloudSyncModal();
      }}
    >
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl border border-[#263540] bg-[#0C1218] text-[#E8F0F4] shadow-2xl">
        
        {/* Header */}
        <div className="border-b border-[#202C36] bg-[#0E161F] p-5 sm:p-6 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B8FF00]/15 text-[#B8FF00] border border-[#B8FF00]/30 shadow-[0_0_20px_rgba(184,255,0,0.2)]">
                <Cloud className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8FF00]">
                    SaaS Architecture Blueprint
                  </span>
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                    Production Roadmap
                  </span>
                </div>
                <h2 className="mt-0.5 font-serif-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Keep hotel workspaces private and synced across devices
                </h2>
              </div>
            </div>
            
            <button
              onClick={closeCloudSyncModal}
              aria-label="Close dialog"
              className="rounded-xl p-2 text-[#8EA299] transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === 'overview' 
                  ? 'bg-[#B8FF00] text-[#081015]' 
                  : 'bg-[#152028] text-[#A6B4AE] hover:text-white hover:bg-[#1D2B35]'
              }`}
            >
              Executive Proposal
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === 'architecture' 
                  ? 'bg-[#B8FF00] text-[#081015]' 
                  : 'bg-[#152028] text-[#A6B4AE] hover:text-white hover:bg-[#1D2B35]'
              }`}
            >
              Tenant Isolation Model
            </button>
            <button
              onClick={() => setActiveTab('tenant_sim')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === 'tenant_sim' 
                  ? 'bg-[#B8FF00] text-[#081015]' 
                  : 'bg-[#152028] text-[#A6B4AE] hover:text-white hover:bg-[#1D2B35]'
              }`}
            >
              Interactive Org Simulator
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === 'roadmap' 
                  ? 'bg-[#B8FF00] text-[#081015]' 
                  : 'bg-[#152028] text-[#A6B4AE] hover:text-white hover:bg-[#1D2B35]'
              }`}
            >
              Backend Integration Steps
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-sm text-[#C9D6CE]">

          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Highlight Card matching exact screenshot */}
              <div className="rounded-2xl border border-[#2B3B33] bg-gradient-to-br from-[#121D17] to-[#0D1512] p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#B8FF00]/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-start gap-3.5 relative z-10">
                  <div className="p-2.5 rounded-xl bg-[#B8FF00]/10 border border-[#B8FF00]/25 text-[#B8FF00] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base">
                      Current SaaS Limitation vs Production Need
                    </h3>
                    <p className="mt-1.5 text-xs text-[#A8B7AF] leading-relaxed">
                      Hotel portfolios currently live in browser storage (<code className="text-[#B8FF00] bg-[#16231C] px-1 py-0.5 rounded">localStorage</code>). 
                      That works for a single-device prototype but does not provide production SaaS accounts, team collaboration, 
                      or reliable cross-device persistence. Adding authenticated organizations, server-side hotel/property storage, 
                      and access checks ensures each organization can manage multiple hotels without seeing another organization's data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Prototype State */}
                <div className="rounded-2xl border border-[#263540] bg-[#111A22] p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#202C36]">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Current: Browser-Local Prototype
                    </span>
                    <span className="text-[10px] text-[#71827B]">Active in this session</span>
                  </div>
                  <ul className="text-xs space-y-2 text-[#A6B4AE]">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-mono">1.</span>
                      <span>Scoped storage keys: <code className="text-white text-[11px]">hotel_rooms_v2::cliffside</code></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-mono">2.</span>
                      <span>Single-device only: clearing browser cache wipes custom hotel configurations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-mono">3.</span>
                      <span>No concurrent reservation locking between front desk tablets and guest booking engine</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-mono">4.</span>
                      <span>Portfolio management is local to the active browser instance</span>
                    </li>
                  </ul>
                </div>

                {/* Production SaaS State */}
                <div className="rounded-2xl border border-[#264235] bg-[#0F1E17] p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#21382C]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B8FF00] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#B8FF00]" />
                      Proposed: Multi-Tenant Cloud SaaS
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Enterprise Ready</span>
                  </div>
                  <ul className="text-xs space-y-2 text-[#B8C9C1]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#B8FF00] font-mono">✓</span>
                      <span>Strict multi-tenant organization boundaries (<code className="text-white text-[11px]">orgId</code> isolation)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#B8FF00] font-mono">✓</span>
                      <span>Real-time WebSocket / Firestore synchronization across all front desk terminals & phones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#B8FF00] font-mono">✓</span>
                      <span>Granular RBAC: General Managers, Desk Clerks, Housekeeping dispatch, Night Auditors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#B8FF00] font-mono">✓</span>
                      <span>Cryptographic digital keys with instant revocation and audit logging</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Action Banner */}
              <div className="rounded-2xl border border-[#263540] bg-[#101820] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-white text-xs">Ready to test simulated multi-organization boundaries?</h4>
                  <p className="text-[11px] text-[#8EA299] mt-0.5">Explore how Organization A and Organization B isolate portfolios with zero bleed-through.</p>
                </div>
                <button
                  onClick={() => setActiveTab('tenant_sim')}
                  className="px-4 py-2 rounded-xl bg-[#B8FF00] hover:bg-[#C8FF45] text-[#081015] font-bold text-xs flex items-center gap-2 shrink-0 transition-colors"
                >
                  <span>Test Org Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#253640] bg-[#111922] p-5 space-y-4">
                <h3 className="font-serif-heading text-base font-semibold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#00DDF2]" />
                  Hierarchical Database Schema & Security Isolation
                </h3>
                <p className="text-xs text-[#A6B4AE] leading-relaxed">
                  Every record in the platform is anchored to a root Organization. Security rules at the storage/database level enforce that users can only query records where their authenticated token matches the root organization.
                </p>

                <div className="font-mono text-xs bg-[#090E13] p-4 rounded-xl border border-[#1F2C37] text-[#C9D6CE] overflow-x-auto">
                  <div className="text-[#8EA299]">// Root Organization Document</div>
                  <div>/organizations/<span className="text-[#00DDF2]">{`{orgId}`}</span></div>
                  <div className="pl-4">├── name: "Aura Hospitality Group"</div>
                  <div className="pl-4">├── subscriptionTier: "enterprise_multi_property"</div>
                  <div className="pl-4">├── <span className="text-[#B8FF00]">properties/</span><span className="text-[#00DDF2]">{`{propertyId}`}</span> <span className="text-[#8EA299]">// Scoped Hotel Properties</span></div>
                  <div className="pl-8">├── name: "The Azure Sanctuary"</div>
                  <div className="pl-8">├── location: "Cliffside Cove"</div>
                  <div className="pl-8">├── <span className="text-emerald-400">rooms/</span><span className="text-[#00DDF2]">{`{roomId}`}</span></div>
                  <div className="pl-8">├── <span className="text-emerald-400">reservations/</span><span className="text-[#00DDF2]">{`{resId}`}</span></div>
                  <div className="pl-8">├── <span className="text-emerald-400">folios/</span><span className="text-[#00DDF2]">{`{folioId}`}</span></div>
                  <div className="pl-8">├── <span className="text-emerald-400">housekeeping/</span><span className="text-[#00DDF2]">{`{taskId}`}</span></div>
                  <div className="pl-4">└── <span className="text-purple-400">team_members/</span><span className="text-[#00DDF2]">{`{userId}`}</span> <span className="text-[#8EA299]">// RBAC Permissions</span></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-xl bg-[#16222C] border border-[#253644]">
                    <span className="font-bold text-white block">Tenant Verification</span>
                    <span className="text-[11px] text-[#8EA299] mt-0.5 block">Every read/write requires matching org claim</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#16222C] border border-[#253644]">
                    <span className="font-bold text-white block">Property Scoping</span>
                    <span className="text-[11px] text-[#8EA299] mt-0.5 block">Staff can be restricted to 1 or all hotels</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#16222C] border border-[#253644]">
                    <span className="font-bold text-white block">Audit Trail</span>
                    <span className="text-[11px] text-[#8EA299] mt-0.5 block">Immutable ledger of folio & key dispatches</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tenant_sim' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#131D26] border border-[#243340]">
                <div>
                  <span className="text-[10px] text-[#B8FF00] uppercase font-bold tracking-wider">Simulate Authenticated Organization</span>
                  <p className="text-xs text-white font-medium">Select an organization to inspect its private property portfolio:</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSimulatedOrg('aura_resorts')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      simulatedOrg === 'aura_resorts'
                        ? 'bg-[#B8FF00] text-[#081015]'
                        : 'bg-[#1C2833] text-[#A6B4AE] hover:text-white'
                    }`}
                  >
                    Org A (Aura Resorts)
                  </button>
                  <button
                    onClick={() => setSimulatedOrg('luxe_ventures')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      simulatedOrg === 'luxe_ventures'
                        ? 'bg-[#00DDF2] text-[#081015]'
                        : 'bg-[#1C2833] text-[#A6B4AE] hover:text-white'
                    }`}
                  >
                    Org B (Luxe Heritage)
                  </button>
                </div>
              </div>

              {/* Organization Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#111922] border border-[#223340] space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-[#1E2B35]">
                    <span className="text-xs font-bold text-white">{currentSimOrg.name}</span>
                    <span className="text-[10px] font-mono text-[#00DDF2] bg-[#162633] px-2 py-0.5 rounded">{currentSimOrg.orgId}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#8EA299] uppercase tracking-wider block">Isolated Hotels In Portfolio ({currentSimOrg.allowedProperties.length}):</span>
                    <div className="mt-2 space-y-1.5">
                      {currentSimOrg.allowedProperties.map((prop, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs bg-[#17232D] p-2 rounded-lg text-white">
                          <Building2 className="w-3.5 h-3.5 text-[#B8FF00]" />
                          <span>{prop}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Cross-org boundary active: Zero access to foreign properties</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#111922] border border-[#223340] space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-[#1E2B35]">
                    <span className="text-xs font-bold text-white">Authorized Team Roster</span>
                    <span className="text-[10px] text-[#B8FF00] bg-[#1D2B1C] px-2 py-0.5 rounded font-semibold">{currentSimOrg.plan}</span>
                  </div>
                  <div className="space-y-2">
                    {currentSimOrg.teamMembers.map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#17232D]">
                        <div>
                          <span className="font-semibold text-white block">{member.name}</span>
                          <span className="text-[10px] text-[#8EA299]">{member.email}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#20303D] text-[#A6C0D4] font-medium">
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <h3 className="font-serif-heading text-base font-semibold text-white">
                Step-by-Step Transition to Production SaaS
              </h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#111922] border border-[#243542] flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#B8FF00] text-[#081015] font-bold text-xs shrink-0">1</span>
                  <div>
                    <h4 className="font-semibold text-white text-xs">Provision Persistent Storage & Authentication</h4>
                    <p className="text-[11px] text-[#8EA299] mt-0.5">Connect Firebase or Cloud SQL to persist hotel accounts and provide email/OAuth sign-in.</p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#111922] border border-[#243542] flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#B8FF00] text-[#081015] font-bold text-xs shrink-0">2</span>
                  <div>
                    <h4 className="font-semibold text-white text-xs">Deploy Tenant Security Rules</h4>
                    <p className="text-[11px] text-[#8EA299] mt-0.5">Enforce database-level multi-tenancy so queries automatically filter by the user's organization ID.</p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#111922] border border-[#243542] flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#B8FF00] text-[#081015] font-bold text-xs shrink-0">3</span>
                  <div>
                    <h4 className="font-semibold text-white text-xs">Enable Real-Time Concurrency WebSockets</h4>
                    <p className="text-[11px] text-[#8EA299] mt-0.5">Sync room status, tape chart blocks, and concierge chats instantly across front desk and housekeeping tablets.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-[#202C36] bg-[#0E161F] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-[#8EA299]">
            <Server className="w-4 h-4 text-[#00DDF2]" />
            <span>Active Hotel Workspace: <strong className="text-white">{activeProperty}</strong></span>
          </div>
          <button
            onClick={closeCloudSyncModal}
            className="px-5 py-2 rounded-xl bg-[#B8FF00] hover:bg-[#C8FF45] text-[#081015] font-bold transition-colors"
          >
            Continue in Active Workspace
          </button>
        </div>

      </div>
    </div>
  );
};
