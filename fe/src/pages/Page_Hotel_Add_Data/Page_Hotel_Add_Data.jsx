import { useContext, useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import {
    Typography,
    Row,
    Col,
    Card,
    theme,
    Table,
    Avatar,
    Button,
    Skeleton,
    Pagination,
    Image,
    Checkbox,
    Input,
    Select,
    Space,
    DatePicker,
    InputNumber,
    Divider
} from "antd"
import {
    DownloadOutlined,
    DeleteOutlined,
    EditOutlined,
    CheckOutlined,
    PlusOutlined,
    CloseOutlined,
    LinkOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { MdVpnKey } from "react-icons/md";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import CardSelectedNode from "../../pages/Page_Ontology_Url/CardSelectedNode/CardSelectedNode";
import axios from "axios";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!


function getRandomDatesInSameMonth() {
    function normalDistribution(mean, stdDev) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stdDev + mean;
    }

    // Generate a random month following a normal distribution
    const meanMonth = 6; // Mean month (0-11 for January to December)
    const stdDevMonth = 2; // Standard deviation of month
    let month = Math.round(normalDistribution(meanMonth, stdDevMonth));
    month = Math.max(0, Math.min(11, month)); // Ensure month is within range 0-11
    // Generate a random year between 2020 and 2024
    // const year = Math.floor(Math.random() * 5) + 2020;
    const year = Math.random() < 0.5 ? 2023 : 2024;

    // Get the number of days in the selected month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Generate random day for the first date
    const firstDay = Math.floor(Math.random() * daysInMonth) + 1;

    // Generate random day for the second date within a range of 4 days from the first date
    const maxRange = Math.min(daysInMonth, firstDay + 4);
    const secondDay = Math.floor(Math.random() * (maxRange - firstDay + 1)) + firstDay;

    // Generate random day before the first date
    const zeroDay = Math.floor(Math.random() * (firstDay - 1)) + 1;

    // Format the dates
    const firstDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(firstDay).padStart(2, '0')}`;
    const secondDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(secondDay).padStart(2, '0')}`;
    const zeroDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(zeroDay).padStart(2, '0')}`;

    // return [firstDate, secondDate];
    return {
        bookingDate: zeroDate,
        checkInDate: firstDate,
        checkOutDate: secondDate
    }
}
function generateRandomNumbers() {
    // Generate random integers for guestCount and roomCount
    let guestCount = Math.floor(Math.random() * 20) + 1; // Range: 1 to 20
    let roomCount = Math.floor(Math.random() * 5) + 1; // Range: 1 to 5

    // Ensure guestCount is larger than or equal to roomCount
    while (guestCount < roomCount) {
        guestCount = Math.floor(Math.random() * 20) + 1;
    }

    // Ensure the result of the division guestCount/roomCount is <= 4
    while (guestCount / roomCount > 4) {
        guestCount = Math.floor(Math.random() * 20) + 1;
        roomCount = Math.floor(Math.random() * 5) + 1;
        while (guestCount < roomCount) {
            guestCount = Math.floor(Math.random() * 20) + 1;
        }
    }

    // Return the generated numbers
    return {
        guestCount: guestCount,
        roomCount: roomCount
    };
}

const Page_Hotel_Add_Data = () => {
    let [bookingQuery, setBookingQuery] = useState(``)
    let [bookingRoomQuery, setBookingRoomQuery] = useState(``)
    let [bookingResultQuery, setBookingResultQuery] = useState(``)
    async function handleAddBooking() {
        let customerRaw = await axios.get(`http://localhost:3001/api/hotel/customer`)
        console.log("customerRaw: ", customerRaw)
        let newBookingString = ``;
        let newBookingRoomString = ``;
        let newCreateBookingString = ``;
        let countFail = 0;
        for (let i = 0; i < customerRaw.data.rows.length; i++) {
            console.log(`Customer number ${i}`, customerRaw.data.rows[i])
            let randomBookingCount = Math.floor(Math.random() * 100) + 1;
            for (let j = 0; j < randomBookingCount; j++) {
                let checkBooking = false
                let checkCount = 0
                while (!checkBooking && checkCount < 20) {
                    let { bookingDate, checkInDate, checkOutDate } = getRandomDatesInSameMonth()
                    let { guestCount, roomCount } = generateRandomNumbers()
                    let branchRandom = Math.floor(Math.random() * 4) + 1
                    let branchID = `BR0${branchRandom}`
                    let roomTypeRaw = await axios.post(`http://localhost:3001/api/hotel/getvacant`,
                        {
                            branchID: branchID,
                            bookingDate: bookingDate,
                            checkInDate: checkInDate,
                            checkOutDate: checkOutDate,
                            guestCount: guestCount,
                            roomCount: roomCount
                        })
                    // console.log("roomTypeRaw: ", roomTypeRaw)
                    if (roomTypeRaw.data[0].rows.length > 0) {
                        try {
                            let customerID = customerRaw.data.rows[i].customerid
                            let roomtypeindex = Math.floor(Math.random() * roomTypeRaw.data[0].rows.length);
                            let roomList = roomTypeRaw.data[0].rows[roomtypeindex].vacant_rooms
                            // console.log("roomtypeindex: ", roomtypeindex)
                            // console.log("roomList: ", roomList)
                            let inputRoomList = roomList.slice(0, roomCount)
                            let bookingResultRaw = await axios.post(`http://localhost:3001/api/hotel/createbooking`, {
                                bookingdate: bookingDate,
                                guestcount: guestCount,
                                checkin: checkInDate,
                                checkout: checkOutDate,
                                customerid: customerID,
                                booking_rooms: inputRoomList
                            })
                            newCreateBookingString = newCreateBookingString.concat(`CALL create_booking('${guestCount}', '${bookingDate}', '${checkInDate}','${checkOutDate}', '${customerID}', '${JSON.stringify(inputRoomList)}');\n`)
                            checkBooking = true
                        }
                        catch (e) {
                            countFail = countFail + 1;
                            checkCount = checkCount + 1
                            console.log("FAIL NUMBER 2 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", e)
                        }
                    }
                    else {
                        countFail = countFail + 1;
                        checkCount = checkCount + 1
                        console.log("FAIL NUMBER 1 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
                    }
                }
            }
        }
        console.log("countFail: ", countFail)
        // setBookingQuery(customerRaw.data.rows.map((customer, index) => `${customer.FullName}\n`))
        // setBookingQuery(newBookingString)
        // setBookingRoomQuery(newBookingRoomString)
        setBookingResultQuery(newCreateBookingString)
    }
    return (
        <>

            <Button onClick={() => { handleAddBooking() }}>ADD</Button>
            <Row gutter={[16, 16]}>
                {/* <Col md={12}>
                    <Input.TextArea value={bookingQuery} autoSize />
                </Col>
                <Col md={12}>
                    <Input.TextArea value={bookingRoomQuery} autoSize />
                </Col> */}
                <Col md={24}>
                    <Input.TextArea value={bookingResultQuery} autoSize />
                </Col>
            </Row>
        </>
    )
}

export default Page_Hotel_Add_Data