import { useEffect, useState } from "react";
import type { User } from "../types/DataTypes.ts";
import type { LandingProps } from "../types/PropTypes.ts";

export default function Landing({callbackToggle, callbackUser}: LandingProps) {

    const [emailInput, setEmailInput] = useState<string>("");
    const [passInput, setPassInput] = useState<string>("");

    const [extData, setExtData] = useState<User[]>([]);

    // CRUD Get
    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const response = await fetch("http://localhost:3002/users");
                if (!response.ok) throw new Error("Response failed.");

                const data = await response.json();
                setExtData(data);
            } catch (error: any) {
                throw new Error(error);
            }
        })()
    }, []);


    // CRUD Delete
    // async function deleteUser(): Promise<void> {
    //     console.log(extData[2]);
    //     const currentUser: User = extData[2];
    //     try {
    //         const response = await fetch(`http://localhost:3000/users/${currentUser.id}`, {
    //             method: "DELETE",
    //             headers: {"Content-Type": "application/json"}
    //         });
    //         if (!response.ok) throw new Error("CRUD: Delete request failed.");
    //     } catch (error: any) {
    //         throw new Error(error);
    //     }
    // }

    // CRUD Post
    async function createUser(newUser: User): Promise<void> {
        try {
            const response = await fetch("http://localhost:3002/users", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newUser)
            });
            if (!response.ok) throw new Error("Post request failed.");
        } catch (error: any) {
            throw new Error(error);
        }
    }

    // Login
    function handleLogin() {
        // if email and password match
        const user: User | undefined = extData.find((user) => user.email === emailInput && user.password === passInput)
        if (user){
            // render dashboard, unmount landing.
            callbackToggle(true)
            callbackUser(user)
            // use callback passed from App prop.
        } else {
            alert("Incorrect email and/or password.");
        }
    }

    // Signup
    function handleSignUp() {
        if (extData.find((user) => user.email === emailInput)) {
            alert("You already have an account. Please login.");
        } else {
            // POST new user
            createUser({
                email: emailInput,
                password: passInput,
                eventList: []
            })
        }
    }


    return (
        <div className="h-screen flex flex-col justify-center items-center bg-slate-800 text-slate-50">

            <h1 className="w-3xl text-center text-7xl mb-10">
                Caland Arrr
            </h1>

            <div className="w-3xl border p-5 bg-slate-700">
                
                <div>
                    <label htmlFor="email-input" className="w-1/2 text-right">Email: </label>
                    <input type="email" id="email-input" className="w-1/2 border rounded" 
                        value={emailInput}
                        onChange={(change) => setEmailInput(change.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="password-input" className="w-1/2 text-right" >Password: </label>
                    <input type="password" id="password-input" className="w-1/2 border rounded" 
                        value={passInput}
                        onChange={(change) => setPassInput(change.target.value)}
                    />
                </div>

                <div className="flex flex-row">
                    <button className="border rounded hover:bg-slate-600 active:bg-slate-500"
                        onClick={() => handleSignUp()}>
                        Sign Up
                    </button>

                    <button className="border rounded hover:bg-slate-600 active:bg-slate-500"
                        onClick={() => handleLogin()}>
                        Login
                    </button>
                </div>
                
            </div>
        </div>
    )
}