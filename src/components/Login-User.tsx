import { useState } from "react";
import { signInUser } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, Route, Routes } from "react-router-dom";
import CreateUser from "./Create-User";

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
      setMessage(`Logged in as ${data.user.email}`);
    }
  };

  return (
    <section>
      <Routes>
        <Route path="/create-user" element={<CreateUser />} />
      </Routes>
      <form
        className="grid w-full max-w-sm items-center gap-3"
        onSubmit={submitHandler}
      >
        <p>Sign in an existing account</p>

        <Label htmlFor="login-email">Email</Label>
        <Input
          type="email"
          id="login-email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="example@email.com"
          required
        />

        <Label htmlFor="login-password">Password</Label>
        <Input
          type="password"
          id="login-password"
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <Button type="submit">Sign in</Button>
        <Link to="/create-user" className="text-small">
          Create a new account
        </Link>
      </form>
      <p>{message}</p>
    </section>
  );
};

export default LoginUser;
