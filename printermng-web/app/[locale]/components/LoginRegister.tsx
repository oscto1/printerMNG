"use client";

import { SubmitEvent, useState, useEffect } from "react";
import { login, register } from "../lib/api";
import { Credentials } from "../types/Auth/Login";
import { usernameRegex, hasUppercase, hasLowercase, hasNumber, hasSpecial } from "../lib/utils";


type Mode = "login" | "register";

export default function LoginRegister() {
    const [mode, setMode] = useState<Mode>("login");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState<string[]>([]);
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isRegister = mode === "register";


    const switchMode = (newMode: Mode) => {
        setMode(newMode);
        setError([]);
        setSuccess("");
        setPassword("");
        setConfirmPassword("");
    };

    const handleUpdateErrorAtIndex = (targetIndex: number, newValue: string) => {
        setError(prevErrors => 
            prevErrors.map((item, index) => 
            index === targetIndex ? newValue : item
            )
        );
     };

    const verifyRegisterCreds = ( username: string, password: string, confirmPassword: string ) : boolean => {

        if(!isRegister) return true;

        const newErrors = ["", "", "", "", "", "", ""];

        if (!usernameRegex.test(username)) {
            newErrors[0] = "Username must be 3–18 characters and can only contain letters, numbers, and underscores.";
        }

        if ((password !== "" && password.length < 6) || password.length > 128) {
            newErrors[1] = "Password must have between 6 - 128 characters.";
        }

        if (password !== "" && !hasUppercase.test(password)) {
            newErrors[2] = "Password must have one uppercase letter";
        }

        if (password !== "" && !hasLowercase.test(password)) {
            newErrors[3] = "Password must have one lowercase letter";
        }

        if (password !== "" && !hasNumber.test(password)) {
            newErrors[4] = "Password must have one number";
        }

        if (password !== "" && !hasSpecial.test(password)) {
            newErrors[5] = "Password must have one special character";
        }

        if ((password !== "" || confirmPassword !== "") && password !== confirmPassword) {
            newErrors[6] = "Passwords do not match.";
        }

        setError(newErrors);

        const allRequirementsFine = newErrors.every(error => error === "");

        if(allRequirementsFine){
            setError([]);
        }
        
        return allRequirementsFine;
    }

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        // setError("");
        setSuccess("");

        if (isRegister && !verifyRegisterCreds(username, password, confirmPassword)) return;

        setIsLoading(true);

        try {
            var response;
            const credentials : Credentials = { username, password };

            if (mode === 'login') { 
                response = await login(credentials);
                console.log(response);
                // TODO: Store token in cookies
            } else { 
                response = await register(credentials);
                setSuccess("Account created successfully. You can now sign in.");
                setMode("login");
                setPassword("");
                setConfirmPassword("");
            };

        }catch(err){
            if (err instanceof Error){
                if(mode === 'login'){
                    setError(["Failed to log in! Please verify your credentials and try again."]);
                }
                else{
                    const firstParse = JSON.parse(err.message); 
                    console.log(firstParse);
                    setError(["Unable to create account.", err.message]);
                }
            }    
        }finally{
            setIsLoading(false);
        };
    };

    useEffect(() => {
        verifyRegisterCreds(username, password, confirmPassword);
    }, [username, password, confirmPassword]);

    return (
        <div className="w-full max-w-md">

            {/* Logo / title */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-700">
                    PrinterMNG
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Printer rental and client management
                </p>
            </div>

            {/* Auth card */}
            <div className="rounded-3xl bg-gray-200 p-6 ">

                {/* Toggle */}
                <div className="mb-6 flex rounded-full bg-gray-300 p-1">
                    <button
                        type="button"
                        onClick={() => switchMode("login")}
                        className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
                            !isRegister
                                ? "bg-white text-gray-700 shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        Sign in
                    </button>

                    <button
                        type="button"
                        onClick={() => switchMode("register")}
                        className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
                            isRegister
                                ? "bg-white text-gray-700 shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        Create account
                    </button>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-700">
                        {isRegister
                            ? "Create your account"
                            : "Welcome back"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {isRegister
                            ? "Create an account to manage your business data."
                            : "Sign in to manage your printers and clients."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Username */}
                    <div>
                        <label
                            htmlFor="username"
                            className="mb-1.5 block text-sm font-semibold text-gray-700"
                        >
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-300"
                            placeholder="Enter your username"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1.5 block text-sm font-semibold text-gray-700"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}  

                            required
                            autoComplete={
                                isRegister
                                    ? "new-password"
                                    : "current-password"
                            }
                            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-300"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Confirm password */}
                    {isRegister && (
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-1.5 block text-sm font-semibold text-gray-700"
                            >
                                Confirm password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}  
                                required
                                autoComplete="new-password"
                                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-300"
                                placeholder="Confirm your password"
                            />
                        </div>
                    )}

                    {/* Error */}
                    {(error.length > 0) && (
                        <div className="rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-700">
                            {(error.length > 1) ? 
                                <ul className="list-disc pl-5">
                                    {error.map((e, index) => ((e !== "") ? <li key={index}>{e}</li> : "" ))}
                                </ul>
                                : error[0] }
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="rounded-2xl bg-green-100 px-4 py-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading
                            ? "Please wait..."
                            : isRegister
                                ? "Create account"
                                : "Sign in"}
                    </button>
                </form>

                {/* Bottom switch */}
                <p className="mt-6 text-center text-sm text-gray-500">
                    {isRegister
                        ? "Already have an account?"
                        : "Don't have an account?"}{" "}

                    <button
                        type="button"
                        onClick={() =>
                            switchMode(
                                isRegister ? "login" : "register"
                            )
                        }
                        className="font-semibold text-gray-700 hover:underline"
                    >
                        {isRegister ? "Sign in" : "Create one"}
                    </button>
                </p>
            </div>
        </div>

    );
}