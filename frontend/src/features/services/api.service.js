import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

 const api = axios.create({
    baseURL: API_URL,
    withCredentials:true
})

export async function register({username,email,password}){
    try {
        const res = await api.post("auth/register",{
            username,email,password
        })
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export async function login({email,password}){
    try {
        const res = await api.post("auth/login",{
            email,password
        })
        
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export async function logout(){
    try {
        const res  = await api.get("auth/logout")
        return res
    } catch (error) {
        console.log(error)
    }
}

export async function getMe(){
    try {
        const res = await api.get("auth/get-me")
        
        return res.data
    } catch (error) {
        console.log(error)
    }
}