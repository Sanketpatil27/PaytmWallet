import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
    const navigate = useNavigate();
    const [firstName, setFristName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-96 text-center p-2 h-max px-4">
                <Heading label="Sign up" />
                <SubHeading label="Enter Your information to create an account" />

                <InputBox onChange={e => {
                    setFristName(e.target.value);
                }} label="First Name" placeholder="John"/>
                <InputBox onChange={e => {
                    setLastName(e.target.value);
                }} label="Last Name" placeholder="Doe"/>
                <InputBox onChange={e => {
                    setUsername(e.target.value);
                }} label="email" placeholder="sample@gmail.com"/>
                <InputBox onChange={e => {
                    setPassword(e.target.value);
                }} label="Password" placeholder="123456"/>

                <div className="pt-4">
                    <Button onClick={async () => {
                        // const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                        const response = await axios.post("https://reactapp-paytm-wallet.onrender.com/api/v1/user/signup", {
                                            username,
                                            firstName,
                                            lastName,
                                            password
                                        });

                        // storing the token for next calls in localStorage of browser
                        localStorage.setItem("token", response.data.token);
                        navigate("/dashboard");
                    }} label="sign up" />
                </div>

                <BottomWarning label="Already have an account?" buttonText="Sign in" to="/signin" />
            </div>
        </div>
    </div>
}

export { Signup };