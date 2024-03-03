import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { useEffect, useState } from "react";
import axios from "axios";


export function Dashboard() {
    const [amount, setAmount] = useState();
    useEffect(() => {
        // axios.get("http://localhost:3000/api/v1/account/balance", {
        axios.get("https://reactapp-paytm-wallet.onrender.com/api/v1/account/balance", {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }) .then(res => setAmount(res.data.balance));
    }, []);

    return <div className="bg-white h-screen  flex justify-center ">
        <div className="flex justify-center m-10 w-9/12">
            <div className="w-screen">
                <Appbar />
                <div className="m-8">
                    <Balance value={amount} />
                    <Users />
                </div>
            </div>
        </div>
    </div>
}