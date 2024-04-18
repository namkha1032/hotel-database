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
    Divider,
    Modal,
    Carousel
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

import Container from '@mui/material/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import CardSelectedNode from "../../pages/Page_Ontology_Url/CardSelectedNode/CardSelectedNode";
import axios from "axios";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { apiCreateBooking, apiGetBranch } from "../../apis/hotelApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const CardNormal = (props) => {
    let item = props.item
    let roomNum = props.roomNum
    let guestNum = props.guestNum
    let dayRange = props.dayRange
    let chosenBranch = props.chosenBranch
    let handleFindRoom = props.handleFindRoom
    let [normalOpen, setNormalOpen] = useState(false)
    const antdTheme = theme.useToken()
    async function handleCreateBooking() {
        let userStorage = JSON.parse(localStorage.getItem("user"))
        let newBody = {
            guestcount: guestNum,
            checkin: dayRange[0].format('YYYY-MM-DD'),
            checkout: dayRange[1].format('YYYY-MM-DD'),
            customerid: userStorage.customerid,
            booking_rooms: item.vacant_rooms.slice(0, roomNum)
        }
        let response = await apiCreateBooking(newBody)
        console.log("new booking: ", newBody)
        setNormalOpen(false)
        handleFindRoom()
        toast.success('Booking successfully!', {
            theme: "colored"
        });
    }
    return (
        <>
            <Modal footer={null} style={{ top: 100 }} title={item.roomname} open={normalOpen} maskClosable={true} onCancel={() => { setNormalOpen(false) }}>
                <Carousel autoplay autoplaySpeed={3000}>
                    {item.images.map((img, index) => <Image key={index} src={img.image} width={500} height={300} />)}
                </Carousel>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" onClick={() => { handleCreateBooking() }}>Pay</Button>
                </div>
            </Modal>
            <Card style={{ borderColor: antdTheme.token.colorBorder }} styles={{ body: { padding: 16 } }}>
                <div style={{ display: 'flex', alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: 'flex', alignItems: "center", columnGap: 16 }}>
                        <Image src={item.images[0].image} style={{ width: 100, height: 100, borderRadius: 8 }} />
                        <div>
                            <Typography.Title level={4} style={{ marginTop: 0, marginBottom: 8 }}>
                                {item.roomname}
                            </Typography.Title>
                            <Typography.Text>
                                Room count: {item.room_count}
                            </Typography.Text>
                            <br />
                            <Typography.Text>
                                Total price: {item.total_price}
                            </Typography.Text>
                            <br />
                            <Typography.Text>
                                Vacant rooms:{` `}
                            </Typography.Text>
                            {item?.vacant_rooms?.map((itemRoom, index) => {
                                return <Typography.Text key={index}>
                                    {itemRoom.roomnumber}{` - `}
                                </Typography.Text>
                            }
                            )}
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", rowGap: 8 }}>
                        <Typography.Title level={3} style={{ margin: 0 }}>
                            {item.total_price} $
                        </Typography.Title>
                        <Typography.Text level={3} style={{ margin: 0 }}>
                            {roomNum} rooms × {item.day_count} days
                        </Typography.Text>
                        <Button type="primary" onClick={() => { setNormalOpen(true) }}>View details</Button>
                    </div>
                </div>
            </Card>
        </>
    )
}

const Page_Hotel_Customer = () => {
    let [guestNum, setGuestNum] = useState(20)
    let [roomNum, setRoomNum] = useState(5)
    let [chosenBranch, setChosenBranch] = useState("BR01")
    let [allBranch, setAllBranch] = useState([])
    let [dayRange, setDayRange] = useState([null, null])
    let [findRoomResult, setFindRoomResult] = useState([])
    const antdTheme = theme.useToken()
    console.log("findRoomResult", findRoomResult)
    async function handleFindRoom() {
        let newRequirements = {
            guestCount: guestNum,
            roomCount: roomNum,
            branchID: chosenBranch,
            checkInDate: dayRange[0].format('YYYY-MM-DD'),
            checkOutDate: dayRange[1].format('YYYY-MM-DD')
        }
        console.log("newRequirements", newRequirements)
        let roomTypeRaw = await axios.post(`http://localhost:3001/api/hotel/getvacant`, newRequirements)
        console.log("roomTypeRaw", roomTypeRaw.data)
        setFindRoomResult(roomTypeRaw.data)
    }
    useEffect(() => {
        async function fetchBranch() {
            let responseBranch = await apiGetBranch()
            console.log("responseBranch", responseBranch)
            setAllBranch(responseBranch.rows)
        }
        fetchBranch()
    }, [])
    return (
        <>
            <ToastContainer />
            <Container>
                <Carousel autoplay autoplaySpeed={3000} style={{ width: "100%" }}>
                    {chosenBranch == "BR01" ?
                        allBranch[0]?.jsonb_agg?.map((img, index) => <Image key={index} src={img.image} width={"100%"} height={300} />)
                        : allBranch[1]?.jsonb_agg?.map((img, index) => <Image key={index} src={img.image} width={"100%"} height={300} />)
                    }
                </Carousel>
                <Typography.Title level={1}>Guest page - finding vacant rooms</Typography.Title>
                <Space align="end" size="large">
                    <div style={{ display: "flex", flexDirection: "column", rowGap: 8 }}>
                        <Typography.Text>Branch:</Typography.Text>
                        <Select
                            defaultValue="BR01"
                            style={{
                                width: 120,
                            }}
                            value={chosenBranch}
                            onChange={(value) => {
                                setChosenBranch(value)
                            }}
                            options={[
                                {
                                    value: 'BR01',
                                    label: 'Phan Thiet',
                                },
                                {
                                    value: 'BR02',
                                    label: 'Nha Trang',
                                }
                            ]}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", rowGap: 8 }}>
                        <Typography.Text>Date:</Typography.Text>
                        <DatePicker.RangePicker value={dayRange} onChange={(value) => {
                            // console.log("day: ", value)
                            // console.log("dayFormat: ", value[0].format('YYYY-MM-DD'))
                            // console.log("day0: ", new Date(value[0]).toJSON())
                            // console.log("day1: ", new Date(value[1]).toJSON())
                            setDayRange(value)
                        }}
                        // cellRender={(current) => current.date()} 
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", rowGap: 8 }}>
                        <Typography.Text>No. guests:</Typography.Text>
                        <InputNumber placeholder="guest" onChange={(value) => setGuestNum(value)} value={guestNum} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", rowGap: 8 }}>
                        <Typography.Text>No. rooms:</Typography.Text>
                        <InputNumber placeholder="room" onChange={(value) => setRoomNum(value)} value={roomNum} />
                    </div>
                    <Button type="primary" onClick={() => { handleFindRoom() }}>Find</Button>
                </Space>

                {findRoomResult.length > 0 ? <div style={{ display: "flex", flexDirection: "column", rowGap: 16 }}>
                    <Typography.Title style={{ marginTop: 16, marginBottom: 0 }} level={2}>Results:</Typography.Title>
                    {findRoomResult[0]?.rows?.map((item, index) =>
                        <div key={index}>
                            <CardNormal item={item} roomNum={roomNum} guestNum={guestNum}
                                dayRange={dayRange} chosenBranch={chosenBranch} handleFindRoom={handleFindRoom} />
                        </div>
                    )}
                </div> : null}
            </Container>
        </>
    )
}
export default Page_Hotel_Customer