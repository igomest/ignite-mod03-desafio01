import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { predicate } from '@prismicio/client';
import Link from 'next/link';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  uid: string;
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
  nextPost?: Post | null;
  prevPost?: Post | null;
}

export default function Post({ post, nextPost, prevPost }: PostProps) {
  const router = useRouter();
  const { slug } = router.query;
  console.log(slug);

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

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
    <>
      <Head>
        <title>{post.data.title} | Space Traveling</title>
      </Head>

      <Header />

      <div className={styles.bannerContainer}>
        <Image
          priority
          src={post.data.banner.url}
          alt="banner"
          height={500}
          width={2000}
        />
      </div>

      <div className={styles.container}>
        <main className={styles.postContainer}>
          <div className={styles.titleContainer}>
            <h1>{post.data.title}</h1>
            <div className={styles.icons}>
              <span>
                <FiCalendar size={20} color="#BBBBBB" />
                {format(parseISO(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </span>

              <span>
                <FiUser size={20} color="#BBBBBB" />
                {post.data.author}
              </span>

              <span>
                <FiClock size={20} color="#BBBBBB" />
                {readingTime} min
              </span>
            </div>
          </div>

          <div className={styles.postContent}>
            {post.data.content.map(({ heading, body }) => (
              <div key={heading}>
                {heading && <h2>{heading}</h2>}

                <div
                  className={styles.postSection}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: RichText.asHtml(body) }}
                />
              </div>
            ))}
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.previousPost}>
            <p>{post.data.title}</p>

            <a>Post anterior</a>
          </div>

          <div className={styles.nextPost}>
            <p>Criando um app CRA do Zero</p>
            {nextPost && (
              <Link href={`/post/${nextPost.uid}`}>
                <a>Próximo post</a>
              </Link>
            )}
          </div>
        </footer>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('post', {
    pageSize: 2,
  });

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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const { slug } = params;
  const response = await prismic.getByUID('post', String(slug), {});

  const nextResponse = await prismic.get({
    predicates: prismic.predicate.at('document.type', 'post'),
    pageSize: 2,
  });

  const prevResponse = await prismic.get({
    predicates: prismic.predicate.at('document.type', 'post'),
    pageSize: 2,
  });

  const nextPost = nextResponse?.results[0] || null;
  const prevPost = prevResponse?.results[0] || null;

  return {
    props: {
      post: response,
      nextPost,
      prevPost,
    },
    revalidate: 60 * 30, // 30 minutos
  };
};
