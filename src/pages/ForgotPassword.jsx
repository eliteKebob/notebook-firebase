import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import logo from "../assets/lilnb.png";
import styles from "../styles/Auth.module.css";
import { MdSend } from "react-icons/md";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("E-posta gönderildi!");
    } catch (error) {
      toast.error("Hata. Tekrar deneyin");
    }
  };

  return (
    <div className={styles.container}>
      <img src={logo} alt="logo" className={styles.logo} />
      <main>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="E-Posta"
          />

          <button>
            <MdSend /> E-posta Gönder
          </button>
          <Link to="/sign-up">Kayıt olmak için tıklayın</Link>
          <Link to="/sign-in">Giriş yapmak için tıklayın</Link>
        </form>
      </main>
    </div>
  );
};

export default ForgotPassword;
