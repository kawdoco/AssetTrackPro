import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Box, User, Zap } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'asset' | 'employee' | 'event';
}

export const ActionModal = ({ isOpen, onClose, title, type }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#248AFF]/10 rounded-lg">
                {type === 'asset' && <Box className="w-5 h-5 text-[#248AFF]" />}
                {type === 'employee' && <User className="w-5 h-5 text-[#248AFF]" />}
                {type === 'event' && <Zap className="w-5 h-5 text-[#248AFF]" />}
              </div>
              <h2 className="text-lg font-bold text-[#395A8F]">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Identifier / ID</label>
                <input
                  type="text"
                  placeholder={type === 'asset' ? "RF-00000" : "EMP-00000"}
                  className="w-full bg-gray-50 border border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-[#248AFF]/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category / Role</label>
                <select className="w-full bg-gray-50 border border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-[#248AFF]/20 outline-none transition-all appearance-none">
                  <option>Select Option</option>
                  <option>Category A</option>
                  <option>Category B</option>
                </select>
              </div>
              {type === 'event' && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Severity</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="py-2 rounded-xl border border-[#248AFF] text-[#248AFF] font-bold text-xs bg-blue-50">Normal</button>
                    <button className="py-2 rounded-xl border border-transparent bg-gray-50 text-gray-500 font-bold text-xs">Warning</button>
                    <button className="py-2 rounded-xl border border-transparent bg-gray-50 text-gray-500 font-bold text-xs">Critical</button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3.5 rounded-xl bg-[#248AFF] text-white font-bold text-sm shadow-lg shadow-blue-100 hover:bg-[#1c7ae6] transition-colors"
              >
                Confirms
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
