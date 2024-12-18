import { Trash2 } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pageStyles from '@/pages/page.module.css';
import styles from '../markStyle/50clearAll.module.css';

interface ClearAllButtonProps {
  onClick: () => void;
}

export function ClearAllButton({ onClick }: ClearAllButtonProps) {
  const handleClick = () => {
    const button = document.querySelector(`[title="Clear All"]`);
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const positionY = rect.bottom + 10;
    const positionX = rect.left;

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
              toast.dismiss();
              const successToast = (
                <div className={styles.successToastStyle}>
                  <div className={styles.successTitleStyle}>
                    All content has been deleted
                  </div>
                </div>
              );
              toast(successToast, {
                autoClose: 300,
                className: pageStyles.confirmToast,
                hideProgressBar: true,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
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
      className: pageStyles.confirmToast,
      toastId: 'confirm-clear-all',
    });
  };

  return (
    <>
      <ToolbarButton onClick={handleClick} title='Clear All'>
        <Trash2 size={18} />
      </ToolbarButton>
      <ToastContainer />
    </>
  );
}
