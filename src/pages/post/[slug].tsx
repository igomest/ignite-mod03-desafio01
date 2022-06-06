import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url?: string;
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
  const amountWordsOfBody = RichText.asText(
    post.data.content.reduce((acc, data) => [...acc, ...data.body], [])
  ).split(' ').length;

  const amountWordsOfHeading = post.data.content.reduce((acc, data) => {
    if (data.heading) {
      return [...acc, ...data.heading.split(' ')];
    }

    return [...acc];
  }, []).length;

  const readingTime = Math.ceil(
    (amountWordsOfBody + amountWordsOfHeading) / 200
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>

      <Header />

      <div className={styles.banner}>
        <Image
          priority
          src={`${post.data.banner.url}`}
          alt="banner"
          height={500}
          width={1950}
        />
      </div>

      <main className={styles.contentContainer}>
        <div className={styles.postTitle}>
          <div>
            <h1>{post.data.title}</h1>
          </div>

          <div>
            <time>{post.first_publication_date}</time>
            <div>{post.data.author}</div>
            <time>{readingTime} min</time>
          </div>
        </div>

        <div>
          {post.data.content.map(({ heading, body }) => (
            <>
              <h2>{heading}</h2>
              <p dangerouslySetInnerHTML={{ __html: RichText.asHtml(body) }} />
            </>
          ))}
        </div>

        <div>
          <div>
            <h2>Instalando Dependências</h2>
          </div>

          <div>
            <p>Content</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticPaths = async () => {
  // const prismic = getPrismicClient({});
  // const posts = await prismic.getByType(TODO);

  // TODO

  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const { slug } = params;
  const response = await prismic.getByUID('post', String(slug), {});

  return {
    props: {
      post: response,
    },
  };
};
