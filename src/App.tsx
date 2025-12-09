import "./App.css";
import CreateUser from "./components/Create-User";
import LoginUser from "./components/Login-User";
// import CVUpload from "./components/CV-Upload";
import JobForm from "./components/JobForm";

function App() {
  return (
    <>
      <CreateUser />
      <LoginUser />
      {/* <CVUpload /> */}
      <JobForm />
    </>
  );
}

export default App;
