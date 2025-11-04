import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./security/AuthContext";
import useToken from "./security/useToken";
import Login from "./security/Login";
import Register from "./security/RegisterForm";
import Navigation from "../Navigation/Navigation";
import Homepage from "./homekoto";
import GlitchPage from "../utils/Glitch";
import DiscoveryPage from "../Discovery/DiscoveryPage";
import Statuses from "../Improvement/Status";
import AllNews from "../News/Allnews";
import News from "../News/News";
import CustomFileButton from "../Unknown/attachmentissues";
import MyBed from "../crumblingfarumazula/MyBed";
import SubmitNews from "../News/SubmitNews";
import StudyHomePage from "../Study/StudyHome";
import ContentList from "../Study/Studynotes";
import AllStudyNotes from "../Study/AllStudyNotes";
import TasksPage from "../tasks/TaskPage";
import OldTasksPage from "../tasks/OldTasksPage";
import Stats from "../Characters/Stats";
import FlashCards from "../Study/Flashcards/FlashCards";
import DiaryGrid from "../Characters/Diary/DiaryGrid";
import DiaryForm from "../Characters/Diary/DiaryForm";
import MyRoom from "../crumblingfarumazula/MyRoom";
import Certificate from "../Newgameplus/Certificate";
import HabitStack from "../Improvement/HabitStack";
import Mastery from "../Characters/Mastery";
import Popup from "../utils/Timepopup";
import Levelone from "../utils/LevelOne.jsx";
import MarketPlace from "../Characters/Diary/MarketPlace.jsx";
import SkillTree from "../skilltree/skilltree.jsx";
import SpinDaWheel from "../utilities/SpinDaWheel";
import Manifestation from "../utilities/Manifestation.jsx";
import { GuestOnly } from "./security/Guards.jsx";


const App = () => {
  const { token, setToken } = useToken();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 23 || currentHour < 5) {
      setShowPopup(true);
    }
  }, []);

  if (!token) {
    return <Login setToken={setToken} />;
  }
  fetch("/protected-route", { headers: { Authorization: `Bearer ${token}` } })
  .then(res => {
    if (res.status === 401 || res.status === 403) {
      // Clear app data
      localStorage.clear();
      sessionStorage.clear();
      // Redirect to login
      window.location.href = "/login";
    }
    return res.json();
  });

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        {showPopup && <Popup />}

       
        <Routes>
            <Route element={<GuestOnly />}>
            <Route path="/login" element={<Login setToken={(t) => localStorage.setItem("token", t?.token)} />} />
               </Route>
                
        <Route path="/register" element={<Register setToken={(t) => localStorage.setItem("token", t?.token)} />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/discovery" element={<DiscoveryPage />} />
          <Route path="/status" element={<Statuses />} />
          <Route path="/news" element={<AllNews />} />
          <Route path="/news/:newsId" element={<News />} />
          <Route path="/attachment" element={<CustomFileButton />} />
          <Route path="/mybed" element={<MyBed />} />
          <Route path="/submitNews" element={<SubmitNews />} />
          <Route path="/study/notes" element={<StudyHomePage />} />
          <Route path="/study/:viewnoteId" element={<ContentList />} />
          <Route path="/study/all" element={<AllStudyNotes />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/old-tasks" element={<OldTasksPage />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/study/flashcards" element={<FlashCards />} />
          <Route path="/diary" element={<DiaryGrid />} />
          <Route path="/create-diary" element={<DiaryForm />} />
          <Route path="/myroom" element={<MyRoom />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/habits" element={<HabitStack />} />
          <Route path="/mastery" element={<Mastery />} />
          <Route path="/levelone" element={<Levelone />} />
          <Route path="/marketplace" element={<MarketPlace />} />
          <Route path="/skills" element={<SkillTree />} />
          <Route path="/wheel" element={<SpinDaWheel />} />
          <Route path="/manifestation" element={<Manifestation />} />
          <Route path="*" element={<GlitchPage />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
