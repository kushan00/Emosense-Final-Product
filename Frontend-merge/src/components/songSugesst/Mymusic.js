import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  styled,
  Box,
  Typography,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import axios from "axios";
import Iframe from "react-iframe";
import binIcon from "../../assests/images/bin.png";
import Swal from "sweetalert2";

function Mymusic() {
  const [music, setmusic] = useState([]);

  const getMyMusic = async () => {
    try {
      const data = await axios.get(
        `http://localhost:5000/music/get-music-by-id/${localStorage.getItem(
          "userID"
        )}`
      );
      console.log(data);
      setmusic(data?.data?.data?.songs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyMusic();
  }, []);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));


  const removeMusic = async (id) => {
    console.log(id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(id);
        const data = await axios.delete(
          `http://localhost:5000/music/delete-music/${id}`
        );
        console.log("Delete ", data);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        getMyMusic();
      }
    });
  };

  return (
    <div style={{ margin: "50px", textAlign: "center" }}>
      {/* <Typography variant="h4" gutterBottom>
        My Music
      </Typography> */}
      <Box>
        <TableContainer component={Paper} style={{ margin: "40px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>My Songs</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {music.map((musicItem) => (
                <StyledTableRow key={musicItem?.user_id}>
                  <StyledTableCell>
                    <Iframe
                      src={`https://www.youtube.com/embed/${musicItem?.song_id}`}
                      width="440px"
                      height="220px"
                      className=""
                      display="flex"
                      position="center"
                    />
                  </StyledTableCell>

                  <StyledTableCell>
                    <div className="col">
                      <a onClick={() => removeMusic(musicItem?._id)}>
                        <img
                          src={binIcon}
                          style={{
                            height: "25px",
                            width: "25px",
                            cursor: "pointer",
                          }}
                        />
                      </a>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}

export default Mymusic;
