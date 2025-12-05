import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY);


const CreateUser = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const submitHandler = async ( event ) => {
        event.preventDefault();
    };

    return (
        <div className="grid w-full max-w-sm items-center gap-3">Create an account
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@email.com" required/>

            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" 
                onChange={(event) => setPassword(event.target.value)}
                required />

            <Button type="submit" onClick={submitHandler} variant="outline">Create</Button>
        </div>
    );
};

export default CreateUser;