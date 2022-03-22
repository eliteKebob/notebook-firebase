import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import styles from "../styles/Profile.module.css";
import {
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import avatar from "../assets/avatar.png";
import SingleNote from "../components/SingleNote";
import { toast } from "react-toastify";
import { BiWorld, BiBoltCircle } from "react-icons/bi";
import { BsPencilSquare, BsPersonSquare } from "react-icons/bs";

const Profile = () => {
  const [usersInfo, setUsersInfo] = useState({});
  const [userNotes, setUserNotes] = useState([]);

  const navigate = useNavigate();
  const auth = getAuth();
  const params = useParams();

  useEffect(() => {
    const getUserProfileCollection = async () => {
      const docRef = doc(db, "usersInfo", params.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUsersInfo(docSnap.data());
      }
    };

    getUserProfileCollection();
  }, [navigate, params.id]);

  useEffect(() => {
    const fetchUserNotes = async () => {
      const notesRef = collection(db, "notes");
      const q = query(
        notesRef,
        where("userRef", "==", params.id),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let userNotes = [];

      querySnap.forEach((doc) => {
        return userNotes.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setUserNotes(userNotes);
    };
    fetchUserNotes();
  }, [navigate, params.id]);

  const onDelete = async (id) => {
    if (window.confirm("Silmek istediğinizden emin misiniz?")) {
      await deleteDoc(doc(db, "notes", id));
      const updatedNotes = userNotes.filter((note) => note.id !== id);
      setUserNotes(updatedNotes);
      toast.success("Not başarıyla silindi!");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <img
          src={usersInfo.imgUrls ? usersInfo.imgUrls[0] : avatar}
          alt="profilePhoto"
        />
        <div className={styles.nameBio}>
          <h2>
            {usersInfo.name} {usersInfo.lastName}
          </h2>
          <h5>"{usersInfo.bio}"</h5>
          <div className={styles.userCards}>
            <h6>{usersInfo.age} yaşında</h6>
            <h6>
              {<BiBoltCircle />} {usersInfo.job}
            </h6>
            <h6>
              {<BiWorld />} {usersInfo.city}
            </h6>
          </div>
        </div>
        <div className={styles.control}>
          <Link to={`/profile-edit/${auth.currentUser.uid}`}>
            Profilini düzenle {<BsPersonSquare />}
          </Link>
          <Link to={`/create-note`}>Not yaz {<BsPencilSquare />}</Link>
        </div>
      </div>
      <div className={styles.notes}>
        {userNotes.map((note, idx) => (
          <SingleNote
            note={note}
            key={idx}
            id={note.id}
            onDelete={() => onDelete(note.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
