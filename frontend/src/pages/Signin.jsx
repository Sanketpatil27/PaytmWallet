import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading"
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return <div className="h-screen flex justify-center bg-slate-300">
        <div className="flex flex-col justify-center">
            <div className="h-max w-80 p-2 px-4 rounded-lg bg-white text-center">
                <Heading label={"Sign in"}/>
                <SubHeading label={"Enter your credentials to access your account"}/>

                <InputBox onChange={(e) => {
                    setUsername(e.target.value);
                }} label={"Email"} placeholder={"example@gmail.com"}/>

                <InputBox onChange={(e) => {
                    setPassword(e.target.value);
                }} label={"Password"} placeholder={"123455"}/>

                <div className="pt-4">
                    <Button onClick={async () => {
                        // const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
                        const response = await axios.post("https://reactapp-paytm-wallet.onrender.com/api/v1/user/signin", {
                                            username,
                                            password
                                        });

                        // storing the token for next calls in localStorage of browser
                        localStorage.setItem("token", response.data.token);
                        navigate("/dashboard");
                    }} label={"Sign in"}/>
                </div>

                <BottomWarning label={"Don't have an account?"} buttonText={"Sing up"} to={"/signup"}/>
            </div>
        </div>
    </div>
}