import React, { memo, useState } from 'react';
import styles from '@/styles/Forms.module.css';
import { AnimationOptions, AnimationPreset, MOVEMENT_TEMPLATES, MOVEMENT_DESCRIPTIONS, LIGHTING_MODES, LIGHTING_DESCRIPTIONS, FOG_TYPES, FOG_DESCRIPTIONS, FOG_PRESETS } from '@/types';

interface AnimationOptionsFormProps {
  options: AnimationOptions;
  onOptionChange: (updates: Partial<AnimationOptions>) => void;
  imageCount: number;
  className?: string;
}

// Enhanced presets that showcase different movement templates, lighting, and effects
const ANIMATION_PRESETS: AnimationPreset[] = [
  { 
    name: 'Gentle Float',
    description: 'Calm, slow-moving images with soft lighting',
    options: { 
      spinMaxSpeed: 0.5, 
      imageMinSize: 1.0, 
      imageMaxSize: 2.0, 
      maxImageCount: 8, 
      pulsationAmount: 0.15,
      pulsationRate: 0.4,
      bounciness: 0.6,
      movementTemplate: 0, // Random Drift
      lightingMode: 0, // Soft Even
      ambientIntensity: 0.7,
      lightIntensity: 0.6,
      animatedLighting: false
    } 
  },
  { 
    name: 'Cosmic Dance',
    description: 'Orbital motion with dramatic lighting',
    options: { 
      spinMaxSpeed: 1.2, 
      imageMinSize: 1.2, 
      imageMaxSize: 2.5, 
      maxImageCount: 12,
      pulsationAmount: 0.25,
      pulsationRate: 0.8,
      bounciness: 0.8,
      movementTemplate: 1, // Orbit
      lightingMode: 1, // Dramatic
      ambientIntensity: 0.3,
      lightIntensity: 1.2,
      animatedLighting: true
    } 
  },
  { 
    name: 'Spiral Galaxy',
    description: 'Expanding spirals with cool blue lighting',
    options: { 
      spinMaxSpeed: 1.0, 
      imageMinSize: 0.8, 
      imageMaxSize: 1.8, 
      maxImageCount: 15,
      pulsationAmount: 0.2,
      pulsationRate: 0.6,
      bounciness: 0.7,
      movementTemplate: 2, // Spiral
      lightingMode: 4, // Cool Blue
      ambientIntensity: 0.5,
      lightIntensity: 0.9,
      animatedLighting: false
    } 
  },
  { 
    name: 'Neon Party',
    description: 'High-energy bouncing with vibrant neon lights',
    options: { 
      spinMaxSpeed: 2.5, 
      imageMinSize: 0.8, 
      imageMaxSize: 2.2, 
      maxImageCount: 16,
      pulsationAmount: 0.35,
      pulsationRate: 1.4,
      bounciness: 1.3,
      movementTemplate: 3, // Bounce
      lightingMode: 5, // Neon
      ambientIntensity: 0.2,
      lightIntensity: 1.0,
      animatedLighting: true
    } 
  },
  { 
    name: 'Golden Waves',
    description: 'Flowing wave motion with warm golden lighting',
    options: { 
      spinMaxSpeed: 0.8, 
      imageMinSize: 1.5, 
      imageMaxSize: 3.0, 
      maxImageCount: 10,
      pulsationAmount: 0.3,
      pulsationRate: 0.5,
      bounciness: 0.4,
      movementTemplate: 4, // Wave
      lightingMode: 6, // Golden Hour
      ambientIntensity: 0.6,
      lightIntensity: 1.1,
      animatedLighting: true
    } 
  },
  { 
    name: 'Whirlpool Sunset',
    description: 'Swirling vortex with warm sunset colors',
    options: { 
      spinMaxSpeed: 1.5, 
      imageMinSize: 0.6, 
      imageMaxSize: 1.4, 
      maxImageCount: 18,
      pulsationAmount: 0.2,
      pulsationRate: 1.0,
      bounciness: 0.7,
      movementTemplate: 5, // Swirl
      lightingMode: 3, // Sunset
      ambientIntensity: 0.7,
      lightIntensity: 1.0,
      animatedLighting: false
    } 
  },
  { 
    name: 'Moonlit Dreams 🌫️',
    description: 'Figure-8 patterns under moonlight with atmospheric fog',
    options: { 
      spinMaxSpeed: 1.0, 
      imageMinSize: 1.2, 
      imageMaxSize: 2.8, 
      maxImageCount: 8,
      pulsationAmount: 0.4,
      pulsationRate: 0.7,
      bounciness: 0.5,
      movementTemplate: 6, // Figure-8
      lightingMode: 7, // Moonlight
      ambientIntensity: 0.4,
      lightIntensity: 0.8,
      animatedLighting: true,
      // Fog settings for mystical atmosphere
      fogEnabled: true,
      fogType: 1, // Exponential
      fogColor: '#1a237e',
      fogDensity: 0.015,
    } 
  },
  { 
    name: 'Studio Gallery',
    description: 'Professional display with studio lighting',
    options: { 
      spinMaxSpeed: 0.3, 
      imageMinSize: 2.5, 
      imageMaxSize: 4.0, 
      maxImageCount: 5,
      pulsationAmount: 0.1,
      pulsationRate: 0.3,
      bounciness: 0.3,
      movementTemplate: 0, // Random Drift
      lightingMode: 2, // Studio
      ambientIntensity: 0.5,
      lightIntensity: 1.0,
      animatedLighting: false
    } 
  },
  {
    name: 'Misty Sunrise 🌫️',
    description: 'Gentle movement with warm fog and golden lighting',
    options: {
      spinMaxSpeed: 0.7,
      imageMinSize: 1.5,
      imageMaxSize: 3.0,
      maxImageCount: 10,
      pulsationAmount: 0.2,
      pulsationRate: 0.5,
      bounciness: 0.4,
      movementTemplate: 4, // Wave
      lightingMode: 6, // Golden Hour
      ambientIntensity: 0.6,
      lightIntensity: 1.1,
      animatedLighting: true,
      // Warm fog for sunrise atmosphere
      fogEnabled: true,
      fogType: 0, // Linear
      fogColor: '#ff8f00',
      fogNear: 8,
      fogFar: 35,
    }
  },
  {
    name: 'Deep Ocean 🌫️',
    description: 'Underwater feeling with blue fog and flowing motion',
    options: {
      spinMaxSpeed: 0.5,
      imageMinSize: 1.0,
      imageMaxSize: 2.5,
      maxImageCount: 12,
      pulsationAmount: 0.3,
      pulsationRate: 0.8,
      bounciness: 0.2,
      movementTemplate: 4, // Wave
      lightingMode: 4, // Cool Blue
      ambientIntensity: 0.7,
      lightIntensity: 0.6,
      animatedLighting: false,
      // Deep blue fog for underwater effect
      fogEnabled: true,
      fogType: 2, // Exponential squared
      fogColor: '#1a237e',
      fogDensity: 0.025,
    }
  },
];

export const AnimationOptionsForm: React.FC<AnimationOptionsFormProps> = memo(({
  options,
  onOptionChange,
  imageCount,
  className = '',
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: number | boolean | string;
    
    if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number' || type === 'range') {
      parsedValue = parseFloat(value);
    } else {
      parsedValue = value;
    }
    
    onOptionChange({ [name]: parsedValue });
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetIndex = parseInt(e.target.value);
    const preset = ANIMATION_PRESETS[presetIndex];
    if (preset) {
      onOptionChange(preset.options);
    }
  };

  // Compact slider component
  const CompactSlider = ({ 
    name, 
    label, 
    value, 
    min, 
    max, 
    step, 
    format = (v: number) => v.toFixed(1) 
  }: {
    name: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    format?: (value: number) => string;
  }) => (
    <div className={styles.compactField}>
      <label className={styles.compactLabel}>
        {label} <span className={styles.compactValue}>{format(value)}</span>
      </label>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleInputChange}
        className={styles.compactRange}
      />
    </div>
  );

  return (
    <div className={`${styles.compactContainer} ${className}`}>
      {/* Quick Presets */}
      <div className={styles.presetSection}>
        <label className={styles.compactLabel}>Animation Presets</label>
        <select
          onChange={handlePresetChange}
          className={styles.compactSelect}
          aria-label="Select animation preset"
        >
          <option value="">Choose a style...</option>
          {ANIMATION_PRESETS.map((preset, index) => (
            <option key={preset.name} value={index} title={preset.description}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {/* Essential Controls - Always Visible */}
      <div className={styles.categorySection}>
        <div className={styles.categoryContent}>
          <CompactSlider
            name="maxImageCount"
            label="Max Number of Instances per Image"
            value={options.maxImageCount}
            min={1}
            max={20}
            step={1}
            format={(v) => v.toString()}
          />

          {/* Movement Template Selector */}
          <div className={styles.compactField}>
            <label className={styles.compactLabel}>Movement Pattern</label>
            <select
              name="movementTemplate"
              value={options.movementTemplate}
              onChange={handleInputChange}
              className={styles.compactSelect}
              title={MOVEMENT_DESCRIPTIONS[options.movementTemplate] || 'Movement description'}
            >
              {MOVEMENT_TEMPLATES.map((name, index) => (
                <option key={name} value={index} title={MOVEMENT_DESCRIPTIONS[index]}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Lighting Mode Selector - Enhanced */}
          <div className={styles.compactField}>
            <label className={styles.compactLabel}>
              💡 Lighting Style
              <span className={styles.compactValue}>
                {LIGHTING_MODES[options.lightingMode || 0]}
              </span>
            </label>
            <select
              name="lightingMode"
              value={options.lightingMode || 0}
              onChange={handleInputChange}
              className={styles.compactSelect}
              title={LIGHTING_DESCRIPTIONS[options.lightingMode || 0] || 'Lighting description'}
            >
              {LIGHTING_MODES.map((name, index) => (
                <option key={name} value={index} title={LIGHTING_DESCRIPTIONS[index]}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Lighting Controls */}
          <div className={styles.compactGrid}>
            <CompactSlider
              name="ambientIntensity"
              label="🌟 Ambient Light"
              value={options.ambientIntensity || 0.6}
              min={0}
              max={2}
              step={0.1}
            />
            <CompactSlider
              name="lightIntensity"
              label="☀️ Main Light"
              value={options.lightIntensity || 0.8}
              min={0}
              max={3}
              step={0.1}
            />
          </div>

          {/* Animated Lighting Toggle */}
          <div className={styles.compactCheckbox}>
            <input
              type="checkbox"
              name="animatedLighting"
              checked={options.animatedLighting || false}
              onChange={handleInputChange}
              id="animatedLighting-main"
            />
            <label htmlFor="animatedLighting-main">✨ Animated Lighting Effects</label>
          </div>
          
          <CompactSlider
            name="spinMaxSpeed"
            label="Animation Speed"
            value={options.spinMaxSpeed}
            min={0.1}
            max={5}
            step={0.1}
          />

          <div className={styles.compactGrid}>
            <CompactSlider
              name="imageMinSize"
              label="Min Size"
              value={options.imageMinSize}
              min={0.1}
              max={Math.max(0.2, options.imageMaxSize - 0.1)}
              step={0.1}
            />
            <CompactSlider
              name="imageMaxSize"
              label="Max Size"
              value={options.imageMaxSize}
              min={Math.min(10, options.imageMinSize + 0.1)}
              max={10}
              step={0.1}
            />
          </div>
        </div>
      </div>

      {/* Advanced Controls Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className={styles.categoryHeader}
        aria-expanded={showAdvanced}
      >
        <span>Advanced Settings</span>
        <span className={`${styles.categoryIcon} ${showAdvanced ? styles.expanded : ''}`}>
          ▼
        </span>
      </button>

      {/* Advanced Controls */}
      {showAdvanced && (
        <div className={styles.categorySection}>
          <div className={styles.categoryContent}>
            
            {/* Visual Effects */}
            <div className={styles.compactGrid}>
              <CompactSlider
                name="pulsationAmount"
                label="Pulse Effect"
                value={options.pulsationAmount}
                min={0}
                max={0.5}
                step={0.05}
                format={(v) => v.toFixed(2)}
              />
              <CompactSlider
                name="pulsationRate"
                label="Pulse Speed"
                value={options.pulsationRate}
                min={0.1}
                max={2}
                step={0.1}
              />
            </div>

            <CompactSlider
              name="bounciness"
              label="Bounce Effect"
              value={options.bounciness}
              min={0.1}
              max={2}
              step={0.1}
            />

            {/* Additional Lighting Controls in Advanced */}
            <div className={styles.compactField}>
              <label className={styles.compactLabel}>🎨 Light Color</label>
              <input
                type="color"
                name="lightColor"
                value={options.lightColor || '#ffffff'}
                onChange={handleInputChange}
                className={styles.colorPicker}
                title="Choose the color of the main lighting"
              />
            </div>

            {/* Camera Settings */}
            <div className={styles.compactCheckbox}>
              <input
                type="checkbox"
                name="parallaxEnabled"
                checked={options.parallaxEnabled}
                onChange={handleInputChange}
                id="parallaxEnabled"
              />
              <label htmlFor="parallaxEnabled">Auto Camera Movement</label>
            </div>

            {options.parallaxEnabled && (
              <div className={styles.compactGrid}>
                <CompactSlider
                  name="parallaxSpeed"
                  label="Camera Speed"
                  value={options.parallaxSpeed}
                  min={0.005}
                  max={0.1}
                  step={0.001}
                  format={(v) => v.toFixed(3)}
                />
                <CompactSlider
                  name="parallaxInterval"
                  label="Switch Time (s)"
                  value={options.parallaxInterval}
                  min={2}
                  max={10}
                  step={0.5}
                />
              </div>
            )}

            {/* Fog & Atmosphere Section */}
            <div className={styles.compactCheckbox}>
              <input
                type="checkbox"
                name="fogEnabled"
                checked={options.fogEnabled || false}
                onChange={handleInputChange}
                id="fogEnabled"
              />
              <label htmlFor="fogEnabled">🌫️ Atmospheric Fog</label>
            </div>

            {options.fogEnabled && (
              <>
                {/* Fog Type Selector */}
                <div className={styles.compactField}>
                  <label className={styles.compactLabel}>
                    Fog Type: {FOG_TYPES[options.fogType || 0]}
                  </label>
                  <select
                    name="fogType"
                    value={options.fogType || 0}
                    onChange={handleInputChange}
                    className={styles.compactSelect}
                    title={FOG_DESCRIPTIONS[options.fogType || 0] || 'Fog type description'}
                  >
                    {FOG_TYPES.map((name, index) => (
                      <option key={name} value={index} title={FOG_DESCRIPTIONS[index]}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fog Color */}
                <div className={styles.compactField}>
                  <label className={styles.compactLabel}>🎨 Fog Color</label>
                  <div className={styles.colorPresetRow}>
                    <input
                      type="color"
                      name="fogColor"
                      value={options.fogColor || '#666666'}
                      onChange={handleInputChange}
                      className={styles.colorPicker}
                      title="Choose fog color"
                    />
                    {/* Quick fog color presets */}
                    <div className={styles.colorPresets}>
                      {FOG_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          className={styles.colorPresetButton}
                          style={{ backgroundColor: preset.color }}
                          onClick={() => onOptionChange({ fogColor: preset.color })}
                          title={`${preset.name}: ${preset.description}`}
                          aria-label={`Set fog color to ${preset.name}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fog Parameters based on type */}
                {(options.fogType === 0) ? (
                  // Linear fog controls
                  <div className={styles.compactGrid}>
                    <CompactSlider
                      name="fogNear"
                      label="🔍 Fog Start"
                      value={options.fogNear || 10}
                      min={1}
                      max={30}
                      step={1}
                      format={(v) => `${v}m`}
                    />
                    <CompactSlider
                      name="fogFar"
                      label="🌫️ Fog End"
                      value={options.fogFar || 50}
                      min={20}
                      max={100}
                      step={5}
                      format={(v) => `${v}m`}
                    />
                  </div>
                ) : (
                  // Exponential fog controls
                  <CompactSlider
                    name="fogDensity"
                    label="🌫️ Fog Density"
                    value={options.fogDensity || 0.02}
                    min={0.001}
                    max={0.1}
                    step={0.001}
                    format={(v) => v.toFixed(3)}
                  />
                )}

                {/* Helpful fog info */}
                <div className={styles.fogInfo}>
                  <small>
                    💡 {FOG_DESCRIPTIONS[options.fogType || 0]}
                    {options.fogType === 0 && ' Perfect for controlled depth effects.'}
                    {options.fogType === 1 && ' Great for natural atmospheric effects.'}
                    {options.fogType === 2 && ' Best for dramatic, cinematic scenes.'}
                  </small>
                </div>
              </>
            )}

            {/* Interaction */}
            <div className={styles.compactCheckbox}>
              <input
                type="checkbox"
                name="objectInteraction"
                checked={options.objectInteraction}
                onChange={handleInputChange}
                id="objectInteraction"
              />
              <label htmlFor="objectInteraction">Mouse Interaction</label>
            </div>
          </div>
        </div>
      )}

      {/* Quick Info */}
      <div className={styles.infoSection}>
        <div className={styles.infoText}>
          {imageCount === 0 
            ? "Upload images to start creating animations" 
            : (
              <>
                Max {options.maxImageCount} instances per image, {imageCount} unique images, using {LIGHTING_MODES[options.lightingMode || 0]} lighting.
                {options.fogEnabled && (
                  <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>
                    {' '}🌫️ Atmospheric fog enabled.
                  </span>
                )}
              </>
            )
          }
        </div>
      </div>
    </div>
  );
});

AnimationOptionsForm.displayName = 'AnimationOptionsForm';

export default AnimationOptionsForm;
