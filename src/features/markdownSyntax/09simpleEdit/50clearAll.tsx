import { Trash2 } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pageStyles from '@/pages/page.module.css';
import styles from './50clearAll.module.css';

interface ClearAllButtonProps {
  onClick: () => void;
}

export function ClearAllButton({ onClick }: ClearAllButtonProps) {
  const handleClick = () => {
    const button = document.querySelector(`[title="모든 내용 삭제"]`);
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
        <div className={styles.titleStyle}>모든 내용을 삭제하시겠습니까?</div>
        <div className={styles.buttonContainerStyle}>
          <button
            onClick={() => {
              onClick();
              toast.dismiss();
              const successToast = (
                <div className={styles.successToastStyle}>
                  <div className={styles.successTitleStyle}>
                    모든 내용이 삭제되었습니다
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
            삭제
          </button>
          <button
            onClick={() => toast.dismiss()}
            className={styles.cancelButton}
          >
            취소
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
      <ToolbarButton onClick={handleClick} title='모든 내용 삭제'>
        <Trash2 size={18} />
      </ToolbarButton>
      <ToastContainer />
    </>
  );
}
