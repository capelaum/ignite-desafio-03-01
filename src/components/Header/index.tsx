import styles from "./header.module.scss";
import commonStyles from "../../styles/common.module.scss";

// TODO
export default function Header() {
  return (
    <header className={styles.headerContainer}>
        <img src="images/Logo.svg" alt="Space Travelling" />
    </header>
  );
}
