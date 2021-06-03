import Link from 'next/link';

import styles from './paginatorContent.module.scss';

interface PaginatorContentProps {
  title?: string;
  uid?: string;
  text?: string;
}

export function PaginatorContent({ title, uid, text }: PaginatorContentProps) {
  return (
    <div className={styles.paginatorContent}>
      <h2>{title}</h2>
      <Link href={`/post/${uid}`}>
        <a>{text}</a>
      </Link>
    </div>
  );
}
