import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography, useTheme } from '@mui/material'
import React from 'react'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from '../../components/Header';
import { tokens } from '../../theme';

function AttendanceSelect() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <div>
        <Box m='20px'>
          <Header title="How To Check Attendance?" subtitle="Frequently asked questions" />
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color={colors.greenAccent[500]} variant="h5">
                How to Register?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                First get the owner ID from your employer and goto
                registration form and fill the form 
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color={colors.greenAccent[500]} variant="h5">
                How to Add Employeee?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Must be logged into the system. Then goto the Add employee section and fill out the form. You can upload photo or you can take photo
                from your webcam.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color={colors.greenAccent[500]} variant="h5">
                How to Take Photo?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Look directly into the camera and smile and wait for the countdown to take the picture 
                automatically.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color={colors.greenAccent[500]} variant="h5">
                How to Take Attendance?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Goto recognizer section and Look directly into the camera and smile and your attendance will be taken at that time
              </Typography>
            </AccordionDetails>
          </Accordion>
          <br />
          <a href='http://127.0.0.1:8000/' target="_blank" className='btn btn-success' style={{marginBottom: '20px'}}>Go to attendance page</a>
        </Box>
    </div>
  )
}

export default AttendanceSelect