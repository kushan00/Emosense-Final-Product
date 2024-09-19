import { useState , useContext} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthContext from "./components/context/Auth.context";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

//Auth
import LandingPage from "./components/layouts/LandingPage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AutoCamera from "./components/songSugesst/AutoCamera";
import UpdateToken from "./components/updateToken/UpdateToken";
import ChatBotHome from "./components/chatbot/ChatBotHome";
import FeedbackForm from "./components/feedback/FeedbackForm";

import Tasks from "./scenes/tasks"
import MyTasks from "./scenes/my tasks";
import WebTracking from "./components/webTrack/WebTracking";
import AttendanceSelect from "./components/attendance/AttendanceSelect";

import InstructionPage from './components/InstructionPage';
import FormComponent from './components/FormComponent';
import Progress from './components/Progress';
import MentalHealthSummary from './components/MentalHealthSummary';
import Mymusic from "./components/songSugesst/Mymusic";

function SiteRouter() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const { userLogged } = useContext(AuthContext);

  console.log(useContext(AuthContext));

  return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
          {userLogged ? 
          (
          <>
            <div className="app">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Topbar setIsSidebar={setIsSidebar} />
                <Routes>                  
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/song-suggest" element={<AutoCamera />} />
                    <Route path="/my-music" element={<Mymusic />} />
                    <Route path="/update-token" element={<UpdateToken />} />
                    <Route path="/chatbot" element={<ChatBotHome />}/>
                    <Route path="/feedback" element={<FeedbackForm />}/>
                    <Route path="/task" element={<Tasks />} />              
                    <Route path="/mytask" element={<MyTasks />} />            
                    <Route path="/track" element={<WebTracking />} /> 
                    <Route path="/attendance" element={<AttendanceSelect />} />  

                    <Route path="/instruction" element={<InstructionPage />} />
                    <Route path="/form" element={<FormComponent />} />
                    <Route path="/view-progress" element={<Progress/>} />
                    <Route path="/mental-health-summary" element={<MentalHealthSummary/>} />
                </Routes>
              </main>
            </div>
          </>
          )
          :
          (
          <>
            <Routes>
              <Route exact path="*" element={<LandingPage/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/login" element={<Login/>}/>
            </Routes>
          </>
          )
          }
        </Router>
        </ThemeProvider>
      </ColorModeContext.Provider>
  );
}

export default SiteRouter;
