import axios from "axios";
import { AuthContextProvider } from "./components/context/Auth.context.js"; 
import SiteRouter from "./Router.js";
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <AuthContextProvider>
      <SiteRouter />
    </AuthContextProvider>
  );
};

export default App;
