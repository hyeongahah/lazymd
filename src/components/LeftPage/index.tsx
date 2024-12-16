import { useEffect, useState } from 'react';
import { useMenuStore } from '@/store/menuStore';
import { useMarkdown } from '@/hooks/useMarkdown';
import styles from '@/pages/page.module.css';
import { FileUpload } from '@/features/menuTool/FileUpload';
import { FileDownload } from '@/features/menuTool/FileDownload';
import { ThemeToggle } from '@/features/menuTool/ThemeToggle';
import { LazyMdIntro } from '@/features/menuTool/LazyMdIntro';

export function LeftPage() {
  const { isOpen, toggle } = useMenuStore();
  const { text } = useMarkdown();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };

    // 초기 체크
    checkMobile();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', checkMobile);

    // 클린업
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`${styles.leftPage} ${!isOpen ? styles.closed : ''}`}>
      <div className={styles.menuContent}>
        <div className={styles.menuButtons}>
          <FileDownload text={text} />
          <FileUpload />
          <ThemeToggle />
          <LazyMdIntro />
        </div>
        {isMobile && (
          <button className={styles.closeButton} onClick={toggle}>
            Close
          </button>
        )}
      </div>
    </div>
  );
}
