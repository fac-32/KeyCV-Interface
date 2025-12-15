import { useState } from "react";
import { signInUser } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import "./JobForm.css";
import "./Auth.css";

const LoginUser = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setMessage("email and password fields are required");
      return;
    }

    const { data, error } = await signInUser(email, password);

    if (error) {
      if (error.message === "Invalid login credentials") {
        setMessage("Email or password is incorrect");
      } else {
        setMessage("Something has gone wrong while trying to log you in");
      }
    } else if (data) {
      setMessage(`You are signed in`);
    }
  };

  return (
    <section className="job-form__shell">
      <div className="job-form__card">
        <form className="job-form" onSubmit={submitHandler}>
          <h2>Sign in to your account</h2>

          <div className="job-form__field">
            <Label htmlFor="login-email">Email</Label>
            <Input
              type="email"
              id="login-email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="job-form__field">
            <Label htmlFor="login-password">Password</Label>
            <Input
              type="password"
              id="login-password"
              name="current-password"
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {message && (
            <div>
              <p>{message}</p>
            </div>
          )}

          <div className="job-form__actions">
            <Button type="submit">Sign in</Button>
          </div>

          <div className="auth-footer">
            <Link to="/create-user" className="text-small">
              Create a new account
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginUser;
