import React, { useState } from 'react';
import styles from '@/pages/page.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SaveFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (filename: string) => void;
}

function SaveFileModal({ isOpen, onClose, onSave }: SaveFileModalProps) {
  const [filename, setFilename] = useState('lazymd.md');

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Save File As</h2>
        <input
          type='text'
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className={styles.modalInput}
          autoFocus
          placeholder='Enter file name'
        />
        <div className={styles.modalButtons}>
          <button
            type='submit'
            className={styles.modalButton}
            onClick={() => {
              if (filename.trim()) {
                onSave(filename);
                onClose();
              }
            }}
          >
            Save
          </button>
          <button
            type='button'
            className={styles.modalButton}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

interface FileDownloadProps {
  text: string;
}

export function FileDownload({ text }: FileDownloadProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (filename: string) => {
    const finalFilename = filename.endsWith('.md')
      ? filename
      : `${filename}.md`;

    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFilename;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`Successfully saved ${finalFilename}`, {
      position: 'bottom-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored',
    });
  };

  return (
    <>
      <button
        className={styles.menuButton}
        onClick={() => setIsModalOpen(true)}
      >
        <span>💾</span> Save File
      </button>
      <SaveFileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
