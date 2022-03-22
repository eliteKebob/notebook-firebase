import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../styles/NoteForm.module.css";

const CreateNote = () => {
  const [formData, setFormData] = useState({
    title: "",
    type: "public",
    text: "",
  });

  const { title, type, text } = formData;

  const auth = getAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataCopy = {
        ...formData,
        timestamp: serverTimestamp(),
        userRef: auth.currentUser.uid,
      };
      const docRef = await addDoc(collection(db, "notes"), formDataCopy);
      navigate(`/notes/${docRef.id}`);
      toast.success("Not başarıyla yayınlandı");
    } catch (error) {
      toast.error("Not yayınlanamadı");
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.formButtons}>
        <button
          type="button"
          name="type"
          value="private"
          className={
            type === "private" ? styles.activeButton : styles.formButton
          }
          onClick={handleChange}
        >
          Gizli Not
        </button>
        <button
          type="button"
          name="type"
          value="public"
          className={
            type === "public" ? styles.activeButton : styles.formButton
          }
          onClick={handleChange}
        >
          Herkese Açık Not
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formInput}>
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            placeholder="Başlık girin"
          />
          <textarea
            type="text"
            name="text"
            value={text}
            onChange={handleChange}
            placeholder="Notunuzu yazın"
          ></textarea>
          <button>Notu Yayınla</button>
        </div>
      </form>
    </div>
  );
};

export default CreateNote;
