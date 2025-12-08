import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setMessage("An error has occured logging you in");
        } else if (data) {
            setMessage(`Logged in as ${data.user.email}`);
        }
    };

    return (
        <section>
            <form className="grid w-full max-w-sm items-center gap-3" onSubmit={submitHandler}>
                <p>Log into existing account</p>

                <Label htmlFor="login-email">Email</Label>
                <Input type="email" id="login-email" onChange={(event) => setEmail(event.target.value)} placeholder="example@email.com" required />

                <Label htmlFor="login-password">Password</Label>
                <Input type="password" id="login-password" onChange={(event) => setPassword(event.target.value)} required />
            
                <Button type="submit" variant="outline">Log in</Button>
            </form>
            <p>{message}</p>
        </section>
    );
}

export default LoginUser;