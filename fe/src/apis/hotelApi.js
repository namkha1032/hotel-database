import axios from "axios";
import delay from "../functions/delay";
import endpoint from "./_domain";
import { originHeader } from "./_domain";

export async function apiCreateBooking(body) {
    let response = await axios.post(`${endpoint}/api/hotel/createbooking`, body)
    return response.data
}

export async function apiGetBooking(body) {
    let response = await axios.post(`${endpoint}/api/hotel/getbookings`, body)
    return response.data
}

export async function apiCheckIn(body) {
    let response = await axios.post(`${endpoint}/api/hotel/checkin`, body)
    return response.data
}

export async function apiCheckOut(body) {
    let response = await axios.post(`${endpoint}/api/hotel/checkout`, body)
    return response.data
}

export async function apiGetFood() {
    let response = await axios.get(`${endpoint}/api/hotel/food`)
    return response.data
}

export async function apiGetBranch() {
    let response = await axios.get(`${endpoint}/api/hotel/branch`)
    return response.data
}