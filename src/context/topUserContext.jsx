import { createContext, useContext, useEffect, useState } from "react";
import { getTopUsers } from "../api/userServiece";

const TopUserContext = createContext();

export const TopUserProvider =({children})=>{
    const [topUsers, setTopUsers] = useState([]);

    useEffect(() => {
        async function fetchTopUsers() {
            try {
                const data = await getTopUsers();
                setTopUsers(data);
            } catch (error) {
                console.error("Failed to fetch top users:", error);
            }
        }
        fetchTopUsers();
    }, []);

    return (
        <TopUserContext.Provider value={{topUsers}}>
            {children}
        </TopUserContext.Provider>
    );
}

export const useTopUsers = () => {
    return useContext(TopUserContext);
}
 