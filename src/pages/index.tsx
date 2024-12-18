import { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { LeftPage } from '@/components/LeftPage';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { WelcomePage } from '../components/WelcomePage';
import styles from './page.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    return (
      <>
        <WelcomePage onStart={handleStart} />
        <ToastContainer
          position='top-center'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
          style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            minHeight: '64px',
            width: '320px',
          }}
          toastStyle={{
            background: '#ffffff',
            color: '#333333',
            border: '1px solid #dddddd',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        />
      </>
    );
  }

  return (
    <>
      <Layout onExpandToggle={handleExpandToggle} isExpanded={isExpanded}>
        <main className={styles.main}>
          <LeftPage />
          {!isExpanded && (
            <div className={styles.centerPage}>
              <MarkdownEditor />
            </div>
          )}
          <div
            className={`${styles.rightPage} ${
              isExpanded ? styles.expanded : ''
            }`}
          >
            <MarkdownPreview />
          </div>
        </main>
      </Layout>
      <ToastContainer
        position='top-center'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        style={{
          fontSize: '1rem',
          fontWeight: 'bold',
          minHeight: '64px',
          width: '320px',
        }}
        toastStyle={{
          background: '#ffffff',
          color: '#333333',
          border: '1px solid #dddddd',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      />
    </>
  );
}
