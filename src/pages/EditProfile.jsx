import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../styles/EditProfile.module.css";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    bio: "",
    job: "",
    age: "",
    city: "",
    profilePhoto: {},
  });

  const { name, lastName, bio, job, age, city, profilePhoto } = formData;

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, "usersInfo", params.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFormData({ ...docSnap.data() });
      }
    };

    fetchUser();
  }, [navigate, params.id]);

  const onChange = (e) => {
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        profilePhoto: e.target.files,
      }));
    }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const storeImage = async (image) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage();
          const fileName = `${auth.currentUser.uid}-${image.name}`;

          const storageRef = ref(storage, "images/" + fileName);

          const uploadTask = uploadBytesResumable(storageRef, image);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Yükleniyor %" + progress + " ...");
              switch (snapshot.state) {
                case "paused":
                  console.log("Yükleme durdu");
                  break;
                case "running":
                  console.log("Yükleme sürüyor");
                  break;
                default:
                  break;
              }
            },
            (error) => {
              reject(error);
            },
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      };

      const imgUrls = await Promise.all(
        [...profilePhoto].map((image) => storeImage(image))
      ).catch(() => {
        toast.error("Resim yüklenemedi :(");
        return;
      });

      const formDataCopy = {
        ...formData,
        imgUrls,
        timestamp: serverTimestamp(),
      };

      delete formDataCopy.profilePhoto;

      const docRef = doc(db, "usersInfo", params.id);
      await updateDoc(docRef, formDataCopy);

      navigate(`/profile/${docRef.id}`);
      toast.success("Profil başarıyla güncellendi");
    } catch (error) {
      toast.error("Profil güncellenemedi :(");
      console.log(error.code);
      console.log(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <main>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="İsim"
          />
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={onChange}
            placeholder="Soyisim"
          />
          <input
            type="text"
            name="bio"
            value={bio}
            onChange={onChange}
            placeholder="Biyografi"
          />
          <input
            type="text"
            name="job"
            value={job}
            onChange={onChange}
            placeholder="Meslek"
          />
          <input
            type="number"
            name="age"
            value={age}
            onChange={onChange}
            placeholder="Yaş"
          />
          <input
            type="text"
            name="city"
            value={city}
            onChange={onChange}
            placeholder="Şehir"
          />
          <label htmlFor="profilePhoto">Profil Resmi</label>
          <input
            type="file"
            name="profilePhoto"
            onChange={onChange}
            max="1"
            accept=".jpg,.png,.jpeg"
          />
          <button>Profili Düzenle</button>
        </form>
      </main>
    </div>
  );
};

export default EditProfile;
