import styles from "../styles/SingleNote.module.css";
import { FcCancel, FcSettings, FcViewDetails } from "react-icons/fc";
import { Link } from "react-router-dom";

const SingleNote = ({ note, onDelete }) => {
  return (
    <div className={styles.noteCard}>
      <div className={styles.content}>
        <h6>
          {note.data.type === "private" ? "Gizli Not" : "Herkese Açık Not"}
        </h6>
        <h1>{note.data.title}</h1>
        <h3>{note.data.text}</h3>
      </div>
      <div className={styles.buttonGroup}>
        <Link to={`/notes/${note.id}`}>
          <FcViewDetails />
        </Link>
        <Link to={`/edit-note/${note.id}`}>
          <FcSettings />
        </Link>
        <Link to={`/profile/${note.userRef}`}>
          <FcCancel onClick={() => onDelete(note.id)} />
        </Link>
      </div>
    </div>
  );
};

export default SingleNote;
