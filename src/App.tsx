import "./App.css";
import CreateUser from "./components/Create-User";
import LoginUser from "./components/Login-User";
import JobForm from "./components/JobForm";
import { Routes, Route, Link } from "react-router";

function App() {
  return (
    <div className="app-shell">
      <nav className="app-nav">
        <Link to="/">KeyCV</Link>
        <Link to="/create-user">Join to us</Link>
        <Link to="/login-user">Sign In</Link>
      </nav>
      <main className="app-main">
        <Routes>
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/login-user" element={<LoginUser />} />
          <Route path="/" element={<JobForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
