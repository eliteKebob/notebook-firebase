import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import styles from "../styles/NoteForm.module.css";
import { MdDangerous } from "react-icons/md";
import { BsShareFill, BsLink45Deg } from "react-icons/bs";
import { toast } from "react-toastify";
import avatar from "../assets/avatar.png";

const Note = () => {
  const [noteWriter, setNoteWriter] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    type: "public",
    text: "",
    userRef: "",
    timestamp: [],
  });
  const { title, type, text, userRef, timestamp } = formData;
  const seconds = timestamp.seconds * 1000;
  let noteDate = new Date(seconds).toLocaleString();

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

  useEffect(() => {
    const fetchNoteWriter = async () => {
      const writerRef = doc(db, "usersInfo", userRef);
      const writerSnap = await getDoc(writerRef);

      if (writerSnap.exists()) {
        setNoteWriter({ ...writerSnap.data() });
      }
    };
    fetchNoteWriter();
  }, [userRef]);

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
            <div className={styles.writer}>
              <img
                src={noteWriter.imgUrls ? noteWriter.imgUrls[0] : avatar}
                alt=""
              />
              <div className={styles.writerInfo}>
                <Link to={`/profile/${userRef}`}>
                  <h2>
                    {noteWriter.name} {noteWriter.lastName} {<BsLink45Deg />}
                  </h2>
                </Link>
                <h6>{noteDate}</h6>
              </div>
            </div>
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
