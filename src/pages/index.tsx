import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from 'react-icons/fi'

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

export default function Home() {
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
              alt="Logo"
              height={25.63}
              width={238.62}
            />
          </li>

          <li>
            <div className={styles.listContainer}>
              <h3>Como utilizar Hooks</h3>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <div className={styles.iconContainer}>
                <div className={styles.icon}>
                  <FiCalendar />
                  <p>15 Mar 2021</p>

                  <FiUser />
                  <p>Klein Moretti</p>
                </div>
              </div>
            </div>
          </li>

          <li>
            <button type="button">
              <p>Carregar mais posts</p>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient({});
//   // const postsResponse = await prismic.getByType(TODO);

//   // TODO
// };
