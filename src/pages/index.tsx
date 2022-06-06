import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { FiCalendar, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ results, next_page }: PostPagination) {
  return (
    <div className={styles.container}>
      <Head>
        <title>spacetraveling | Home</title>
      </Head>

      <div className={styles.postListContainer}>
        <ul>
          <li>
            <Image
              priority
              src="/images/Logo.svg"
              alt="logo"
              height={25.63}
              width={238.62}
            />
          </li>

          <li>
            {results.map(result => (
              <Link href={`/post/${result.uid}`}>
                <a key={result.uid}>
                  <div className={styles.listContainer}>
                    <h3>{result.data.title}</h3>
                    <p>{result.data.subtitle}</p>
                    <div className={styles.iconContainer}>
                      <div className={styles.icon}>
                        <FiCalendar />
                        <p>{result.first_publication_date}</p>

                        <FiUser />
                        <p>{result.data.author}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </li>

          <li>
            <button type="button">
              <p>Carregar mais posts</p>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('post', {
    pageSize: 20,
  });

  const posts = postsResponse.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      subtitle: RichText.asText(post.data.subtitle),
      excerpt:
        post.data.content.find(content => content.type === 'paragraph')?.text ??
        '',
      updatedAt: new Date(post.first_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
    };
  });

  console.log(postsResponse.results)

  return {
    props: { results: posts },
  };
};
