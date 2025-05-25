import React from 'react';
import styles from '@/styles/Sidebar.module.css';

interface SidebarProps {
  side: 'left' | 'right';
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  side,
  isOpen,
  onToggle,
  children,
  className = '',
}) => {
  const sidebarClasses = [
    styles.sidebar,
    styles[side],
    !isOpen ? styles.closed : '',
    className,
  ].filter(Boolean).join(' ');

  const toggleClasses = [
    styles.sidebarToggle,
    styles[side],
    isOpen ? styles.open : '',
  ].filter(Boolean).join(' ');

  const getToggleIcon = () => {
    if (isOpen) {
      return <span style={{ fontSize: 24 }}>&#10005;</span>; // X icon
    }
    return side === 'left' 
      ? <span style={{ fontSize: 24 }}>&#9776;</span>  // Hamburger
      : <span style={{ fontSize: 24 }}>&#9881;</span>; // Gear
  };

  const getAriaLabel = () => {
    const panelType = side === 'left' ? 'image panel' : 'controls panel';
    return isOpen ? `Close ${panelType}` : `Open ${panelType}`;
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={toggleClasses}
        aria-label={getAriaLabel()}
        title={getAriaLabel()}
      >
        {getToggleIcon()}
      </button>

      {/* Sidebar Content */}
      <div className={sidebarClasses}>
        {children}
      </div>
    </>
  );
};

export default Sidebar;
