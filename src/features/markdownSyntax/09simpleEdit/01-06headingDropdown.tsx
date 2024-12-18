import { Heading } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './01-06headingDropdown.module.css';
import { handleHeaders } from '@/features/markdownSyntax';

interface HeadingDropdownButtonProps {
  onClick: () => void;
  textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  setMarkdownText: (text: string) => void;
}

export function HeadingDropdownButton({
  onClick,
  textareaRef,
  setMarkdownText,
}: HeadingDropdownButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      if (dropdownRef.current) {
        const dropdownWidth = 30 * 6 + 4 * 5 + 12;
        const left = rect.left + rect.width / 2 - dropdownWidth / 2;
        const top = rect.bottom + 1;

        dropdownRef.current.style.left = `${left}px`;
        dropdownRef.current.style.top = `${top}px`;
      }
    }
  }, [showDropdown]);

  const handleHeadingClick = (level: number) => {
    if (textareaRef.current) {
      handleHeaders(
        level,
        textareaRef.current.value,
        textareaRef.current.selectionStart,
        setMarkdownText,
        textareaRef.current
      );
      setShowDropdown(false);
    }
  };

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
                onClick={() => handleHeadingClick(i + 1)}
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
