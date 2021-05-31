import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import Prismic from '@prismicio/client';

import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';

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

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router?.isFallback) {
    return <h2>Carregando...</h2>;
  }

  const totalWords = post.data.content.reduce((total, content) => {
    const headingCount = content.heading.split(' ').length;
    const textArray = content.body.map(body => body.text);
    const bodyCount = textArray.join(' ').split(' ').length;

    return total + (headingCount + bodyCount);
  }, 0);

  const timeToRead = Math.ceil(totalWords / 200);
  // console.log("🚀 ~ timeToRead", timeToRead)

  return (
    <>
      <Head>
        <title>{post?.data.title} | SpaceTraveling</title>
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
          <h1>{post?.data.title}</h1>
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
              {timeToRead} min
            </span>
          </div>

          {post.data.content.map(content => (
            <div key={content.heading} className={styles.postContent}>
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
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts'),
  ]);

  return {
    paths: posts.results.map((post, index) => {
      if (index < 2)
        return {
          params: { slug: post.uid },
        };
    }),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const { slug } = context.params;
  const response = await prismic.getByUID('posts', String(slug), {});

  console.log(JSON.stringify(response.data, null, 2));

  // response.data.content.map(content => RichText.asText(content))

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
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
          body: content.body.map(body => {
            return {
              text: body.text,
              type: body.type,
              spans: body.spans,
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
