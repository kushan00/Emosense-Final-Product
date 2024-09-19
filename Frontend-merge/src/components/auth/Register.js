import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUsers } from "../../services/AuthServices.js";
import Swal from 'sweetalert2';
import { ValidateSignUp } from "./Validation";
import "./responsive.css";

const Register = () => {

	// fullName, 
	// email, 
	// password,  
	// mobileno, 
	// dateOfBirth,
	// position,  
	// faceBookUsername,
	// address,

	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		password2: "",
        dateOfBirth:"",
        position:"",
		mobileno:"+94",
		address:"",
		faceBookUsername:""
	});

	const { fullName, email, password, password2 , faceBookUsername , address , dateOfBirth ,position , mobileno  } = formData;

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {

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
				if (password !== password2) {
					Swal.fire({
						toast: true,
						icon: 'warning',
						html: `<span>Password do not match...</span>`,
						animation: true,
						position: 'top-right',
						showConfirmButton: false,
						timer: 2000,
						timerProgressBar: false,
					});
				} else {
					let data = await RegisterUsers(formData);
					console.log("data",data)
					if(data?.data?.status == 1)
					{
					localStorage.setItem("token",data?.data?.data?.token);
					localStorage.setItem("userRole",data?.data?.data?.userRole);
					localStorage.setItem("user",data?.data?.data?.user);
                    localStorage.setItem("userID",data?.data?.data?.userID);
					localStorage.setItem("_id",data?.data?.data?._id);
					localStorage.setItem("accessToken",data?.data?.data?.accessToken);
					Swal.fire({
						icon: 'success',
						title: 'Congrats!',
						text: 'Register successfull...!',
					})
					navigate("/");
					window.location.reload();
					}
					else
					{
						Swal.fire({
							icon: 'error',
                            title: 'Registration Failed..!',
                            text: `${data?.data?.message}`,
						})
					}
				}
			}
	};


	return (
		<div>
			<center>
				<br></br>
			<h1 className="heading" style={{ fontWeight: "bold"}}>Sign Up</h1>
			<p className="lead">
				 Create Your Account
			</p>
			<br />
			<form className="form" onSubmit={(e) => onSubmit(e)} >
				<div className="form-group">
					<input
                        id='responsive'
						className="form-control"
                        type="text"
						placeholder="Name"
						name="fullName"
						value={fullName}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className="form-group">
					<input
                        id='responsive'
                        className="form-control"
						type="email"
						placeholder="Email Address"
						name="email"
						value={email}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className="form-group">
					<input
                        id='responsive'
                        className="form-control"
						type="password"
						placeholder="Password"
						name="password"
						minLength="6"
						value={password}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className="form-group">
					<input
                        id='responsive'
						className="form-control"
						type="password"
						placeholder="Confirm Password"
						name="password2"
						minLength="6"
						value={password2}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className="form-group">
					<input
                        id='responsive'
						className="form-control"
						type="text"
						placeholder="Mobile no"
						name="mobileno"
						value={mobileno}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className="form-group">
					<input
                        id='responsive'
						className="form-control"
						type="text"
						placeholder="Address"
						name="address"
						value={address}
						onChange={(e) => onChange(e)}
					/>
				</div>
                <div className="form-group">
					<input
                        id='responsive'
						className="form-control"
						type="text"
						placeholder="position"
						name="position"
						value={position}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className="form-group">
					<input
                        id='responsive'
						className="form-control"
						type="text"
						placeholder="FaceBook Username"
						name="faceBookUsername"
						value={faceBookUsername}
						onChange={(e) => onChange(e)}
					/>
				</div>
                <div className="form-group">
					<input
                        id='responsive'
						className="form-control"
						type="date"
						placeholder="Date of Birth"
						name="dateOfBirth"
						value={dateOfBirth}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<input 
                    type="submit" 
                    className="btn btn-dark" 
                    id='responsive'
				    value="Register" 
                />
			</form>
            <br/>
			<p className="lead">
				Already have an account?&nbsp;&nbsp;<Link to="/login" style={{color:"green" , textDecoration:"none"}}>Sign In</Link>
				<br></br>
			</p>
			</center>
		</div>
	);
};

export default Register;
