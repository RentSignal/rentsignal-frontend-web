import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Info from "./pages/Info";
import Recommend from "./pages/Recommend";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import OAuthRedirect from "./pages/auth/OAuthRedirect";
import ProfileComments from "./pages/profile/ProfileComments";
import ProfileLikes from "./pages/profile/ProfileLikes";
import ProfilePosts from "./pages/profile/ProfilePosts";
import ProfileName from "./pages/profile/UpdateName";
import ProfilePhone from "./pages/profile/UpdatePhone";
import ProfileDelete from "./pages/profile/DeleteAccount";

function App() {
  return (
    <Routes>
      <Route path="/oauth2/redirect" element={<OAuthRedirect />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<Info />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />}>
          <Route path="posts" element={<ProfilePosts />} />
          <Route path="comments" element={<ProfileComments />} />
          <Route path="likes" element={<ProfileLikes />} />
          <Route path="name" element={<ProfileName />} />
          <Route path="phone" element={<ProfilePhone />} />
          <Route path="delete" element={<ProfileDelete />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
