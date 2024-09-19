import React from "react";
import { useContext } from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import AuthContext from "../context/Auth.context";
import Logo from "../../assests/images/logo.jpg";


const LandingPage = () => {

  const { Token, userRole } = useContext(AuthContext);

  return (
    <div>

    <center>
      <div className="row  m-0" style={{padding:"50px", display:Token == undefined ? "flex" : "none"}}>
      <div className="col">
        <Link to="/register" >
                <button className="btn btn-dark" style={{ width:"500px", height:"70px", fontSize:"20px"}}>JOIN WITH US</button>
        </Link>
        </div>
        <div className="col">
        <Link to="/login">
                  <button className="btn btn-dark" style={{ width:"500px", height:"70px", fontSize:"20px"}}>LOGIN</button>
        </Link>
      </div>
    </div>
    </center>
    </div>
  );
};

export default LandingPage;
