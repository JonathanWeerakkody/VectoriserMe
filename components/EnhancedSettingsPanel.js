// components/EnhancedSettingsPanel.js
import React, { useState } from 'react';
import TranslatedText from './i18n/TranslatedText';

export default function EnhancedSettingsPanel({ settings = {}, onChange, applyToAll = false, onApplyToAll }) {
  // Default settings
  const defaultSettings = {
    outputMode: 'bw', // 'bw' or 'color'
    threshold: 128,   // For B/W mode
    colorCount: 8,    // For Color mode
    smoothing: 5,
    pathSimplification: 5,
    noiseReduction: 4,
    backgroundTransparency: false,
    // Advanced settings
    brightness: 0,
    contrast: 0,
    gamma: 1.0,
    cornerThreshold: 60,
    curveMode: 'spline', // 'polygon' or 'spline'
  };
  
  // Initialize local state with default settings, overridden by props
  const [localSettings, setLocalSettings] = useState({
    ...defaultSettings,
    ...settings,
  });
  
  // State to track if advanced settings are open
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  // Handle mode change (B/W or Color)
  const handleModeChange = (mode) => {
    setLocalSettings({ ...localSettings, outputMode: mode });
  };
  
  // Handle slider/number input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value);
    setLocalSettings({ ...localSettings, [name]: newValue });
  };
  
  // Apply settings when "Apply Settings" is clicked
  const applySettings = () => {
    onChange(localSettings);
  };
  
  // Reset settings to default values
  const resetSettings = () => {
    setLocalSettings(defaultSettings);
  };
  
  // Toggle advanced settings
  const toggleAdvancedSettings = () => {
    setIsAdvancedOpen(!isAdvancedOpen);
  };
  
  return (
    <div className="settings-panel">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          <TranslatedText textKey="settingsTitle" />
        </h2>
        
        {onApplyToAll && (
          <button 
            type="button"
            onClick={onApplyToAll}
            className="btn btn-secondary text-sm"
          >
            <TranslatedText textKey="applyToAll" />
          </button>
        )}
      </div>
      
      {/* Output Mode Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <TranslatedText textKey="outputMode" />
        </label>
        <div className="flex space-x-2">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              localSettings.outputMode === 'bw' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => handleModeChange('bw')}
          >
            <TranslatedText textKey="bwMode" />
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              localSettings.outputMode === 'color' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => handleModeChange('color')}
          >
            <TranslatedText textKey="colorMode" />
          </button>
        </div>
      </div>
      
      {/* Mode-specific settings */}
      {localSettings.outputMode === 'bw' ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <TranslatedText textKey="threshold" />: {localSettings.threshold}
          </label>
          <input
            type="range"
            name="threshold"
            min="0"
            max="255"
            value={localSettings.threshold}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <TranslatedText textKey="colorCount" />: {localSettings.colorCount}
          </label>
          <input
            type="range"
            name="colorCount"
            min="2"
            max="32"
            value={localSettings.colorCount}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
      
      {/* Common settings */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <TranslatedText textKey="smoothing" />: {localSettings.smoothing}
        </label>
        <input
          type="range"
          name="smoothing"
          min="0"
          max="10"
          value={localSettings.smoothing}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <TranslatedText textKey="pathSimplification" />: {localSettings.pathSimplification}
        </label>
        <input
          type="range"
          name="pathSimplification"
          min="0"
          max="10"
          value={localSettings.pathSimplification}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <TranslatedText textKey="noiseReduction" />: {localSettings.noiseReduction}
        </label>
        <input
          type="range"
          name="noiseReduction"
          min="0"
          max="10"
          value={localSettings.noiseReduction}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="backgroundTransparency"
            id="backgroundTransparency"
            checked={localSettings.backgroundTransparency}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="backgroundTransparency" className="ml-2 block text-sm text-gray-700">
            <TranslatedText textKey="backgroundTransparency" />
          </label>
        </div>
      </div>
      
      {/* Advanced Settings Toggle */}
      <div className="mb-4">
        <button
          type="button"
          onClick={toggleAdvancedSettings}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
        >
          <TranslatedText textKey="advancedSettings" />
          <svg 
            className={`ml-1 h-5 w-5 transform ${isAdvancedOpen ? 'rotate-180' : ''}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Advanced Settings Panel */}
      {isAdvancedOpen && (
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText textKey="brightness" />: {localSettings.brightness}
            </label>
            <input
              type="range"
              name="brightness"
              min="-100"
              max="100"
              value={localSettings.brightness}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText textKey="contrast" />: {localSettings.contrast}
            </label>
            <input
              type="range"
              name="contrast"
              min="-100"
              max="100"
              value={localSettings.contrast}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText textKey="gamma" />: {localSettings.gamma.toFixed(1)}
            </label>
            <input
              type="range"
              name="gamma"
              min="0.1"
              max="3.0"
              step="0.1"
              value={localSettings.gamma}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText textKey="cornerThreshold" />: {localSettings.cornerThreshold}
            </label>
            <input
              type="range"
              name="cornerThreshold"
              min="0"
              max="180"
              value={localSettings.cornerThreshold}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatedText textKey="curveVsPolygon" />
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  localSettings.curveMode === 'polygon' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => setLocalSettings({ ...localSettings, curveMode: 'polygon' })}
              >
                Polygon
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  localSettings.curveMode === 'spline' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => setLocalSettings({ ...localSettings, curveMode: 'spline' })}
              >
                Curve
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={resetSettings}
          className="btn btn-secondary"
        >
          <TranslatedText textKey="resetSettings" />
        </button>
        
        <button
          type="button"
          onClick={applySettings}
          className="btn btn-primary"
        >
          <TranslatedText textKey="applySettings" />
        </button>
      </div>
    </div>
  );
}
