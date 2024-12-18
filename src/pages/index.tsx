import { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { LeftPage } from '@/components/LeftPage';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { WelcomePage } from '../components/WelcomePage';
import styles from './page.module.css';

export default function Home() {
  const [showEditor, setShowEditor] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStart = () => {
    setShowEditor(true);
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  if (!showEditor) {
    return <WelcomePage onStart={handleStart} />;
  }

  return (
    <Layout onExpandToggle={handleExpandToggle} isExpanded={isExpanded}>
      <main className={styles.main}>
        <LeftPage />
        {!isExpanded && (
          <div className={styles.centerPage}>
            <MarkdownEditor />
          </div>
        )}
        <div
          className={`${styles.rightPage} ${isExpanded ? styles.expanded : ''}`}
        >
          <MarkdownPreview />
        </div>
      </main>
    </Layout>
  );
}
