import Link from "next/link";
import styles from "./header.module.scss";
import commonStyles from "../../styles/common.module.scss";

// TODO
export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <a>
          <img src="images/Logo.svg" alt="logo" />
        </a>
      </Link>
    </header>
  );
}
