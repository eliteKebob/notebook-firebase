import styles from "../styles/Header.module.css";
import logo from "../assets/fulllogo.png";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const Header = () => {
  const location = useLocation();
  const auth = getAuth();
  const navigate = useNavigate();

  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  const signOut = () => {
    auth.signOut();
    navigate("/sign-in");
  };

  return (
    <header>
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <div className={styles.navDiv}>
        <nav>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link
                to="/"
                className={
                  pathMatchRoute("/") ? styles.navLinkActive : styles.navLink
                }
              >
                Anasayfa
              </Link>
            </li>
            {auth.currentUser ? (
              <li className={styles.navItem}>
                <Link
                  to={`/profile/${auth.currentUser.uid}`}
                  className={
                    pathMatchRoute(`/profile/${auth.currentUser.uid}`)
                      ? styles.navLinkActive
                      : styles.navLink
                  }
                >
                  Profil
                </Link>
              </li>
            ) : (
              <li className={styles.navItem}>
                <Link
                  to="/sign-in"
                  className={
                    pathMatchRoute("/sign-in")
                      ? styles.navLinkActive
                      : styles.navLink
                  }
                >
                  Giriş Yap
                </Link>
              </li>
            )}
            {auth.currentUser ? (
              <li className={styles.navItemLogout} onClick={signOut}>
                Çıkış Yap
              </li>
            ) : (
              <li className={styles.navItem}>
                <Link
                  to="/sign-up"
                  className={
                    pathMatchRoute("/sign-up")
                      ? styles.navLinkActive
                      : styles.navLink
                  }
                >
                  Kayıt Ol
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
