import { useState } from "react";
import { signUpUser, getCurrentUser, insertUser } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import "./Auth.css";
import "./JobForm.css";

const CreateUser = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");

    if (!email || !password) {
      setMessage("email and password fields are required");
      return;
    }

    if (password.length < 8) {
      setMessage("password must be at least 8 characters long");
      return;
    }

    // sign up a user is auth.users
    const { data, error } = await signUpUser(email, password);

    if (error) {
      if (error?.code === "user_already_exists") {
        setMessage("This email is already in use");
      } else {
        setMessage("An error has occured while creating your account");
      }
    } else if (data) {
      const {
        data: { user },
      } = await getCurrentUser();

      if (!user?.id) {
        setMessage("An error has occured while creating your account");
        return;
      }

      // insert a user in the public.users relation with auth.users.id as FK PK
      const { error } = await insertUser(user.id);

      if (error?.code === "23505") {
        setMessage(`This email is already in use`);
      } else {
        setMessage(
          `Account created successfully ${/*, please verify your email*/ ""}`
        ); // I remove email verification for quick testing
      }
    }
  };

  return (
    <section className="job-form__shell">
      <div className="job-form__card">
        <form
          className="job-form"
          onSubmit={submitHandler}
          aria-label="Create Account Form"
        >
          <h2>Create a new account</h2>

          <div className="job-form__field">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              type="email"
              id="signup-email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="job-form__field">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              type="password"
              id="signup-password"
              name="new-password"
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {message && (
            <div>
              <p>{message}</p>
            </div>
          )}

          <div className="job-form__actions">
            <Button type="submit">Sign Up</Button>
          </div>

          <div className="auth-footer">
            <Link to="/login-user" className="text-small">
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateUser;
