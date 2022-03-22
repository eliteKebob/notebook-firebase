import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/NoteForm.module.css";
import { MdDangerous } from "react-icons/md";
import { BsShareFill } from "react-icons/bs";
import { toast } from "react-toastify";

const Note = () => {
  const [formData, setFormData] = useState({
    title: "",
    type: "public",
    text: "",
  });
  const { title, type, text } = formData;

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  const handleClick = (e) => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Bağlantı adresi başarıyla kopyalandı!");
  };

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

  return (
    <div className={styles.container}>
      {!auth.currentUser && type === "private" ? (
        <div className={styles.private}>
          <MdDangerous className={styles.dangerIcon} />
          <p>Bu not gizli olduğu için görüntüleyemezsiniz</p>
        </div>
      ) : (
        <form>
          <div className={styles.formInput}>
            <input type="text" name="title" value={title} disabled />
            <textarea type="text" name="text" value={text}></textarea>
            <div className={styles.shareIcon} onClick={handleClick}>
              <BsShareFill />
              <p>Bağlantı adresini kopyala</p>
            </div>
            <input
              type="text"
              name="type"
              value={type === "private" ? "Gizli Not" : "Herkese Açık Not"}
              disabled
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Note;
