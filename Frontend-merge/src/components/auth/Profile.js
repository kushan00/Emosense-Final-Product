import React ,{ useContext , useState , useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { Auth, RegisterUsers } from "../../services/AuthServices";
import AuthContext from "../context/Auth.context";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Form,
    Input,
    Button,
    Container,
    Row,
    Col,
} from "reactstrap";
import UserImage from "../../assests/images/user.png";
import Swal from 'sweetalert2';
import { ValidateSignUp } from "./Validation";
import "./responsive.css";
import moment from "moment";
import { updateInstructor } from "../../services/InstructorServices";
import { updateUser , GetUserPlans } from "../../services/UserServices";
import { updateAdmin } from "../../services/AuthServices";
import { jsPDF } from "jspdf";

const Profile = () => {

  const navigate = useNavigate();

  const { Token, userRole } = useContext(AuthContext);

  const [user , setUser] = useState({});



  const getUser = async () => {
    const data = await Auth(Token);
    console.log(data?.data?.data?.user);
    setUser(data?.data?.data?.user);
    setFormData({
        fullName: data?.data?.data?.user?.fullName,
        email: data?.data?.data?.user?.email,
        password: data?.data?.data?.user?.password,
        weight:data?.data?.data?.user?.weight,
        dateOfBirth:moment(data?.data?.data?.user?.dateOfBirth).format("YYYY-MM-DD"),
        height:data?.data?.data?.user?.height,
        mobileno:data?.data?.data?.user?.mobileno
    });
    if(userRole == "user")
    {
        getUserWOrkOutAndDietPlans(data?.data?.data?.user?._id);
    }
  }

  useEffect(() => {
    if(userRole == "user")
    {
        setshowUser(true);
    }
    if(userRole == "admin")
    {
        setshowAdminUser(true);
    }
    if(userRole == "instructor")
    {
        setshowInstructorUser(true);
    }
    getUser();
  },[]);

  //show different modals
  const [showAdminUser, setshowAdminUser] = useState(false);
  const [showInstructorUser, setshowInstructorUser] = useState(false);
  const [showUser, setshowUser] = useState(false);


  const [updateChange, setUpdaetChange] = useState(false);
  const ChangetoUpdate = (e) => {
    e.preventDefault();
    setUpdaetChange(true);
  };

  const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        weight:"",
        dateOfBirth:"",
        height:"",
        mobileno:"+94"
    });

    const { fullName, email, weight , dateOfBirth ,height , mobileno  } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const UpdateData = async (e) => {

		e.preventDefault();

		let validate = ValidateSignUp(formData);
		let msg = validate?.message;
		if(validate.status == false)
		{
			Swal.fire({
                toast: true,
                icon: 'warning',
                html: `<span>${msg}</span>`,
                animation: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: false,
            });
		}

		else{
                var data;

                if(userRole == "user")
                {
                    data = await updateUser(user._id,formData);
                }
                if(userRole == "admin")
                {
                    data = await updateAdmin(user._id,formData);
                }
                if(userRole == "instructor")
                {
                    data = await updateInstructor(user._id,formData);
                }
                console.log("data",data)
                if(data?.data?.status == 1)
                {
                Swal.fire({
                    icon: 'success',
                    title: 'Congrats!',
                    text: 'Update successfull...!',
                    })
                navigate("/profile");
                window.location.reload();
                }
                else
                {
                    Swal.fire({
                        icon: 'error',
                        title: 'Update Failed..!',
                        text: `${data?.data?.message}`,
                    })
                }
			}
	};

    const [userWorkout, setuserWorkout] = useState({});
    const [userDiet, setuserDiet] = useState({});
    const [plansEmpty, setplansEmpty] = useState(false);

    const getUserWOrkOutAndDietPlans = async (id) => {
        const data = await GetUserPlans(localStorage.getItem("userID"));
        console.log("user Palns",data);
        if(data?.data?.status == 1)
        {
            setuserWorkout(data?.data?.data?.data?.workout);
            setuserDiet(data?.data?.data?.data?.diet);
            setplansEmpty(false);
        }
        else
        {
            setuserWorkout({});
            setuserDiet({});
            setplansEmpty(true);
        }
    }

    const pdfGenerateToWorkOut = () =>{
        console.log(" pdf generator execute")

              const doc = new jsPDF("P","pt","a4");

              doc.setFont("helvetica","bold");
  
              doc.text(`${fullName}'s Workout Plan `,200,50);
              doc.text(``,200,70);
  
              doc.setFont("helvetica","italic");
              doc.text(`Workout Type : ${userWorkout.workout_type}`,110,80);
              
              doc.setFont("courier","normal");
     
              doc.text(`Exercise 1 : ${userWorkout.exercise1}`,110,100);
              doc.text(`Exercise 2 : ${userWorkout.exercise2}`,110,120);
              doc.text(`Exercise 3 : ${userWorkout.exercise3}`,110,140);
              doc.text(`Exercise 4 : ${userWorkout.exercise4}`,110,160);
              doc.text(`Exercise 5 : ${userWorkout.exercise5}`,110,180);
              doc.text(`Exercise 6 : ${userWorkout.exercise6}`,110,200);

              doc.text(`Last Updated Date : ${moment(userWorkout.updatedAt).format("YYYY-MM-DD")}`,110,220);

              //window.open(doc.save(`${order.reference} invoice.pdf`));
              window.open(doc.output('bloburl'), '_blank');
    }


    const pdfGenerateToDiet = () =>{
        console.log(" pdf generator execute")

              const doc = new jsPDF("P","pt","a4");

              doc.setFont("helvetica","bold");
  
              doc.text(`${fullName}'s Diet Plan `,200,50);
              doc.text(``,200,70);
  
              doc.setFont("helvetica","italic");
              doc.text(`Workout Type : ${userDiet.workout_type}`,110,80);
              
              doc.setFont("courier","normal");
     
              doc.text(`Meal 1 : ${userDiet.meal1}`,110,100);
              doc.text(`Meal 2 : ${userDiet.meal2}`,110,120);
              doc.text(`Meal 3 : ${userDiet.meal3}`,110,140);
              doc.text(`Meal 4 : ${userDiet.meal4}`,110,160);
              doc.text(`Meal 5 : ${userDiet.meal5}`,110,180);
              doc.text(`Meal 6 : ${userDiet.meal6}`,110,200);

              doc.text(`Last Updated Date : ${moment(userDiet.updatedAt).format("YYYY-MM-DD")}`,110,220);
   
              //window.open(doc.save(`${order.reference} invoice.pdf`));
              window.open(doc.output('bloburl'), '_blank');
    }


  return (
    <div style={{ marginTop: "70px", marginBottom: "70px" }}>
        <center>
            <h1 style={{fontSize:"40px" , marginBottom: "30px" , color:"red" , width:"800px"}}><b>{user?.fullName}'s Profile</b></h1>

                <div>
                    <Card id="responsiveCard">
                    <CardBody>
                    <img src={UserImage} style={{ width: 200, padding:'10px'}}></img>
                        <div style={{ width: "600px" }}>
                        <Form className="form">
				        <div className="form-group">
                            <input
                                id='responsiveProfile'
                                className="form-control"
                                type="text"
                                placeholder="Name"
                                name="fullName"
                                value={fullName}
                                onChange={(e) => onChange(e)}
                                readOnly={!updateChange ? true : false}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                id='responsiveProfile'
                                className="form-control"
                                type="email"
                                placeholder="Email Address"
                                name="email"
                                value={email}
                                onChange={(e) => onChange(e)}
                                readOnly={!updateChange ? true : false}
                            />
                        </div>
                        {/* <div className="form-group">
                            <input
                                id='responsiveProfile'
                                className="form-control"
                                type="password"
                                placeholder="Password"
                                name="password"
                                minLength="6"
                                value={password}
                                onChange={(e) => onChange(e)}
                                readOnly={!updateChange ? true : false}
                            />
                        </div> */}
                        <div className="form-group">
                            <input
                                id='responsiveProfile'
                                className="form-control"
                                type="text"
                                placeholder="Mobile no"
                                name="mobileno"
                                value={mobileno}
                                onChange={(e) => onChange(e)}
                                readOnly={!updateChange ? true : false}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                style={{display: userRole == "admin" ? "none" : "inline"}}
                                id='responsiveProfile'
                                className="form-control"
                                type="text"
                                placeholder="Weight"
                                name="weight"
                                value={weight}
                                onChange={(e) => onChange(e)}
                                readOnly={!updateChange ? true : false}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                style={{display: userRole == "admin" ? "none" : "inline"}}
                                id='responsiveProfile'
                                className="form-control"
                                type="text"
                                placeholder="Height example: "
                                name="height"
                                value={height}
                                onChange={(e) => onChange(e)}
                                readOnly={!updateChange ? true : false}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                id='responsiveProfile'
                                className="form-control"
                                type="date"
                                placeholder="Date of Birth"
                                name="dateOfBirth"
                                value={dateOfBirth}
                                onChange={(e) => onChange(e)}
                                readOnly={!updateChange ? true : false}
                            />
                        </div>
                            <br />
                            <Button
                            color="danger"
                            onClick={(e) => ChangetoUpdate(e)}
                            style={{ display: updateChange ? "none" : "flex" }}
                            >
                            Click To Update
                            </Button>
                            <Button
                            className="btn btn-dark"
                            onClick={(e) => UpdateData(e)}
                            style={{ display: updateChange ? "flex" : "none" }}
                            >
                            Update
                            </Button>
                        </Form>
                        </div>
                    </CardBody>
                    </Card>  

                </div>
        </center>

            {/* <div style={{display : showAdminUser ? "flex" : "none"}}>
            <h1>Admin</h1>
            </div>

            <div style={{display : showInstructorUser ? "flex" : "none"}}>
            <h1>Instructor</h1>
            </div> */}

            <div style={{display : showUser ? "flex" : "none" , width:"100%" , marginTop:"100px"}} >
                <center style={{width:"100%"}}>
                    <div style={{width:"100%"}}>
                    <div class="col-md-12 text-center">
                        <h3 class="animate-charcter"><b>My Workout Plan & Diet Plan</b></h3>
                    </div>
                        <br/><br/>
                        {
                        plansEmpty ? 
                            <div>
                                <h1 style={{color:"grey" , width:"100%" , fontSize:"30px"}}>Sorry... {fullName} No Plans Available Yet</h1>
                            </div>
                        :
                            <Container style={{width:"100%"}}>
                                <Row>
                                    <Col style={{width:"50%"}}>
                                        <div style={{width:"400px" , height:"500px" , border:"1px solid black" , borderRadius:"10px" , borderWidth:"5px" , padding:"10px"}}>
                                            <center><h3 style={{color:"red" , fontSize:"30px"}}>Work Out Plan</h3></center> 
                                            <br/>  
                                                <div>
                                                    <h5 style={{fontSize:"20px"}}>Workout Type : <label style={{color:"red"}}>{userWorkout?.workout_type}</label></h5>
                                                    <h5 style={{fontSize:"20px"}}>Exercise 1 : <label style={{color:"red"}}>{userWorkout?.exercise1}</label></h5>
                                                    <h5 style={{fontSize:"20px"}}>Exercise 2 : <label style={{color:"red"}}>{userWorkout?.exercise2}</label></h5>
                                                    <h5 style={{fontSize:"20px"}}>Exercise 3 : <label style={{color:"red"}}>{userWorkout?.exercise3}</label></h5>
                                                    <h5 style={{fontSize:"20px"}}>Exercise 4 : <label style={{color:"red"}}>{userWorkout?.exercise4}</label></h5>
                                                    <h5 style={{fontSize:"20px"}}>Exercise 5 : <label style={{color:"red"}}>{userWorkout?.exercise5}</label></h5>
                                                    <h5 style={{fontSize:"20px"}}>Exercise 6 : <label style={{color:"red"}}>{userWorkout?.exercise6}</label></h5>
                                                    <h5 style={{fontSize:"20px"}}>Last Updated Date : <label style={{color:"red"}}>{moment(userWorkout?.updatedAt).format("YYYY-MM-DD")}</label></h5>
                                                    <br/>
                                                    <Button className="btn btn-dark" onClick={pdfGenerateToWorkOut}> Download Workout Plan</Button>
                                                </div>                     
                                        </div> 
                                    </Col>
                                    <Col style={{width:"50%"}}>
                                        <div style={{width:"400px" , height:"500px" , border:"1px solid black" , borderRadius:"10px" , borderWidth:"5px" , padding:"10px"}}>
                                            <center><h3 style={{color:"red" , fontSize:"30px"}}>Diet Plan</h3></center>
                                            <br/> 
                                                <div>
                                                    <h5 style={{fontSize:"20px"}}>Workout Type : <label style={{color:"red"}}>{userDiet?.workout_type}</label></h5>
                                                    <h5 style={{fontSize:"20px"}}>Meal 1 : <label style={{color:"red"}}>{userDiet?.meal1}</label></h5>
                                                    <h5 style={{fontSize:"20px"}}>Meal 2 : <label style={{color:"red"}}>{userDiet?.meal2}</label></h5>
                                                    <h5 style={{fontSize:"20px"}}>Meal 3 : <label style={{color:"red"}}>{userDiet?.meal3}</label></h5>
                                                    <h5 style={{fontSize:"20px"}}>Meal 4 : <label style={{color:"red"}}>{userDiet?.meal4}</label></h5>
                                                    <h5 style={{fontSize:"20px"}}>Meal 5 : <label style={{color:"red"}}>{userDiet?.meal5}</label></h5>
                                                    <h5 style={{fontSize:"20px"}}>Meal 6 : <label style={{color:"red"}}>{userDiet?.meal6}</label></h5>
                                                    <h5 style={{fontSize:"20px"}}>Last Updated Date : <label style={{color:"red"}}>{moment(userDiet?.updatedAt ).format("YYYY-MM-DD")}</label></h5>
                                                    <br/>
                                                    <Button className="btn btn-dark" onClick={pdfGenerateToDiet}> Download Diet Plan</Button>
                                                </div>                       
                                        </div> 
                                    </Col>
                                </Row>
                            </Container>
                        
                        }
                        
                    </div>
                </center>


            </div>
    </div>
  );
}

export default Profile;