import "./App.css";
import CreateUser from "./components/Create-User";
import LoginUser from "./components/Login-User";
import JobForm from "./components/JobForm";
import { Routes, Route, Link } from "react-router";

function App() {
  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="app-nav__brand">
          <Link to="/">KeyCV</Link>
        </div>
        <div className="app-nav__center"> We highlight what matters</div>
        <div className="app-nav__actions">
          <Link to="/create-user">Join to us</Link>
          <span className="app-nav__divider" aria-hidden="true">
            |
          </span>
          <Link to="/login-user">Sign In</Link>
        </div>
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
