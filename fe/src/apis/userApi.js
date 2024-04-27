import axios from "axios";
import delay from "../functions/delay";
import endpoint from "./_domain";
import { originHeader } from "./_domain";
export async function userLogin(credential) {
    // await delay(2000)
    let response = await axios.post(`${endpoint}/api/hotel/login`, credential, {
        headers: { ...originHeader }
    })
    return response.data.rows[0]
}
export async function userSignup(credential) {
    // await delay(2000)
    let response = await axios.post(`${endpoint}/api/hotel/signup`, credential, {
        headers: { ...originHeader }
    })
    return response.data.rows[0]
}

export async function getMe(token) {
    // await delay(2000)
    let response = await axios.get(`${endpoint}/api/users/get/me`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            ...originHeader
        }
    })
    return response.data.data
}

export async function getUserList(token) {
    // await delay(2000)
    let response = await axios.get(`/data/userlist.json`)
    // let response = await axios.get(`${endpoint}/api/users/get/me`, {
    //     headers: {
    //         "Authorization": `Bearer ${token}`,
    //         ...originHeader
    //     }
    // })
    return response.data.data
}