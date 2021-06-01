import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

import { getPrismicClient } from '../../services/prismic';
import Comments from '../../components/Comments';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Link from 'next/link';

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

interface PostProps {
  post: Post;
  nextPage: Post;
  prevPage: Post;
  preview: boolean;
}

export default function Post({ post, nextPage, prevPage, preview }: PostProps) {
  const router = useRouter();

  if (router.isFallback) return <h2>Carregando...</h2>;

  const calculateTimeToRead = () => {
    const totalWords = post.data.content.reduce((total, content) => {
      const headingCount = content.heading.split(' ').length;
      const textArray = content.body.map(body => body.text);
      const bodyCount = textArray.join(' ').split(' ').length;

      return total + (headingCount + bodyCount);
    }, 0);

    return Math.ceil(totalWords / 200).toString();
  };

  return (
    <>
      <Head>
        <title>{post.data.title} | SpaceTraveling</title>
      </Head>

      <div className={styles.bannerContainer}>
        <img
          src={post.data.banner.url}
          alt={post.data.title}
          className={styles.banner}
        />
      </div>

      <main className={commonStyles.container}>
        <article className={styles.post}>
          <h1>{post.data.title}</h1>
          <div className={commonStyles.infoContainer}>
            <time>
              <FiCalendar />
              {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                locale: ptBR,
              })}
            </time>
            <span>
              <FiUser />
              {post.data.author}
            </span>
            <span>
              <FiClock />
              {calculateTimeToRead()} min
            </span>
          </div>

          {post.first_publication_date !== post.last_publication_date && (
            <div className={commonStyles.infoContainer}>
              <span className={commonStyles.editInfo}>
                * editado em{' '}
                {format(
                  new Date(post.last_publication_date),
                  "dd MMM yyyy', às ' HH:mm",
                  {
                    locale: ptBR,
                  }
                )}
              </span>
            </div>
          )}

          {post.data.content.map(section => (
            <section key={section.heading} className={styles.postContent}>
              <h2>{section.heading}</h2>
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(section.body),
                }}
              />
            </section>
          ))}
        </article>
      </main>

      <footer className={commonStyles.container}>
        <div className={styles.paginator}>
          {prevPage && (
            <div className={styles.paginatorContent}>
              <h2>{prevPage.data.title}</h2>
              <Link href={`/post/${prevPage.uid}`}>
                <a>Post Anterior</a>
              </Link>
            </div>
          )}

          {nextPage && (
            <div className={styles.paginatorContent}>
              <h2>{nextPage.data.title}</h2>
              <Link href={`/post/${nextPage.uid}`}>
                <a>Próximo Post</a>
              </Link>
            </div>
          )}
        </div>

        <Comments />

        {preview && (
          <aside className={commonStyles.previewPrismic}>
            <Link href="/api/exit-preview">
              <a>Sair do modo Preview</a>
            </Link>
          </aside>
        )}
      </footer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(result => {
    return {
      params: {
        slug: result.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {
    ref: previewData?.ref ?? null,
  });

  if (!response?.data) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body],
        };
      }),
    },
  };

  const nextPage = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: `${response.id}`,
      orderings: '[document.first_publication_date desc]',
    }
  );

  const prevPage = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: `${response.id}`,
      orderings: '[document.first_publication_date]',
    }
  );

  return {
    props: {
      post,
      nextPage: nextPage.results[0] || null,
      prevPage: prevPage.results[0] || null,
      preview,
    },
    revalidate: 60 * 60, // 1 hora
  };
};
