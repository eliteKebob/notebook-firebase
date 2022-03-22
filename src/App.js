import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import CreateNote from "./pages/CreateNote";
import Note from "./pages/Note";
import EditNote from "./pages/EditNote";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<Register />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile-edit/:id" element={<EditProfile />} />
          <Route path="/create-note" element={<CreateNote />} />
          <Route path="/edit-note/:id" element={<EditNote />} />
          <Route path="/notes/:id" element={<Note />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
