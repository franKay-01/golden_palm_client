import React, { useState, useEffect } from 'react';
import { X, Flame } from 'lucide-react';

// Presentation metadata for known heat levels. Anything not listed here still
// renders using the raw heat_level as its label with a single flame.
const HEAT_LEVEL_META = {
  mild: { label: 'Mild', description: 'Perfect for beginners', flames: 1, color: 'text-orange-400' },
  med: { label: 'Medium', description: 'A balanced kick', flames: 2, color: 'text-orange-500' },
  medium: { label: 'Medium', description: 'A balanced kick', flames: 2, color: 'text-orange-500' },
  hot: { label: 'Hot', description: 'For spice lovers', flames: 3, color: 'text-red-600' },
};

// Fallback list used when a product doesn't expose a variations array
const DEFAULT_VARIATIONS = [
  { heat_level: 'mild' },
  { heat_level: 'med' },
  { heat_level: 'hot' },
];

export default function HeatLevelModal({ isOpen, onClose, onSelect, productName, variations }) {
  const [selectedLevel, setSelectedLevel] = useState('');

  // Reset selection whenever the modal is opened/closed so stale picks don't carry over
  useEffect(() => {
    if (!isOpen) setSelectedLevel('');
  }, [isOpen]);

  const options = (variations && variations.length > 0 ? variations : DEFAULT_VARIATIONS);

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
          {options.map((variation, index) => {
            const key = variation.heat_level?.toLowerCase();
            const meta = HEAT_LEVEL_META[key] || {
              label: variation.heat_level,
              description: '',
              flames: 1,
              color: 'text-orange-500',
            };
            // A variation is unavailable when is_available === false (absent => available)
            const unavailable = variation.is_available === false;
            const selected = selectedLevel === variation.heat_level;

            return (
              <div
                key={index}
                onClick={() => !unavailable && setSelectedLevel(variation.heat_level)}
                aria-disabled={unavailable}
                className={`border-2 rounded-lg p-4 transition-all ${
                  unavailable
                    ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                    : selected
                      ? 'border-gp-light-green bg-green-50 cursor-pointer'
                      : 'border-gray-300 hover:border-gray-400 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-canaro-semibold text-lg ${unavailable ? 'text-gray-400 line-through' : ''}`}>
                      {meta.label}
                    </h3>
                    {unavailable ? (
                      <p className="text-sm text-red-500 font-canaro-semibold">Out of stock</p>
                    ) : (
                      meta.description && (
                        <p className="text-sm text-gray-600 font-canaro-light">{meta.description}</p>
                      )
                    )}
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: meta.flames }).map((_, i) => (
                      <Flame key={i} size={20} className={unavailable ? 'text-gray-300' : meta.color} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
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
