import { useState, useEffect } from "react";
import { Button } from "./Button";
import axios from "axios";
import { Link } from "react-router-dom";


export function Users() {
    const [filter, setFilter] = useState("");
    const [users, setUsers] = useState([]);

    // should add debouncing on searching 
    useEffect(() => {
        // axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`)
        axios.get(`https://reactapp-paytm-wallet.onrender.com/api/v1/user/bulk?filter=${filter}`)
        .then(res => {
            setUsers(res.data.user);
        })
    }, [filter]);

    return <div>
        <div className="font-bold mt-6 text-lg">
            Users 
        </div>
        <div className="my-2">
            <input type="text" onChange={(e) => {
                setFilter(e.target.value);
            }} placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200" />
        </div>
        <div>
            {users.map(user => <User user={user} />)}
        </div>
    </div>
}

function User({user}) {
    return <div className="flex justify-between mt-4">
        <div className="flex" >
            <div className="mt-1 mr-2 h-12 w-12 rounded-full bg-slate-200 flex justify-center">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-full">
                { user.firstName + "   "} { user.lastName }
            </div>
        </div>
        <div className="flex flex-col justify-center h-full">
            <Link to={`/send?id=${user._id}&name=${user.firstName}&lastName=${user.lastName}`} >
                <Button onClick={() => {}} label="Send Money" />
            </Link>
        </div>
    </div>
}