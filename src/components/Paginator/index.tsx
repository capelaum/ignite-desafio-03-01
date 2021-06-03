import Link from 'next/link';

import styles from './paginator.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
      alt: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PaginatorProps {
  prevPage: Post;
  nextPage: Post;
}

export function Paginator({ prevPage, nextPage }: PaginatorProps) {
  return (
    <div className={styles.paginator}>
      {prevPage && (
        <div className={styles.paginatorContent}>
          <h2>{prevPage.data.title}</h2>
          <Link href={`/post/${prevPage.uid}`}>
            <a>Post anterior</a>
          </Link>
        </div>
      )}

      {nextPage && (
        <div className={styles.paginatorContent}>
          <h2>{nextPage.data.title}</h2>
          <Link href={`/post/${nextPage.uid}`}>
            <a>Próximo post</a>
          </Link>
        </div>
      )}
    </div>
  );
}
