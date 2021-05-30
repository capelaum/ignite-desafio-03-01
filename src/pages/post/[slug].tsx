import { GetStaticPaths, GetStaticProps } from 'next';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { getPrismicClient } from '../../services/prismic';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Head from 'next/head';

interface Post {
  first_publication_date: string | null;
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
}

// TODO
export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post?.data.title} | SpaceTraveling</title>
      </Head>

      <div className={styles.bannerContainer}>
        <img
          src={post?.data.banner.url}
          alt={post?.data.banner.alt}
          className={styles.banner}
        />
      </div>

      <main className={commonStyles.container}>
        <article className={styles.post}>
          <h1>{post?.data.title}</h1>
          <div className={commonStyles.infoContainer}>
            <time>
              <FiCalendar />
              {post?.first_publication_date}
            </time>
            <span>
              <FiUser />
              {post?.data.author}
            </span>
          </div>

          {post?.data.content.map(content => (
            <div key={content.heading} className={styles.content}>
              <h2>{content.heading}</h2>
              {content.body.map((body, index) => (
                <p key={index}>{body.text}</p>
              ))}
            </div>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  // const posts = await prismic.query();

  // TODO
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const { slug } = context.params;
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    first_publication_date: format(
      new Date(response.last_publication_date),
      'dd MMM yyyy',
      { locale: ptBR }
    ),
    data: {
      title: response.data.title,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
        alt: response.data.banner.alt,
      },
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: content.body.map(body => {
            return {
              text: body.type === 'paragraph' ? body.text : '',
            };
          }),
        };
      }),
    },
  };

  return {
    props: {
      post,
    },
  };
};
