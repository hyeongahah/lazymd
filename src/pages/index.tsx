import { Layout } from '@/components/Layout/Layout';
import { LeftPage } from '@/components/LeftPage';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import styles from './page.module.css';

export default function Home() {
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
