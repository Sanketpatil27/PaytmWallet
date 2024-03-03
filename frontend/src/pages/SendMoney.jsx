import { useState } from "react";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export function SendMoney() {

    const [amount, setAmount] = useState(0);
    const [searchParams] = useSearchParams();       // this is used to get friends id
    
    const id = searchParams.get('id');
    const friendFirstName = searchParams.get('name');
    const friendLastName = searchParams.get('lastName');


    return <div className="flex justify-center bg-gray-100 h-screen">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg shadow-lg text-center p-4 px-6 bg-white w-96 h-max justify-center">
                <Heading label="Send Money" />

                <div className="flex h-12 mt-20">
                    <div className="mt-1 mr-2 h-12 w-12 rounded-full bg-green-500 flex justify-center">
                        <div className="h-full flex flex-col justify-center text-xl text-white">
                            {friendFirstName[0].toUpperCase()}
                        </div>
                    </div>
                    <div className="font-bold flex text-xl items-center  h-full">
                        {friendFirstName + " " + friendLastName}
                    </div>
                </div>  

                <div className="pt-4">
                    <InputBox onChange={(e) => {
                        setAmount(e.target.value);
                    }} label="Amount (in Rs)" placeholder="Enter Amount to send"/>
                </div>
                
                <div className="pt-4">
                    <button onClick={() => {
                        // axios.post("http://localhost:3000/api/v1/account/transfer", {
                        axios.post("https://reactapp-paytm-wallet.onrender.com/api/v1/account/transfer", {
                            to: id, 
                            amount: amount
                        }, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                              },
                         })
                        
                    }} className="w-full text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                        Initialize Transfer
                    </button>
                </div>
            </div>
        </div>
    </div>
}
