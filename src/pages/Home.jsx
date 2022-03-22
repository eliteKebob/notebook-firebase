import { getAuth } from "firebase/auth";
import styles from "../styles/Home.module.css";
import main from "../assets/main.svg";
import { Link } from "react-router-dom";

const Home = () => {
  const auth = getAuth();
  return (
    <div className={styles.homeBody}>
      <div className={styles.info}>
        <h1>Notların düzenli ve güvenli!</h1>
        <p>Notlarını gizli veya herkese açık olarak belirleyebilirsin.</p>
        {!auth.currentUser ? (
          <button>
            <Link to="sign-in">Giriş Yap</Link>
          </button>
        ) : (
          <button>
            <Link to="create-note">Yeni bir not için tıkla</Link>
          </button>
        )}
        {!auth.currentUser ? (
          <button>
            <Link to="sign-up">Kayıt olmak için tıkla</Link>
          </button>
        ) : (
          <button>
            <Link to={`/profile/${auth.currentUser.uid}`}>Profilin</Link>
          </button>
        )}
      </div>
      <div className={styles.logo}>
        <img src={main} alt="mainimage" />
      </div>
    </div>
  );
};

export default Home;
