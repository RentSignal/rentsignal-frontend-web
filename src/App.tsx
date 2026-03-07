import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Info from "./pages/Info";
import Recommend from "./pages/Recommend";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import OAuthRedirect from "./pages/auth/OAuthRedirect";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/oauth2/redirect" element={<OAuthRedirect />} />
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<Info />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
