import React, { useState } from 'react';
import { X, Flame } from 'lucide-react';

export default function HeatLevelModal({ isOpen, onClose, onSelect, productName }) {
  const [selectedLevel, setSelectedLevel] = useState('');

  const handleConfirm = () => {
    if (!selectedLevel) {
      return;
    }
    onSelect(selectedLevel);
    setSelectedLevel('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Flame className="text-red-600" size={32} />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-caslon text-gp-light-green text-center mb-2">
            Choose Your Heat Level
          </h2>
          <p className="text-gray-600 text-center font-canaro-light">
            {productName}
          </p>
        </div>

        {/* Heat level options */}
        <div className="space-y-3 mb-6">
          <div
            onClick={() => setSelectedLevel('mild')}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedLevel === 'mild'
                ? 'border-gp-light-green bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-canaro-semibold text-lg">Mild</h3>
                <p className="text-sm text-gray-600 font-canaro-light">Perfect for beginners</p>
              </div>
              <div className="flex gap-1">
                <Flame size={20} className="text-orange-400" />
              </div>
            </div>
          </div>

          <div
            onClick={() => setSelectedLevel('med')}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedLevel === 'med'
                ? 'border-gp-light-green bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-canaro-semibold text-lg">Medium</h3>
                <p className="text-sm text-gray-600 font-canaro-light">A balanced kick</p>
              </div>
              <div className="flex gap-1">
                <Flame size={20} className="text-orange-500" />
                <Flame size={20} className="text-orange-500" />
              </div>
            </div>
          </div>

          <div
            onClick={() => setSelectedLevel('hot')}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedLevel === 'hot'
                ? 'border-gp-light-green bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-canaro-semibold text-lg">Hot</h3>
                <p className="text-sm text-gray-600 font-canaro-light">For spice lovers</p>
              </div>
              <div className="flex gap-1">
                <Flame size={20} className="text-red-600" />
                <Flame size={20} className="text-red-600" />
                <Flame size={20} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-canaro-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedLevel}
            className={`flex-1 px-6 py-3 rounded-lg font-canaro-semibold transition-colors ${
              selectedLevel
                ? 'bg-gp-light-green text-white hover:bg-gp-dark-green'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
