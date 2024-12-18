import { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { LeftPage } from '@/components/LeftPage';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { WelcomePage } from '../components/WelcomePage';
import styles from './page.module.css';

export default function Home() {
  const [showEditor, setShowEditor] = useState(false);

  const handleStart = () => {
    setShowEditor(true);
  };

  if (!showEditor) {
    return <WelcomePage onStart={handleStart} />;
  }

  return (
    <Layout>
      <main className={styles.main}>
        <LeftPage />
        <div className={styles.centerPage}>
          <MarkdownEditor />
        </div>
        <div className={styles.rightPage}>
          <MarkdownPreview />
        </div>
      </main>
    </Layout>
  );
}
