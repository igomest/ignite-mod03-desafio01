import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { FiCalendar, FiUser } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
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
  next_page: string | null;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextPage, setNextPage] = useState('');

  useEffect(() => {
    setPosts(postsPagination.results);
    setNextPage(postsPagination.next_page);
  }, [postsPagination.results, postsPagination.next_page]);

  const handleClick = (): void => {
    fetch(nextPage)
      .then(res => res.json())
      .then(data => {
        const formattedData = data.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: post.first_publication_date,
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          };
        });
        setPosts([...posts, ...formattedData]);
        setNextPage(data.next_page);
      });
  };

  return (
    <>
      <Head>
        <title>Home | Space Traveling</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.logo}>
          <Image
            priority
            src="/images/Logo.svg"
            alt="logo"
            height={25.63}
            width={238.62}
          />
        </div>

        <main className={commonStyles.content}>
          <section className={styles.posts}>
            {posts.map(post => (
              <Link href={`/post/${post.uid}`} key={post.uid}>
                <a>
                  <h2>{post.data.title}</h2>
                  <p>{post.data.subtitle}</p>
                  <div>
                    <span>
                      <FiCalendar size={20} color="#BBBBBB" />
                      {format(
                        new Date(post.first_publication_date),
                        'dd MMM yyyy',
                        {
                          locale: ptBR,
                        }
                      )}
                    </span>

                    <span>
                      <FiUser size={20} color="#BBBBBB" />
                      {post.data.author}
                    </span>
                  </div>
                </a>
              </Link>
            ))}
          </section>

          {nextPage && (
            <button type="button" onClick={handleClick}>
              Carregar mais posts
            </button>
          )}
        </main>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('post', {
    pageSize: 2,
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: postsResponse.results,
      },
      revalidate: 60 * 5, // 5 minutes
    },
  };
};
