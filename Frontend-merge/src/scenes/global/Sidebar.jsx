import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { ChatBubbleOutlineSharp, FeedbackSharp, MusicNoteOutlined } from "@mui/icons-material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import imageLogo from "../../assests/images/userProfile.png"
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import emoLogo from "../../assests/images/logo.png";


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};



const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [userName, setuserName] = useState( localStorage.getItem("user"))
  const [role, setRole ] = useState(localStorage.getItem("userRole"))

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                {/* <Typography variant="h3" color={colors.grey[100]}>
                  Emosense
                </Typography> */}

              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="220px"
                  height="170px"
                  src={emoLogo}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              {/* <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={imageLogo}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box> */}
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.greenAccent[500]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {userName}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Suggest Song"
              to="/song-suggest"
              icon={<MusicNoteOutlined />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="My music"
              to="/my-music"
              icon={<MusicNoteOutlined />}
              selected={selected}
              setSelected={setSelected}
            />
             <Item
              title="My Health Summary"
              to="/mental-health-summary"
              icon={<ChatBubbleOutlineSharp />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Helath Instruction"
              to="/instruction"
              icon={<ChatBubbleOutlineSharp />}
              selected={selected}
              setSelected={setSelected}
            />
             {/* <Item
              title="Feedback"
              to="/feedback"
              icon={<FeedbackSharp />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {role === "admin" ? (
              <Item
              title="Manage Tasks"
              to="/task"
              icon={<AssignmentIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            ) : (
              <Item
              title="My Tasks"
              to="/mytask"
              icon={<AssignmentIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            )}
            <Item
              title="Web Tracking"
              to="/track"
              icon={<GpsFixedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Attendance"
              to="/attendance"
              icon={<PeopleAltIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
