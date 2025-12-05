import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
);

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

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setMessage("an error has occured while creating your account");
    } else if (data) {
      setMessage("acount created");
    }
  };

  return (
    <section>
      <form
        className="grid w-full max-w-sm items-center gap-3"
        onSubmit={submitHandler}
      >
        Create an account
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="example@email.com"
          required
        />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button type="submit" variant="outline">
          Create
        </Button>
      </form>
      <p>{message}</p>
    </section>
  );
};

export default CreateUser;
