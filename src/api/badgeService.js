import apiPrivate from "./axiosPrivate";
import apiPublic from "./axiosPublic";

export const getAllBadges= async()=>{
    try{
        const data = await apiPublic.get('user/badges');
        return data.data;
    }catch(err){
        console.error("Faild to fetch the data.")
        throw err;
    }
}
