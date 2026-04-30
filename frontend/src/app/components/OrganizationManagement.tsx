import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, ChevronDown, ChevronUp, Plus, X } from '@/icons/lucideMuiAdapter';

interface Branch {
  id: string;
  name: string;
  zone: string;
}

interface Organization {
  id: string;
  name: string;
  branches: Branch[];
}

const orgDataInit: Organization[] = [
  { id: 'org-01', name: 'Acme Corp', branches: [{ id: 'b-01', name: 'Headquarters', zone: 'Zone A' }, { id: 'b-02', name: 'Warehouse', zone: 'Zone B' }] },
  { id: 'org-02', name: 'Globex Inc', branches: [{ id: 'b-03', name: 'Main Office', zone: 'Zone C' }] },
  { id: 'org-03', name: 'Icienco Ltd', branches: [{ id: 'b-04', name: 'Main Office', zone: 'Zone D' }] },
  { id: 'org-04', name: 'AirTech Solutions', branches: [{ id: 'b-05', name: 'HQ', zone: 'Zone E' }, { id: 'b-06', name: 'Warehouse', zone: 'Zone F' }] },
];

export const OrganizationManagement = () => {
  const [orgData, setOrgData] = useState<Organization[]>(orgDataInit);
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null);
  const [showAddOrgPanel, setShowAddOrgPanel] = useState(false);
  const [showAddBranchPanel, setShowAddBranchPanel] = useState<string | null>(null);
  const [newOrgName, setNewOrgName] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchZone, setNewBranchZone] = useState('');

  const handleAddOrganization = () => {
    if (!newOrgName) return;
    const newOrg: Organization = { id: `org-${Date.now()}`, name: newOrgName, branches: [] };
    setOrgData([newOrg, ...orgData]);
    setNewOrgName('');
    setShowAddOrgPanel(false);
  };

  const handleAddBranch = (orgId: string) => {
    if (!newBranchName || !newBranchZone) return;
    const updatedOrgs = orgData.map((org) => {
      if (org.id === orgId) {
        const newBranch: Branch = { id: `b-${Date.now()}`, name: newBranchName, zone: newBranchZone };
        return { ...org, branches: [...org.branches, newBranch] };
      }
      return org;
    });
    setOrgData(updatedOrgs);
    setNewBranchName('');
    setNewBranchZone('');
    setShowAddBranchPanel(null);
  };

  return (
    <div className="flex h-full gap-4 relative">
      <div className="flex-1 flex flex-col gap-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Organizations</h2>
          <button
            onClick={() => setShowAddOrgPanel(true)}
            className="flex items-center gap-2 px-3 py-2 bg-[var(--brand-600)] text-white rounded-md text-sm font-semibold hover:bg-[var(--brand-700)] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Organization
          </button>
        </div>

        {/* Table */}
        <div className="bg-[var(--surface-0)] rounded-lg border border-[var(--surface-border)] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[var(--surface-0)]/95 backdrop-blur-sm border-b border-[var(--surface-border)]">
              <tr>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Organization</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Branches</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--surface-border)]">
              {orgData.map((org) => {
                const isExpanded = expandedOrg === org.id;

                return (
                  <React.Fragment key={org.id}>
                    <motion.tr
                      whileHover={{ backgroundColor: 'var(--surface-2)' }}
                      className={`transition-colors ${isExpanded ? 'bg-[var(--brand-200)]/30' : ''}`}
                    >
                      <td className="px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-[var(--surface-2)] border border-[var(--surface-border)] flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-[var(--text-muted)]" />
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">{org.name}</span>
                      </td>

                      <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
                        {org.branches.length} Branch(es)
                      </td>

                      {/* Buttons aligned properly */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">

                          {/* Chevron */}
                          <button
                            onClick={() => setExpandedOrg(isExpanded ? null : org.id)}
                            className="p-2 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] transition-all duration-200"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 transition-transform duration-200 hover:scale-110" />
                            ) : (
                              <ChevronDown className="w-4 h-4 transition-transform duration-200 hover:scale-110" />
                            )}
                          </button>

                          {/* Add Branch */}
                          <button
                            onClick={() => setShowAddBranchPanel(org.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-[var(--brand-600)] text-white rounded-md text-sm font-semibold hover:bg-[var(--brand-700)] transition-all"
                          >
                            <Plus className="w-4 h-4" />
                            Add Branch
                          </button>

                        </div>
                      </td>
                    </motion.tr>

                    {/* Expanded Row */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-[var(--surface-1)]"
                        >
                          <td colSpan={3} className="px-4 py-3">
                            <div className="space-y-3">
                              {org.branches.map((branch) => (
                                <div
                                  key={branch.id}
                                  className="flex justify-between items-center bg-[var(--surface-0)] p-3 rounded-md border border-[var(--surface-border)]"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-[var(--text-primary)]">
                                      {branch.name}
                                    </p>
                                    <p className="text-[10px] text-[var(--text-muted)]">
                                      {branch.zone}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Organization Panel */}
      <AnimatePresence>
        {showAddOrgPanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-[var(--surface-0)] border border-[var(--surface-border)] rounded-lg overflow-hidden shadow-lg"
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-[var(--text-primary)] text-lg">
                  New Organization
                </h3>
                <button
                  onClick={() => setShowAddOrgPanel(false)}
                  title="Close panel"
                  aria-label="Close panel"
                  className="p-2 hover:bg-[var(--surface-2)] rounded-full text-[var(--text-muted)] transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <input
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                placeholder="Organization Name"
                className="mb-4 px-3 py-2 border border-[var(--surface-border)] bg-[var(--surface-1)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-200)]"
              />

              <button
                onClick={handleAddOrganization}
                className="py-2.5 bg-[var(--brand-600)] text-white rounded-md text-sm font-semibold hover:bg-[var(--brand-700)] transition"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Branch Panel */}
      <AnimatePresence>
        {showAddBranchPanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-[var(--surface-0)] border border-[var(--surface-border)] rounded-lg overflow-hidden shadow-lg"
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-[var(--text-primary)] text-lg">
                  New Branch
                </h3>
                <button
                  onClick={() => setShowAddBranchPanel(null)}
                  title="Close panel"
                  aria-label="Close panel"
                  className="p-2 hover:bg-[var(--surface-2)] rounded-full text-[var(--text-muted)] transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <input
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                placeholder="Branch Name"
                className="mb-3 px-3 py-2 border border-[var(--surface-border)] bg-[var(--surface-1)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-200)]"
              />

              <input
                value={newBranchZone}
                onChange={(e) => setNewBranchZone(e.target.value)}
                placeholder="Zone"
                className="mb-4 px-3 py-2 border border-[var(--surface-border)] bg-[var(--surface-1)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-200)]"
              />

              <button
                onClick={() => handleAddBranch(showAddBranchPanel!)}
                className="py-2.5 bg-[var(--brand-600)] text-white rounded-md text-sm font-semibold hover:bg-[var(--brand-700)] transition"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

