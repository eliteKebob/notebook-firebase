import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../styles/NoteForm.module.css";

const EditNote = () => {
  const [formData, setFormData] = useState({
    title: "",
    type: "public",
    text: "",
  });

  const { title, type, text } = formData;

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchNote = async () => {
      const docRef = doc(db, "notes", params.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFormData({ ...docSnap.data() });
      }
    };

    fetchNote();
  }, [navigate, params.id]);

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
      const docRef = doc(db, "notes", params.id);
      await updateDoc(docRef, formDataCopy);
      navigate(`/notes/${docRef.id}`);
      toast.success("Not başarıyla güncellendi");
    } catch (error) {
      toast.error("Not güncellenemedi :(");
      console.log(error.code);
      console.log(error.message);
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
          <button>Notu Güncelle</button>
        </div>
      </form>
    </div>
  );
};

export default EditNote;
