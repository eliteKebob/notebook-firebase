import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import styles from "../styles/Auth.module.css";
import { FcGoogle } from "react-icons/fc";

const OAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, "usersInfo", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(doc(db, "usersInfo", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate(`/profile/${auth.currentUser.uid}`);
    } catch (error) {
      toast.error("Hata. Tekrar deneyin");
    }
  };
  return (
    <div className={styles.container}>
      <p className={styles.socialInfo} onClick={onGoogleClick}>
        <FcGoogle onClick={onGoogleClick} className={styles.socialButton} />{" "}
        Google ile{" "}
        {location.pathname === "/sign-up" ? "kayıt olun" : "giriş yapın"}
      </p>
    </div>
  );
};

export default OAuth;
