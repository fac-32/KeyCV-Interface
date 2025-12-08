import "./App.css";
import CVUpload from "./components/CV-Upload";
import CreateUser from "./components/ui/Create-User";
import LoginUser from "./components/ui/Login-User";

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
