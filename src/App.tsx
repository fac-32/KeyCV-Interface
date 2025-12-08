import "./App.css";
import CVUpload from "./components/CV-Upload";
import CreateUser from "./components/Create-User";
import LoginUser from "./components/Login-User";

function App() {
  return (
    <>
      <CreateUser />
      <LoginUser />
      <CVUpload />
    </>
  );
}

export default App;
