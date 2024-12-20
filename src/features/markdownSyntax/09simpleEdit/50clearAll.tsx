import { Trash2 } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import toastStyles from '@/styles/toast.module.css';
import styles from '../markStyle/50clearAll.module.css';

interface ClearAllButtonProps {
  onClick: () => void;
}

export function ClearAllButton({ onClick }: ClearAllButtonProps) {
  const handleClick = () => {
    const button = document.querySelector(`[title="Clear All"]`);
    const lineNumbers = document.querySelector('[class*="lineNumbers"]');
    if (!button || !lineNumbers) return;

    const rect = lineNumbers.getBoundingClientRect();
    const positionX = rect.left;
    const positionY = rect.top;

    document.documentElement.style.setProperty(
      '--toast-left',
      `${positionX}px`
    );
    document.documentElement.style.setProperty('--toast-top', `${positionY}px`);

    const confirmToast = (
      <div className={styles.toastStyle}>
        <div className={styles.titleStyle}>
          Are you sure you want to delete all content?
        </div>
        <div className={styles.buttonContainerStyle}>
          <button
            onClick={() => {
              onClick();
              toast.dismiss('confirm-clear-all');
              const successToast = (
                <div className={styles.successToastStyle}>
                  <div className={styles.successTitleStyle}>
                    All content has been deleted
                  </div>
                </div>
              );
              toast(successToast, {
                autoClose: 300,
                className: toastStyles.confirmToast,
                hideProgressBar: true,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                toastId: 'success-clear-all',
              });
            }}
            className={styles.deleteButton}
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
    );

    toast(confirmToast, {
      hideProgressBar: true,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      className: toastStyles.confirmToast,
      toastId: 'confirm-clear-all',
    });
  };

  return (
    <ToolbarButton onClick={handleClick} title='Clear All'>
      <Trash2 size={18} />
    </ToolbarButton>
  );
}
