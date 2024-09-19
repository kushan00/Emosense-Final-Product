import { createContext, useEffect, useState } from "react";
import { Auth } from "../../services/AuthServices";

const AuthContext = createContext();

function AuthContextProvider(props) {

  const [Token, setToken] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userLogged, setuserLogged] = useState(false);

  const checkToken = async ()=>{
    let data = await Auth(localStorage.getItem("token"));
    console.log("data",data);
    
  }

  useEffect(() => {

    checkToken();
    setToken(localStorage.getItem("token"));
    setUserRole(localStorage.getItem("userRole"));
    setuserLogged(true);

    if (localStorage.getItem("token") == undefined) {

      localStorage.removeItem("token");
      localStorage.removeItem("userRole");

      setToken(localStorage.getItem("token"));
      setUserRole(localStorage.getItem("userRole"));
      setuserLogged(false);
    }
    
  }, []);


  return (
    <AuthContext.Provider value={{ Token, userRole , userLogged}}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };
