/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
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

export default function Post() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Post | spacetraveling</title>
      </Head>

      <Header />

      <div className={styles.banner}>
        <Image
          priority
          src="/images/Banner.png"
          alt="banner"
          height={500}
          width={1950}
        />
      </div>

      <main className={styles.contentContainer}>
        <div className={styles.postTitle}>
          <div>
            <h1>Como utilizar Hooks</h1>
          </div>

          <div>
            <time>15 Mar 2021</time>
            <div>Joseph Oliveira</div>
            <time>4 min</time>
          </div>
        </div>


        <div>
          <h2>Criando um app CRA do zero</h2>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text ever
            since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.{' '}
          </p>
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

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient({});
//   const posts = await prismic.getByType(TODO);

//   // TODO
// };

// export const getStaticProps = async ({params }) => {
//   const prismic = getPrismicClient({});
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
