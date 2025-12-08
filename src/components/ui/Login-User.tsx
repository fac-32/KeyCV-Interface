import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const LoginUser = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    return (
        <section>
            <form className="grid w-full max-w-sm items-center gap-3">
                <p>Log into existing account</p>

                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" onChange={(event) => setEmail(event.target.value)} placeholder="example@email.com" required />

                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" onChange={(event) => setPassword(event.target.value)} required />
            
                <Button type="submit" variant="outline">Log in</Button>
            </form>
            <p>{message}</p>
        </section>
    );
}

export default LoginUser;