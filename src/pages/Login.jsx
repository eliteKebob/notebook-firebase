import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/lilnb.png";
import styles from "../styles/Auth.module.css";
import { MdVisibility, MdVisibilityOff, MdSend } from "react-icons/md";
import OAuth from "../components/OAuth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        navigate(`/profile/${auth.currentUser.uid}`);
        toast.success("Giriş yapma işlemi başarılı");
      }
    } catch (error) {
      toast.error("Giriş yapma işlemi başarısız :(");
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
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Şifre"
          />
          {showPassword ? (
            <MdVisibilityOff
              className={styles.showPassword}
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          ) : (
            <MdVisibility
              className={styles.showPassword}
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          )}
          <button>
            <MdSend /> Giriş Yap
          </button>
          <Link to="/sign-up">Üye değilseniz buradan kayıt olun</Link>
          <Link to="/forgot-password">Şifremi unuttum</Link>
          <OAuth />
        </form>
      </main>
    </div>
  );
};

export default Login;
