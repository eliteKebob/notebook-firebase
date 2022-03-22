import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/lilnb.png";
import styles from "../styles/Auth.module.css";
import { MdVisibility, MdVisibilityOff, MdSend } from "react-icons/md";
import OAuth from "../components/OAuth";

const Register = () => {
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, "usersInfo", user.uid), formDataCopy);
      navigate(`/profile-edit/${user.uid}`);
      toast.success("Başarıyla kayıt oldun, profilini düzenleyebilirsin :)");
    } catch (error) {
      toast.error("Kayıt olma işlemi başarısız :(");
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
            <MdSend /> Kayıt Ol
          </button>
          <Link to="/sign-in">
            Üyeliğiniz varsa buradan giriş yapabilirsiniz
          </Link>
          <Link to="/forgot-password">Şifremi unuttum</Link>
          <OAuth />
        </form>
      </main>
    </div>
  );
};

export default Register;
