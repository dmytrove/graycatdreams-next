import React from 'react';
// import { AnimationOptions } from '../Images3D';
import type { AnimationOptions } from '@/types';

interface AnimationOptionsFormProps {
  options: AnimationOptions;
  handleOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AnimationOptionsForm: React.FC<AnimationOptionsFormProps> = ({
  options, handleOptionChange
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
        <span style={{ color: '#ccc' }}>Spinning Max Speed</span>
        <span style={{ position: 'absolute', top: 0, right: 0, color: '#fff', fontSize: 14 }}>{options.spinMaxSpeed}</span>
        <input 
          type="range" 
          name="spinMaxSpeed" 
          min={0.1} 
          max={5} 
          step={0.1} 
          value={options.spinMaxSpeed} 
          onChange={handleOptionChange} 
          style={{ width: '100%' }}
        />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
        <span style={{ color: '#ccc' }}>Image Min Size</span>
        <span style={{ position: 'absolute', top: 0, right: 0, color: '#fff', fontSize: 14 }}>{options.imageMinSize}</span>
        <input 
          type="range" 
          name="imageMinSize" 
          min={0.1} 
          max={options.imageMaxSize - 0.01} 
          step={0.1} 
          value={options.imageMinSize} 
          onChange={handleOptionChange} 
          style={{ width: '100%' }}
        />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
        <span style={{ color: '#ccc' }}>Image Max Size</span>
        <span style={{ position: 'absolute', top: 0, right: 0, color: '#fff', fontSize: 14 }}>{options.imageMaxSize}</span>
        <input 
          type="range" 
          name="imageMaxSize" 
          min={options.imageMinSize + 0.01} 
          max={10} 
          step={0.1} 
          value={options.imageMaxSize} 
          onChange={handleOptionChange} 
          style={{ width: '100%' }}
        />
      </label>      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
        <span style={{ color: '#ccc' }}>Orbit Distance</span>
        <span style={{ position: 'absolute', top: 0, right: 0, color: '#fff', fontSize: 14 }}>{options.orbitDistance || 3}</span>
        <input 
          type="range" 
          name="orbitDistance" 
          min={1} 
          max={7} 
          step={0.5} 
          value={options.orbitDistance || 3} 
          onChange={handleOptionChange} 
          style={{ width: '100%' }}
        />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
        <span style={{ color: '#ccc' }}>Orbit Speed</span>
        <span style={{ position: 'absolute', top: 0, right: 0, color: '#fff', fontSize: 14 }}>{options.orbitSpeed || 0.02}</span>
        <input 
          type="range" 
          name="orbitSpeed" 
          min={0} 
          max={0.1} 
          step={0.005} 
          value={options.orbitSpeed || 0.02} 
          onChange={handleOptionChange} 
          style={{ width: '100%' }}
        />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
        <span style={{ color: '#ccc' }}>Pulsation Amount</span>
        <span style={{ position: 'absolute', top: 0, right: 0, color: '#fff', fontSize: 14 }}>{options.pulsationAmount || 0.2}</span>
        <input 
          type="range" 
          name="pulsationAmount" 
          min={0} 
          max={0.5} 
          step={0.05} 
          value={options.pulsationAmount || 0.2} 
          onChange={handleOptionChange} 
          style={{ width: '100%' }}
        />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
        <span style={{ color: '#ccc' }}>Pulsation Rate</span>
        <span style={{ position: 'absolute', top: 0, right: 0, color: '#fff', fontSize: 14 }}>{options.pulsationRate || 0.5}</span>
        <input 
          type="range" 
          name="pulsationRate" 
          min={0.1} 
          max={2} 
          step={0.1} 
          value={options.pulsationRate || 0.5} 
          onChange={handleOptionChange} 
          style={{ width: '100%' }}
        />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
        <span style={{ color: '#ccc' }}>Max images per group</span>
        <span style={{ position: 'absolute', top: 0, right: 0, color: '#fff', fontSize: 14 }}>{options.maxImageCount || 10}</span>
        <input
          type="range"
          id="maxImageCount"
          name="maxImageCount"
          min={1}
          max={20}
          step={1}
          value={options.maxImageCount || 10}
          onChange={handleOptionChange}
          style={{ width: '100%' }}
        />
      </label>
    </div>    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, color: '#fff', fontSize: 16 }}>
      <input
        type="checkbox"
        name="objectInteraction"
        checked={!!options.objectInteraction}
        onChange={handleOptionChange}
        style={{ width: 20, height: 20 }}
      />
      Enable Object Interaction
    </label>
  </div>
);

export default AnimationOptionsForm; 