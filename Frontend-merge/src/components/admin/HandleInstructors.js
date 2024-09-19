import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import editIcon from "../../assests/images/pencil.png";
import binIcon from "../../assests/images/bin.png";
import {
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Form,
} from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";
import { ValidateAddNewInstructor } from "./Validation";
import {
  createInstructor,
  getAllInstructors,
  updateInstructor,
  deleteInstructor,
} from "../../services/InstructorServices";
import { ValidateSignUp } from "../auth/Validation";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const HandleInstructors = () => {
  const navigate = useNavigate();

  const [instructorData, setInstructorData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullName, setfullName] = useState("");
  const [email, setemail] = useState("");
  const [mobileno, setmobileno] = useState("+94");
  const [dateOfBirth, setdateOfBirth] = useState("");
  const [weight, setweight] = useState("");
  const [height, setheight] = useState("");
  const [salary, setsalary] = useState("");

  const handlefullName = (e) => {
    e.preventDefault();
    setfullName(e.target.value);
  };

  const handleemail = (e) => {
    e.preventDefault();
    setemail(e.target.value);
  };

  const handlemobileno = (e) => {
    e.preventDefault();
    setmobileno(e.target.value);
  };
  const handledateOfBirth = (e) => {
    e.preventDefault();
    setdateOfBirth(e.target.value);
  };
  const handleweight = (e) => {
    e.preventDefault();
    setweight(e.target.value);
  };
  const handleheight = (e) => {
    e.preventDefault();
    setheight(e.target.value);
  };
  const handlesalary = (e) => {
    e.preventDefault();
    setsalary(e.target.value);
  };

  const addInstructor = async (e) => {
    e.preventDefault();

    const regdata = {
      fullName: fullName,
      email: email,
      mobileno: mobileno,
      dateOfBirth: dateOfBirth,
      weight: weight,
      height: height,
      salary: salary,
    };

    let validate = ValidateAddNewInstructor(regdata);
    let msg = validate?.message;
    if (validate.status == false) {
      Swal.fire({
        toast: true,
        icon: "warning",
        html: `<span>${msg}</span>`,
        animation: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: false,
      });
    } else {
      console.log("sending data", regdata);
      let data = await createInstructor(regdata);
      console.log(" Instructor data ", data);
      if (data?.data?.status === 1) {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Instructor Added Successfully",
        });
        setOpenModal(false);
        getInstructors();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    }
  };

  const getInstructors = async () => {
    try {
      setLoading(true);
      let data = await getAllInstructors();
      console.log("all data", data);

      let newData = data?.data?.data?.instructors?.map((item) => {
        return {
          instructor_id: item?.instructor_id,
          fullName: item?.fullName,
          email: item?.email,
          mobileno: item?.mobileno,
          dateOfBirth: item?.dateOfBirth,
          weight: item?.weight,
          height: item?.height,
          salary: item?.salary,
          status: item?.status,
          _id: item?._id,
        };
      });

      setInstructorData(newData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getInstructors();
  }, []);

  const columns = [
    {
      name: (
        <Badge color="dark" style={{ fontSize: "18px" }}>
          Instructor ID
        </Badge>
      ),
      selector: "instructor_id",
      cell: (data) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Label style={{ fontSize: "18px" }}>
            <b>{data?.instructor_id}</b>
            <br />
          </Label>
        </div>
      ),
    },
    {
      name: (
        <Badge color="dark" style={{ fontSize: "18px" }}>
          Full Name
        </Badge>
      ),
      selector: "fullName",
      cell: (data) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Label style={{ fontSize: "18px" }}>
            <b>{data?.fullName}</b>
            <br />
          </Label>
        </div>
      ),
    },
    {
      name: (
        <Badge color="dark" style={{ fontSize: "18px" }}>
          Email
        </Badge>
      ),
      selector: "email",
      cell: (data) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Label style={{ fontSize: "18px" }}>
            <b>{data?.email}</b>
            <br />
          </Label>
        </div>
      ),
    },
    {
      name: (
        <Badge color="dark" style={{ fontSize: "18px" }}>
          Mobile Number
        </Badge>
      ),
      selector: "mobileno",
      cell: (data) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Label style={{ fontSize: "18px" }}>
            <b>{data?.mobileno}</b>
            <br />
          </Label>
        </div>
      ),
    },
    {
      name: (
        <Badge color="dark" style={{ fontSize: "18px" }}>
          dateOfBirth
        </Badge>
      ),
      selector: "dateOfBirth",
      cell: (data) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Label style={{ fontSize: "18px" }}>
            <b>{data?.dateOfBirth}</b>
            <br />
          </Label>
        </div>
      ),
    },
    {
      name: (
        <Badge color="dark" style={{ fontSize: "18px" }}>
          Weight
        </Badge>
      ),
      selector: "weight",
      cell: (data) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Label style={{ fontSize: "18px" }}>
            <b>{data?.weight}</b>
            <br />
          </Label>
        </div>
      ),
    },
    {
      name: (
        <Badge color="dark" style={{ fontSize: "18px" }}>
          Height
        </Badge>
      ),
      selector: "height",
      cell: (data) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Label style={{ fontSize: "18px" }}>
            <b>{data?.height}</b>
            <br />
          </Label>
        </div>
      ),
    },
    {
      name: (
        <Badge color="dark" style={{ fontSize: "18px" }}>
          Salary
        </Badge>
      ),
      selector: "salary",
      cell: (data) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Label style={{ fontSize: "18px" }}>
            <b>{data?.salary !== null ? data?.salary : "No salary yet"}</b>
            <br />
          </Label>
        </div>
      ),
    },

    // {
    //     name: (<Badge color="dark" style={{ fontSize: "18px" }} >Instructor Update</Badge>),

    //     cell: (data) => (
    //       <div style={{ display: "flex", flexDirection: "column" }}>
    //         {/* <Link to={`/updateSub/${data?._id}`}> */}
    //         <Button
    //             className="btn btn-warning" style={{ fontSize: "16px" }}  ><i class="fa-solid fa-pen-to-square"></i>&nbsp;Update</Button>
    //         {/* </Link> */}
    //       </div>

    //     ),
    //   },

    //   {
    //     name: (<Badge color="dark" style={{ fontSize: "18px" }} >Instructor Delete</Badge>),

    //     cell: (data) => (
    //       <div style={{ display: "flex", flexDirection: "column" }}>
    //         <Button className="btn btn-danger" style={{ fontSize: "16px" }} ><i class="fa-solid fa-trash-can"></i>&nbsp;<b>Delete</b></Button>
    //       </div>

    //     ),
    //   },
    {
    
        cell: (data) => (

            <div className="row">
                <div className="col">
                <a onClick={(e)=>getSelectedInstructor(e,data)}> <img src={editIcon} style={{height: "25px", width:"25px",cursor: "pointer"}} /> </a>
                </div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div className="col">
                    <a onClick={(e) => deleteSelectedInstructor(e,data)}><img src={binIcon} style={{height: "25px", width:"25px", cursor: "pointer"}} /></a> 
                </div>
            </div>
            
        //   <div style={{ display: "flex", flexDirection: "column" }}>
        //     {/* <Link to={`/updateSub/${data?._id}`}> */}
        //     <Button 
        //         className="btn btn-warning" style={{ fontSize: "16px" }} onClick={(e)=>getSelectedUser(e,data)} ><i class="fa-solid fa-pen-to-square"></i>&nbsp;Update</Button>
        //     {/* </Link> */}
        //   </div>
  
        ),
      },
  ];

  const [instructor, setInstructor] = useState({});
  const [updateFullName, setUpdateFullName] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateMobileno, setUpdateMobileno] = useState("");
  const [updateDateOfBirth, setUpdateDateOfBirth] = useState("");
  const [updateWeight, setUpdateWeight] = useState("");
  const [updateHeight, setUpdateHeight] = useState("");
  const [updateSalary, setUpdateSalary] = useState("");

  const handleupdatefullName = (e) => {
    e.preventDefault();
    setUpdateFullName(e.target.value);
  };

  const handleupdateEmail = (e) => {
    e.preventDefault();
    setUpdateEmail(e.target.value);
  };

  const handleupdateMobileno = (e) => {
    e.preventDefault();
    setUpdateMobileno(e.target.value);
  };

  const handleupdateDateOfBirth = (e) => {
    e.preventDefault();
    setUpdateDateOfBirth(e.target.value);
  };

  const handleupdateWeight = (e) => {
    e.preventDefault();
    setUpdateWeight(e.target.value);
  };

  const handleupdateHeight = (e) => {
    e.preventDefault();
    setUpdateHeight(e.target.value);
  };

  const handleupdateSalary = (e) => {
    e.preventDefault();
    setUpdateSalary(e.target.value);
  };

  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const getSelectedInstructor = (e, instructor) => {
    e.preventDefault();
    setInstructor(instructor);
    setUpdateFullName(instructor.fullName);
    setUpdateEmail(instructor.email);
    setUpdateMobileno(instructor.mobileno);
    setUpdateDateOfBirth(moment(instructor.dateOfBirth).format("YYYY-MM-DD"));
    setUpdateWeight(instructor.weight);
    setUpdateHeight(instructor.height);
    setUpdateSalary(instructor.salary);
    setOpenUpdateModal(true);
    console.log(instructor);
  };

  //update instructor
  const updateData = async (e) => {
    e.preventDefault();

    var formData = {
      fullName: updateFullName,
      email: updateEmail,
      mobileno: updateMobileno,
      dateOfBirth: updateDateOfBirth,
      weight: updateWeight,
      height: updateHeight,
      salary: updateSalary,
    };

    let validate = ValidateSignUp(formData);
    let msg = validate?.message;
    if (validate.status == false) {
      Swal.fire({
        toast: true,
        icon: "warning",
        html: `<span>${msg}</span>`,
        animation: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: false,
      });
    } else {
      var data = await updateInstructor(instructor._id, formData);
      console.log("data", data);
      if (data?.data?.status == 1) {
        Swal.fire({
          icon: "success",
          //title: 'Congrats!',
          text: "Update successful...!",
        });
        setOpenUpdateModal(false);
        getInstructors();
        // navigate("/users");
        // window.location.reload();
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed..!",
          text: `${data?.data?.message}`,
        });
      }
    }
    
  };

  const deleteSelectedInstructor = async (e, instructor) => {
    e.preventDefault();
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            let data = await deleteInstructor(instructor._id);
            console.log("Delete ", data);
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
            getInstructors();
        }
    }) 
}

//.......................Search...............................................

const filterData = (searchInstructorDetails, Searchkey) => {
    console.log(searchInstructorDetails, Searchkey);
    const result = searchInstructorDetails.filter(
        (instructor) =>
            // console.log(product),
            instructor.fullName.toString().toLowerCase().includes(Searchkey) ||
            instructor.email.toString().toLowerCase().includes(Searchkey) ||
            instructor.instructor_id.toString().toLowerCase().includes(Searchkey),
    );
    setInstructorData(result);
}

const handleSearchArea = async (e) => {
    const Searchkey = e.currentTarget.value;
    await getAllInstructors().then((res) => {
        console.log(res.data);
        if (res.data?.status == "1") {
            filterData(res?.data?.data?.instructors, Searchkey);
        }
    });
}

//---------------------------------------------------------

  return (
    <div style={{ marginTop: "70px", marginBottom: "70px" }}>
      <div style={{ margin: "10px" }}>
        <Card>
          <CardHeader>
            <center>
              <CardTitle
                style={{ color: "black", fontSize: "30px", float: "left" }}
              >
                <b>All Instructors</b>
              </CardTitle>
              {/* <Button className="btn btn-dark" style={{ fontSize: "15px"}} ><i class="fa-solid fa-print"></i><b> </b></Button> */}
              <div style={{ fontSize: "15px", float: "right" , marginLeft:"10px"}}>                            
                <ReactHTMLTableToExcel                                
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-dark"
                    table="table-to-xls"
                    filename="Full Instructor Details"
                    sheet="tablexls"
                    buttonText={<i class="fa-solid fa-print"></i>}
                />
              </div>
              <Button
                className="btn btn-dark"
                style={{ fontSize: "15px", float: "right" }}
                onClick={() => setOpenModal(true)}
              >
                <i class="fa-solid fa-circle-plus"></i>&nbsp;
                <b>Add New Instructor</b>
              </Button>
            </center>
            <br/><br/><br/>
            <div style={{ float: "right" }}>
                <input
                    className="form-control"
                    style={{ width: "400px" }}
                    type="search"
                    placeholder="Search for Instructors"
                    name="searchQuery"
                    onChange={(e) => handleSearchArea(e)}
                >
                </input>
            </div>
          </CardHeader>
          <CardBody>
            <DataTable
              data={instructorData}
              columns={columns}
              progressPending={loading}
            />
          </CardBody>
        </Card>

        <table id="table-to-xls" style={{display:"none"}}>
            <tr>
                <th>Instructor ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Mobile Nnumber</th>
                <th>Date Of Birth</th>
                <th>Weight</th>
                <th>Height</th>
                <th>Salary</th>
            </tr>
            {instructorData.map((user)=>{
                return (
                    <tr>
                        <td>{user?.instructor_id}</td>
                        <td>{user?.fullName}</td>
                        <td>{user?.mobileno}</td>
                        <td>{user?.email}</td>
                        <td>{user?.dateOfBirth}</td>
                        <td>{user?.weight}</td>
                        <td>{user?.height}</td>
                        <td>{user?.salary}</td>
                    </tr>
                )
            })}
            <tr></tr>
            <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th>Total Instructors</th>
                <td>{instructorData.length}</td>
            </tr>                                      
        </table>

        <div>
          <Modal
            isOpen={openModal}
            className="modal-dialog-centered"
            fade={true}
            backdrop={true}
          >
            <ModalHeader
              toggle={() => {
                setOpenModal(false);
              }}
            >
              <Label>Add New User</Label>
            </ModalHeader>
            <ModalBody>
              <div style={{ width: "400px" }}>
                <Form>
                  <Label>Full Name </Label>
                  <Input
                    type="text"
                    className="input"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => handlefullName(e)}
                  />
                  <br />

                  <Label>Email</Label>
                  <Input
                    type="email"
                    className="input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => handleemail(e)}
                  />
                  <br />

                  <Label>Contact Number</Label>
                  <Input
                    type="text"
                    className="input"
                    placeholder="Contact Number"
                    value={mobileno}
                    onChange={(e) => handlemobileno(e)}
                  />
                  <br />

                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    className="input"
                    placeholder="dateOfBirth"
                    value={dateOfBirth}
                    onChange={(e) => handledateOfBirth(e)}
                  />
                  <br />

                  <Label>Weight</Label>
                  <Input
                    type="text"
                    className="input"
                    placeholder="Weight example : 65 "
                    value={weight}
                    onChange={(e) => handleweight(e)}
                  />
                  <br />

                  <Label>Height</Label>
                  <Input
                    type="text"
                    className="input"
                    placeholder="Height example : 5' 5''"
                    value={height}
                    onChange={(e) => handleheight(e)}
                  />
                  <br />

                  <Label>Salary</Label>
                  <Input
                    type="text"
                    className="input"
                    placeholder="Salary"
                    value={salary}
                    onChange={(e) => handlesalary(e)}
                  />
                  <br />

                  <Button
                    className="btn btn-dark"
                    onClick={(e) => addInstructor(e)}
                  >
                    Add new Instructor
                  </Button>
                </Form>
              </div>
            </ModalBody>
          </Modal>
        </div>

        {/* update modal */}

        <div>
          <Modal
            isOpen={openUpdateModal}
            className="modal-dialog-centered"
            fade={true}
            backdrop={true}
          >
            <ModalHeader
              toggle={() => {
                setOpenUpdateModal(false);
              }}
            >
              <Label>Update User</Label>
            </ModalHeader>
            <ModalBody>
              <div style={{ width: "400px" }}>
                <Form>
                  <Label>Full Name </Label>
                  <Input
                    type="text"
                    className="input"
                    placeholder="Full Name"
                    value={updateFullName}
                    onChange={(e) => handleupdatefullName(e)}
                  />
                  <br />

                  <Label>Email</Label>
                  <Input
                    type="email"
                    className="input"
                    placeholder="Email"
                    value={updateEmail}
                    onChange={(e) => handleupdateEmail(e)}
                  />
                  <br />

                  <Label>Contact Number</Label>
                  <Input
                    type="text"
                    className="input"
                    placeholder="Contact Number"
                    value={updateMobileno}
                    onChange={(e) => handleupdateMobileno(e)}
                  />
                  <br />

                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    className="input"
                    placeholder="dateOfBirth"
                    value={updateDateOfBirth}
                    onChange={(e) => handleupdateDateOfBirth(e)}
                  />
                  <br />

                  <Label>Weight</Label>
                  <Input
                    type="text"
                    className="input"
                    placeholder="Weight example : 65 "
                    value={updateWeight}
                    onChange={(e) => handleupdateWeight(e)}
                  />
                  <br />

                  <Label>Height</Label>
                  <Input
                    type="text"
                    className="input"
                    placeholder="Height example : 5' 5''"
                    value={updateHeight}
                    onChange={(e) => handleupdateHeight(e)}
                  />
                  <br />

                  <Label>Salary</Label>
                  <Input
                    type="text"
                    className="input"
                    placeholder="Salary"
                    value={updateSalary}
                    onChange={(e) => handleupdateSalary(e)}
                  />
                  <br />

                  <Button
                    className="btn btn-dark"
                    onClick={(e) => updateData(e)}
                  >
                    Update Instructor
                  </Button>
                </Form>
              </div>
            </ModalBody>
          </Modal>
        </div>

      </div>
    </div>
  );
};

export default HandleInstructors;
