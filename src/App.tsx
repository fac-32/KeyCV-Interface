import "./App.css";
import CreateUser from "./components/Create-User";
import LoginUser from "./components/Login-User";
import JobForm from "./components/JobForm";
import { Routes, Route, Link } from "react-router";

function App() {
  return (
    <>
    <Link to='/KeyCV-Interface/'>Home</Link> |{" "}
    <Link to='/KeyCV-Interface/create-user'>Create User</Link> |{" "}
    <Link to='/KeyCV-Interface/login-user'>Login</Link>
      <Routes>
        <Route path="/KeyCV-Interface/create-user" element={<CreateUser />} />
        <Route path="/KeyCV-Interface/login-user" element={<LoginUser />} />
        <Route path="/KeyCV-Interface/" element={<JobForm />} />
      </Routes>
    </>
  );
}

export default App;
