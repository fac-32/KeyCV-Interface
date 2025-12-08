import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      if ( error?.code === "user_already_exists" ) {
        setMessage("This email is already in use");
      } else {
        setMessage("An error has occured while creating your account");
      }      
    } else if (data) {
      const { data: { user } } = await supabase.auth.getUser();

      // insert a user in the public.users relation with auth.users.id as FK PK
      const { error } = await supabase.from('users').insert({ user_id: user?.id });

      if ( error?.code === "23505" ) {
        setMessage(`This email is already in use`);
      } else {
        setMessage(`Acount created successfully ${/*, please verify your email*/ ""}`); // I remove email verification for quick testing
      }
    }
  };

  return (
    <section>
      <form
        className="grid w-full max-w-sm items-center gap-3"
        onSubmit={submitHandler}
      >
        Create an account
        <Label htmlFor="signup-email">Email</Label>
        <Input
          type="email"
          id="signup-email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="example@email.com"
          required
        />
        <Label htmlFor="signup-password">Password</Label>
        <Input
          type="password"
          id="signup-password"
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
