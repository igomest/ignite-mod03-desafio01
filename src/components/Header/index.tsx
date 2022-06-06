import styles from './header.module.scss'
import Image from 'next/image'

export default function Header() {
  return (
    <header className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          priority
          src="/images/Logo.svg"
          alt="logo"
          height={25.63}
          width={238.62}
        />
      </div>
    </header>
  )
}
