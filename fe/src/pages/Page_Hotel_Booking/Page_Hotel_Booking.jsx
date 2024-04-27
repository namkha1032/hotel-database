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
    Modal,
    Popconfirm
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
import { apiCheckIn, apiGetFood, apiCheckOut, apiGetBranch, apiDeleteBooking } from "../../apis/hotelApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ViewBookingModal = (props) => {
    let item = props.item
    let activeKey = props.activeKey
    let fetchBooking = props.fetchBooking
    let chosenBranch = props.chosenBranch
    let allBranch = props.allBranch
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
        await fetchBooking(chosenBranch)
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
            roomlist: roomList.map((ro, roidx)=>{
                return{
                    branchid: ro.branchid,
                    roomnumber: ro.roomnumber,
                    inputfoodconsumed: ro.inputfoodconsumed.filter((fo, foidx)=>{
                        return fo.amount > 0
                    })
                }
            })
        }
        let response = await apiCheckOut(newBody)
        console.log("chosenBranch", chosenBranch)
        await fetchBooking(chosenBranch)
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
    async function handleDeleteBooking() {
        try {
            setLoading(true)
            let response = await apiDeleteBooking({ bookingid: item.bookingid })
            await fetchBooking(chosenBranch)
            toast.success('Booking cancel successfully!', {
                theme: "colored"
            });
            setLoading(false)
        }
        catch (e) {
            toast.error('Booking cancel failed!', {
                theme: "colored"
            });
        }
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
                    <Col md={spanKey} style={{ display: "flex", alignItems: "center" }}>
                        <Typography.Text>Branch</Typography.Text>
                    </Col>

                    <Col md={spanValue}>
                        <Input readOnly value={allBranch[parseInt(chosenBranch[3]) - 1].province} />
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
            <Space>
                <Tag style={{ cursor: "pointer" }} color={activeKey == 0 ? "volcano" : activeKey == 1 ? "blue" : "green"} onClick={() => { setModalOpen(true) }}>
                    {activeKey == 0 ? "Upcoming" : activeKey == 1 ? "Occupying" : "Checked out"}
                </Tag>
                {activeKey == '0' ?
                    <Popconfirm
                        title="Cancel this booking"
                        description="Are you sure to cancel this booking?"
                        onConfirm={() => { handleDeleteBooking() }}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{
                            loading: loading,
                        }}
                    >
                        <Button shape="circle" danger type="text" icon={<DeleteOutlined />} />
                    </Popconfirm> : null}
            </Space>
        </>
    )
}

const TableBooking = (props) => {
    let activeKey = props.activeKey
    let chosenBranch = props.chosenBranch
    let bookingList = props.bookingList
    let setBookings = props.setBookings
    let fetchBooking = props.fetchBooking
    let foodType = props.foodType
    let allBranch = props.allBranch
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
                <ViewBookingModal allBranch={allBranch} chosenBranch={chosenBranch} foodType={foodType} item={obj} activeKey={activeKey} fetchBooking={fetchBooking} />
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

const Page_Hotel_Booking = () => {
    let [chosenBranch, setChosenBranch] = useState('BR01')
    let [allBranch, setAllBranch] = useState([])
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    let [bookings, setBookings] = useState(null)
    let [foodType, setFoodType] = useState([])
    console.log("bookings: ", bookings)
    useEffect(() => {
        async function fetchBranch() {
            let responseBranch = await apiGetBranch()
            console.log("responseBranch", responseBranch)
            setAllBranch(responseBranch.rows)
        }
        fetchBooking(chosenBranch)
        fetchBranch()
    }, [])
    async function fetchBooking(inputBranch) {
        let first = await apiGetBooking({ branchid: inputBranch, checkinnull: "NULL", checkoutnull: "NULL" })
        let second = await apiGetBooking({ branchid: inputBranch, checkinnull: "NOT NULL", checkoutnull: "NULL" })
        let third = await apiGetBooking({ branchid: inputBranch, checkinnull: "NOT NULL", checkoutnull: "NOT NULL" })
        let foodResponse = await apiGetFood()
        setBookings({ first: first.rows, second: second.rows, third: third.rows })
        setFoodType(foodResponse.rows)
    }
    return (
        <>
            <ToastContainer />
            <Typography.Title level={1}>All bookings</Typography.Title>
            <Space style={{ marginBottom: 16 }}>
                <Typography.Text>Branch:</Typography.Text>
                <Select
                    defaultValue="BR01"
                    style={{
                        width: 120,
                    }}
                    value={chosenBranch}
                    onChange={(value) => {
                        setChosenBranch(value)
                        fetchBooking(value)
                    }}
                    options={allBranch.map((branch, idx) => {
                        return {
                            value: branch.branchid,
                            label: branch.province
                        }
                    })
                    }
                />
            </Space>
            <Tabs
                defaultActiveKey={0}
                type="card"
                // size={size}
                items={[
                    {
                        label: `Upcoming`,
                        key: 0,
                        children: <TableBooking allBranch={allBranch} chosenBranch={chosenBranch} foodType={foodType} activeKey={0} bookingList={bookings?.first} setBookings={setBookings} fetchBooking={fetchBooking} />,
                    },
                    {
                        label: `Occupying`,
                        key: 1,
                        children: <TableBooking allBranch={allBranch} chosenBranch={chosenBranch} foodType={foodType} activeKey={1} bookingList={bookings?.second} setBookings={setBookings} fetchBooking={fetchBooking} />,
                    },
                    {
                        label: `Checked out`,
                        key: 2,
                        children: <TableBooking allBranch={allBranch} chosenBranch={chosenBranch} foodType={foodType} activeKey={2} bookingList={bookings?.third} setBookings={setBookings} fetchBooking={fetchBooking} />,
                    }
                ]}
            />
        </>
    )
}

export default Page_Hotel_Booking