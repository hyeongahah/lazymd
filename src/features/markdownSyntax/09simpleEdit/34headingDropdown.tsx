import { Heading } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.css';

export function HeadingDropdownButton({ onClick }: { onClick: () => void }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      if (dropdownRef.current) {
        const dropdownWidth = 30 * 6 + 4 * 5 + 12;
        const left = rect.left + rect.width / 2 - dropdownWidth / 2;
        const top = rect.bottom + 2;

        dropdownRef.current.style.left = `${left}px`;
        dropdownRef.current.style.top = `${top}px`;
      }
    }
  }, [showDropdown]);

  return (
    <>
      <div
        ref={buttonRef}
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <ToolbarButton onClick={onClick} title='Heading'>
          <Heading size={18} />
        </ToolbarButton>
      </div>
      {showDropdown &&
        createPortal(
          <div
            ref={dropdownRef}
            className={styles.headingDropdown}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <button
                key={i + 1}
                className={styles.headingOption}
                onClick={() => {}}
                title={`Heading ${i + 1}`}
              >
                H{i + 1}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
