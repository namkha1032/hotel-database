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
    Collapse,
    Tabs,
    Tag,
    Modal
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
import ModeThemeContext from "../../context/ModeThemeContext";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { Line } from '@ant-design/charts';
import { Liquid, Column, DualAxes } from '@ant-design/plots';
import { apiGetBooking } from "../../apis/hotelApi";
import { IoFastFoodOutline } from "react-icons/io5";
import { GiCoffeeCup } from "react-icons/gi";
import { FaCoffee } from "react-icons/fa";
import { apiCheckIn, apiGetFood, apiCheckOut } from "../../apis/hotelApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ViewBookingModal = (props) => {
    let item = props.item
    let activeKey = props.activeKey
    let fetchBooking = props.fetchBooking
    let foodType = props.foodType
    let [modalOpen, setModalOpen] = useState(false)
    let [loading, setLoading] = useState(false)
    let [rentalCost, setRentalCost] = useState(item.rentalcost)
    let [foodCost, setFoodCost] = useState(item.foodcost ?? 0)
    let [totalCost, setTotalCost] = useState(item.rentalcost + item.foodcost)
    let [roomList, setRoomList] = useState(item.booking_rooms.map((bkroom, idx) => {
        return {
            ...bkroom,
            inputfoodconsumed: foodType.map((food, idx2) => {
                return {
                    ...food,
                    amount: 0
                }
            })
        }
    }))
    let spanKey = 8
    let spanColon = 1
    let spanValue = 14
    async function handleCheckIn() {
        setLoading(true)
        let response = await apiCheckIn({ bookingid: item.bookingid })
        await fetchBooking()
        setLoading(false)
        setModalOpen(false)
        toast.success('Check in successfully!', {
            theme: "colored"
        });
    }
    async function handleCheckOut() {
        setLoading(true)
        let newBody = {
            bookingid: item.bookingid,
            roomlist: roomList
        }
        let response = await apiCheckOut(newBody)
        await fetchBooking()
        setLoading(false)
        setModalOpen(false)
        toast.success('Check out successfully!', {
            theme: "colored"
        });
    }
    function changeFoodAmount(roomIndex, foodIndex, value) {
        setRoomList(roomList.map((room, idx) => {
            if (idx != roomIndex) {
                return room
            }
            else {
                return {
                    ...room,
                    inputfoodconsumed: room.inputfoodconsumed.map((food, idx3) => {
                        if (idx3 != foodIndex) {
                            return food
                        }
                        else {
                            return {
                                ...food,
                                amount: value
                            }
                        }
                    })
                }
            }
        }))
    }
    return (
        <>
            <Modal footer={null} style={{ top: 100 }} title={"Booking information"} open={modalOpen} maskClosable={true} onCancel={() => { setModalOpen(false) }}>
                <Row style={{ width: "100%" }} gutter={[0, 8]} justify={"space-between"}>
                    <Col md={spanKey} style={{ display: "flex", alignItems: "center" }}>
                        <Typography.Text>Customer</Typography.Text>
                    </Col>
                    <Col md={spanValue} style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                        <Avatar src="/file/avatar.png" />
                        <Typography.Title level={5} style={{ margin: 0 }}>{item.fullname}</Typography.Title>
                    </Col>
                    <Divider />
                    <Col md={spanKey} style={{ display: "flex", alignItems: "center" }}>
                        <Typography.Text>Booking ID</Typography.Text>
                    </Col>
                    <Col md={spanValue}>
                        <Input readOnly value={item.bookingid} />
                    </Col>
                    <Col md={spanKey} style={{ display: "flex", alignItems: "center" }}>
                        <Typography.Text>Check-in date</Typography.Text>
                    </Col>
                    <Col md={spanValue}>
                        <Input readOnly value={new Date(item.checkin).toLocaleDateString()} />
                    </Col>
                    <Col md={spanKey} style={{ display: "flex", alignItems: "center" }}>
                        <Typography.Text>Check-out date</Typography.Text>
                    </Col>
                    <Col md={spanValue}>
                        <Input readOnly value={new Date(item.checkout).toLocaleDateString()} />
                    </Col>
                    {activeKey == 0 ?
                        null :
                        <>
                            <Col md={spanKey} style={{ display: "flex", alignItems: "center" }}>
                                <Typography.Text>Actual check-in date</Typography.Text>
                            </Col>
                            <Col md={spanValue}>
                                <Input readOnly value={new Date(item.actualcheckin).toLocaleDateString()} />
                            </Col>
                        </>}
                    {activeKey != 2 ?
                        null :
                        <>
                            <Col md={spanKey} style={{ display: "flex", alignItems: "center" }}>
                                <Typography.Text>Actual check-out date</Typography.Text>
                            </Col>
                            <Col md={spanValue}>
                                <Input readOnly value={new Date(item.actualcheckout).toLocaleDateString()} />
                            </Col>
                        </>}
                    <Divider />
                    <Col md={spanKey} style={{ display: "flex", alignItems: "flex-start" }}>
                        <div style={{ height: 32 }}>
                            <Typography.Text>Rooms</Typography.Text>
                        </div>
                    </Col>
                    <Col md={spanValue} style={{ display: "flex", flexDirection: "column", rowGap: 8 }}>
                        {roomList.map((bkroom, idx) => {
                            let count = 0
                            let countInput = 0
                            bkroom.foodconsumed?.map((fo, id) => {
                                count = count += fo.amount
                            })
                            bkroom.inputfoodconsumed?.map((fo, id) => {
                                countInput = countInput += fo.amount
                            })
                            return <div key={idx}>
                                <Collapse
                                    size={"small"}
                                    // bordered={false}
                                    // defaultActiveKey={['1']}
                                    // style={{
                                    //     background: token.colorBgContainer,
                                    // }}
                                    items={[{
                                        key: '1',
                                        label: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography.Text>{bkroom.branchid}.{bkroom.roomnumber}</Typography.Text>
                                            {activeKey == 2 ?
                                                <div style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                                                    <FaCoffee />
                                                    <Typography.Text>{count}</Typography.Text>
                                                </div> : null}
                                            {activeKey == 1 ?
                                                <div style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                                                    <FaCoffee />
                                                    <Typography.Text>{countInput}</Typography.Text>
                                                </div> : null}
                                        </div>,
                                        children: activeKey == 1 ?
                                            <>
                                                {bkroom?.inputfoodconsumed?.map((food, idx3) => <Row key={idx3} style={{ marginTop: 8, marginBottom: 8 }}>
                                                    <Col md={8} style={{ display: "flex", alignItems: "center" }}>
                                                        <Typography.Text>{food.foodname}</Typography.Text>
                                                    </Col>
                                                    <Col md={14} style={{ display: "flex", alignItems: "center" }}>
                                                        <InputNumber onStep={(value, info) => {
                                                            console.log("value", value)
                                                            console.log("info", info)
                                                            setFoodCost(info.type == "up" ? foodCost + food.foodprice : foodCost - food.foodprice)
                                                            setTotalCost(info.type == "up" ? totalCost + food.foodprice : totalCost - food.foodprice)
                                                        }} min={0} value={food.amount} onChange={(value) => changeFoodAmount(idx, idx3, value)} />
                                                    </Col>
                                                </Row>)}
                                            </>
                                            : bkroom.foodconsumed?.map((food, idx2) => <div key={idx2}>
                                                <Typography.Text>{food.foodname} : {food.amount}</Typography.Text>
                                            </div>)
                                    }]}
                                />
                            </div>
                        })}

                    </Col>
                </Row>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", width: "100%", marginTop: 16 }}>
                    <Row gutter={[8, 8]} style={{ width: "50%" }} justify={"end"}>
                        <Col md={14} style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Typography.Text>Rental cost</Typography.Text>
                        </Col>
                        <Col md={1} style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Typography.Text>:</Typography.Text>
                        </Col>
                        <Col md={7} style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Typography.Text>{rentalCost} $</Typography.Text>
                        </Col>
                        <Col md={14} style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Typography.Text>Food cost</Typography.Text>
                        </Col>
                        <Col md={1} style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Typography.Text>:</Typography.Text>
                        </Col>
                        <Col md={7} style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Typography.Text>{foodCost} $</Typography.Text>
                        </Col>
                        <Col md={14} style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Typography.Text>Total cost</Typography.Text>
                        </Col>
                        <Col md={1} style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Typography.Text>:</Typography.Text>
                        </Col>
                        <Col md={7} style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Typography.Text>{totalCost} $</Typography.Text>
                        </Col>
                    </Row>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", width: "100%", marginTop: 16 }}>
                    {activeKey == 0 ?
                        <Button loading={loading} type="primary" onClick={() => { handleCheckIn() }}>Check in</Button>
                        : null}
                    {activeKey == 1 ?
                        <Button loading={loading} type="primary" onClick={() => { handleCheckOut() }}>Check out</Button>
                        : null}
                </div>

            </Modal>
            <Tag style={{ cursor: "pointer" }} color={activeKey == 0 ? "volcano" : activeKey == 1 ? "blue" : "green"} onClick={() => { setModalOpen(true) }}>
                {activeKey == 0 ? "Upcoming" : activeKey == 1 ? "Occupying" : "Checked out"}
            </Tag>
        </>
    )
}

const TableBooking = (props) => {
    let activeKey = props.activeKey
    let bookingList = props.bookingList
    let setBookings = props.setBookings
    let fetchBooking = props.fetchBooking
    let foodType = props.foodType
    let bookingColumn = [
        {
            title: "Booking ID",
            render: (obj) => obj.bookingid,
            sorter: (a, b) => a.bookingid.localeCompare(b.bookingid)
        },
        {
            title: "Customer",
            render: (obj) => <div style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                <Avatar src={"/file/avatar.png"} />
                <Typography.Text>{obj.fullname}</Typography.Text>
            </div>,
            sorter: (a, b) => a.bookingid.localeCompare(b.bookingid)
        },
        {
            title: "Booking Date",
            render: (obj) => new Date(obj.bookingdate).toLocaleDateString(),
            sorter: (a, b) => new Date(a.bookingdate).toLocaleDateString().localeCompare(new Date(b.bookingdate).toLocaleDateString())
        },
        {
            title: "Check in",
            render: (obj) => new Date(obj.checkin).toLocaleDateString(),
            sorter: (a, b) => new Date(a.checkin).toLocaleDateString().localeCompare(new Date(b.checkin).toLocaleDateString())
        },
        {
            title: "Check out",
            render: (obj) => new Date(obj.checkout).toLocaleDateString(),
            sorter: (a, b) => new Date(a.checkout).toLocaleDateString().localeCompare(new Date(b.checkout).toLocaleDateString())
        },
        {
            title: "Total cost",
            render: (obj) => obj.totalcost,
            sorter: (a, b) => a.totalcost - b.totalcost
        },
        {
            title: "Status",
            render: (obj) => <>
                <ViewBookingModal foodType={foodType} item={obj} activeKey={activeKey} fetchBooking={fetchBooking} />
            </>
        },
    ]
    return (
        <>
            <Table
                columns={bookingColumn}
                rowKey={(record) => record?.bookingid}
                dataSource={bookingList ?? []}
                // pagination={false}
                style={{ width: "100%" }}
            />
        </>
    )
}

const Page_Hotel_Test = () => {
    let [statisticsBranch, setStatisticsBranch] = useState('BR01')
    let [statisticsYear, setStatisticsYear] = useState('2024')
    let [statisticsMonth, setStatisticsMonth] = useState('06')
    let [branchStatistics, setBranchStatistics] = useState([])
    let [ratePlot, setRatePlot] = useState([])
    let [averageRate, setAverageRate] = useState(0)
    let [roomCalendar, setRoomCalendar] = useState([])
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    let [bookings, setBookings] = useState(null)
    let [foodType, setFoodType] = useState([])
    console.log("bookings: ", bookings)
    useEffect(() => {
        fetchBooking()
    }, [])
    async function fetchBooking() {
        // let first = await apiGetBooking({ checkinnull: "NULL", checkoutnull: "NULL" })
        // let second = await apiGetBooking({ checkinnull: "NOT NULL", checkoutnull: "NULL" })
        // let third = await apiGetBooking({ checkinnull: "NOT NULL", checkoutnull: "NOT NULL" })
        let result = await axios.post(`http://localhost:3001/api/hotel/getbookings`)
        let foodResponse = await apiGetFood()
        console.log("booking: ", { first: result.data.rows, second: result.data.rows, third: result.data.rows })
        setBookings({ first: result.data.rows, second: result.data.rows, third: result.data.rows })
        setFoodType(foodResponse.rows)
    }
    async function handleBranchStatistics(inputBranch, inputYear) {
        // console.log("inputBranch", inputBranch)
        // console.log("inputYear", inputYear)
        let statisticsResponse = await axios.post(`http://localhost:3001/api/hotel/statistics`, { branchID: inputBranch, year: inputYear })
        let newAverage = 0
        let newRatePlot = []
        let copyStatistics = statisticsResponse.data.rows.map((item, index) => {
            newAverage = newAverage + item.occupancy_rate
            newRatePlot.push({
                month_text: item.month_text,
                type: "occupancy_rate",
                value: item.occupancy_rate
            })
            newRatePlot.push({
                month_text: item.month_text,
                type: "vacancy_rate",
                value: 1 - item.occupancy_rate
            })
            return {
                ...item,
                total_revenue: parseInt(item.total_revenue)
            }
        })
        setAverageRate(parseFloat((newAverage / 12).toFixed(4)))
        setBranchStatistics(copyStatistics)
        setRatePlot(newRatePlot)
    }
    async function handleRoomCalendar(inputBranch, inputYear, inputMonth) {
        let roomCalendarRaw = await axios.post(`http://localhost:3001/api/hotel/getroomcalendar`, {
            branchid: inputBranch,
            inputyear: inputYear,
            inputmonth: inputMonth
        })
        setRoomCalendar(roomCalendarRaw.data.rows)
    }
    let branchStatisticsColumn = [
        {
            title: "Month",
            render: (obj) => obj.month_num
        },
        // {
        //     title: "Count room",
        //     render: (obj) => obj.count_room
        // },
        // {
        //     title: "Count slot",
        //     render: (obj) => obj.count_slot
        // },
        // {
        //     title: "Total slot",
        //     render: (obj) => obj.total_slot
        // },
        // {
        //     title: "Rental revenue",
        //     render: (obj) => obj.rental_revenue
        // },
        // {
        //     title: "Food revenue",
        //     render: (obj) => obj.food_revenue
        // },
        {
            title: "Occupancy rate",
            render: (obj) => obj.occupancy_rate
        },
        {
            title: "Total revenue",
            render: (obj) => obj.total_revenue
        }
    ]
    return (
        <>
            <ToastContainer />
            <Tabs
                defaultActiveKey={0}
                type="card"
                // size={size}
                items={[
                    {
                        label: `Upcoming`,
                        key: 0,
                        children: <TableBooking foodType={foodType} activeKey={0} bookingList={bookings?.first} setBookings={setBookings} fetchBooking={fetchBooking} />,
                    },
                    {
                        label: `Occupying`,
                        key: 1,
                        children: <TableBooking foodType={foodType} activeKey={1} bookingList={bookings?.second} setBookings={setBookings} fetchBooking={fetchBooking} />,
                    },
                    {
                        label: `Checked out`,
                        key: 2,
                        children: <TableBooking foodType={foodType} activeKey={2} bookingList={bookings?.third} setBookings={setBookings} fetchBooking={fetchBooking} />,
                    }
                ]}
            />
        </>
    )
}

export default Page_Hotel_Test