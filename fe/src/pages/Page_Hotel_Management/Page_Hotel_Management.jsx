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
    Statistic
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
import { apiGetBranch } from "../../apis/hotelApi";
const RoomCalender = (props) => {
    let statisticsYear = props.statisticsYear
    let statisticsMonth = props.statisticsMonth
    let branchid = props.branchid
    let roomnumber = props.roomnumber
    let events = props.events
    const calendarRef = useRef(null)
    useEffect(() => {
        const calendarApi = calendarRef.current.getApi()
        calendarApi.gotoDate(`${statisticsYear}-${statisticsMonth}-01`)
    }, [statisticsMonth, statisticsYear])
    return (
        <>
            <FullCalendar
                ref={calendarRef}
                headerToolbar={false}
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                displayEventTime={false}
                // contentHeight={100}
                height={400}
                // aspectRatio={0.2}
                // nextDayThreshold={'00:00:00Z'}
                events={events}
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Typography.Text style={{ fontWeight: 600, fontSize: 24 }}>{`Room ${roomnumber}`}</Typography.Text>
            </div>
        </>
    )
}

const Page_Hotel_Management = () => {
    let [statisticsBranch, setStatisticsBranch] = useState('BR01')
    let [statisticsYear, setStatisticsYear] = useState('2024')
    let [statisticsMonth, setStatisticsMonth] = useState('06')
    let [branchStatistics, setBranchStatistics] = useState([])
    let [allBranch, setAllBranch] = useState([])
    let [ratePlot, setRatePlot] = useState([])
    let [averageRate, setAverageRate] = useState(0)
    let [totalRevenue, setTotalRevenue] = useState(0)
    let [roomCalendar, setRoomCalendar] = useState([])
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    let antdTheme = theme.useToken()
    console.log("roomCalendar", roomCalendar)
    useEffect(() => {
        async function fetchData() {
            // let roomCalendarRaw = await axios.post(`http://localhost:3001/api/hotel/getroomcalendar`, {
            //     branchid: statisticsBranch,
            //     inputyear: statisticsYear,
            //     inputmonth: statisticsMonth
            // })
            // console.log('roomCalendarRaw', roomCalendarRaw)
            // let branchStatisticsRaw = await axios.post(`http://localhost:3001/api/hotel/statistics`, { branchID: statisticsBranch, year: statisticsYear })
            // setRoomCalendar(roomCalendarRaw.data.rows)
            // console.log('branchStatisticsRaw', branchStatisticsRaw)
            // setBranchStatistics(branchStatisticsRaw.data.rows)

            await handleBranchStatistics(statisticsBranch, statisticsYear)
            await handleRoomCalendar(statisticsBranch, statisticsYear, statisticsMonth)
            let responseBranch = await apiGetBranch()
            console.log("responseBranch", responseBranch)
            setAllBranch(responseBranch.rows)
        }
        fetchData()
    }, [])
    async function handleBranchStatistics(inputBranch, inputYear) {
        // console.log("inputBranch", inputBranch)
        // console.log("inputYear", inputYear)
        let statisticsResponse = await axios.post(`http://localhost:3001/api/hotel/statistics`, { branchID: inputBranch, year: inputYear })
        console.log("statisticsResponse", statisticsResponse.data)
        let newAverage = 0
        let newRevenue = 0
        let newRatePlot = []
        let copyStatistics = statisticsResponse.data.rows.map((item, index) => {
            newAverage = newAverage + item.occupancy_rate
            newRevenue = newRevenue + parseInt(item.total_revenue)
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
        setTotalRevenue(newRevenue)
        setBranchStatistics(copyStatistics)
        setRatePlot(newRatePlot)
    }
    async function handleRoomCalendar(inputBranch, inputYear, inputMonth) {
        console.log("inputBranch", inputBranch)
        console.log("inputYear", inputYear)
        console.log("inputMonth", inputMonth)
        let roomCalendarRaw = await axios.post(`http://localhost:3001/api/hotel/getroomcalendar`, {
            branchid: inputBranch,
            inputyear: inputYear,
            inputmonth: inputMonth
        })
        console.log("roomCalendarRaw", roomCalendarRaw)
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
            render: (obj) => `${parseFloat(obj.occupancy_rate * 100).toFixed(2)} %`
        },
        {
            title: "Total revenue",
            render: (obj) => obj.total_revenue
        },
        {
            title: "Total guests",
            render: (obj) => obj.total_guest
        }
    ]
    let events = [
        {
            title: "BK001",
            "start": "2024-06-07T00:00:00",
            "end": "2024-06-09T00:00:00",
            allDay: true

        },
        {
            title: "BK002",
            start: "2024-06-12",
            end: '2024-06-14',
            allDay: true
        },
        {
            title: "BK003",
            start: "2024-06-11",
            end: '2024-06-15',
            allDay: true
        },
        {
            title: "BK003",
            start: "2024-06-14",
            end: '2024-06-17',
            allDay: true
        },
    ]
    const data = [
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 13 },
    ];
    console.log("branchStatistics", branchStatistics)
    return (
        <>
            <Typography.Title level={1}>Branch statistics</Typography.Title>
            <Space style={{ marginBottom: 8 }}>
                <Select
                    defaultValue="BR01"
                    style={{
                        width: 120,
                    }}
                    onChange={(value) => {
                        handleBranchStatistics(value, statisticsYear)
                        handleRoomCalendar(value, statisticsYear, statisticsMonth)
                        setStatisticsBranch(value)
                    }}
                    value={statisticsBranch}
                    options={allBranch.map((branch, idx) => {
                        return {
                            value: branch.branchid,
                            label: branch.province
                        }
                    })
                    }
                />
                <Select
                    defaultValue="2023"
                    style={{
                        width: 120,
                    }}
                    value={statisticsYear}
                    onChange={(value) => {
                        handleBranchStatistics(statisticsBranch, value)
                        handleRoomCalendar(statisticsBranch, value, statisticsMonth)
                        setStatisticsYear(value)
                    }}
                    options={[
                        {
                            value: '2023',
                            label: '2023',
                        },
                        {
                            value: '2024',
                            label: '2024',
                        }
                    ]}
                />
            </Space>
            <br />
            <div style={{ display: "flex", columnGap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", rowGap: 16, width: "50%" }}>
                    <Card className="myChart" style={{ flex: 1, borderColor: antdTheme.token.colorBorder }}
                    // style={{ height: "50%" }} styles={{ body: { height: "100%", padding: 0 } }}
                    >
                        <Row gutter={[16, 16]}>
                            <Col md={13} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Row gutter={[16, 16]} justify={"space-between"} style={{ width: "100%", height: "100%", marginLeft: 0 }}>
                                    <Col md={12} style={{ display: "flex", alignItems: "center" }}>
                                        <Statistic title="Branch" value={allBranch[parseInt(statisticsBranch[3]) - 1]?.province} />
                                    </Col>
                                    <Col md={12} style={{ display: "flex", alignItems: "center" }}>
                                        <Statistic title="Year" value={statisticsYear} />
                                    </Col>
                                    <Col md={12} style={{ display: "flex", alignItems: "center" }}>
                                        <Statistic title="Occupancy rate" value={averageRate} />
                                    </Col>
                                    <Col md={12} style={{ display: "flex", alignItems: "center" }}>
                                        <Statistic title="Total revenue" value={totalRevenue} />
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={11} style={{ display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "space-evenly" }}>
                                <Liquid height={235} percent={averageRate} />
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <Typography.Text>Average occupancy rate</Typography.Text>
                                </div>
                            </Col>
                        </Row>

                    </Card>
                    <Card className="myChart" style={{ flex: 1, borderColor: antdTheme.token.colorBorder }}
                    // style={{ height: "50%" }} styles={{ body: { height: "100%", padding: 0 } }}
                    >
                        {/* <Line point={{
                            shapeField: 'circle',
                            sizeField: 4,
                        }} height={290} xField={"month_text"} yField={"total_revenue"} data={branchStatistics} theme={modeTheme == "light" ? "light" : "dark"} /> */}
                        {/* <Column percent={true} stack={true} height={290}
                            xField={"month_text"} yField={"value"} data={ratePlot} interaction={{
                                tooltip: {
                                    shared: true,
                                },
                            }} tooltip={{ channel: 'y0', valueFormatter: '.0%' }} /> */}


                        <DualAxes
                            theme={modeTheme == "light" ? "light" : "dark"}
                            height={350}
                            xField={"month_text"}
                            children={[
                                {
                                    data: ratePlot,
                                    type: 'interval',
                                    yField: 'value',
                                    stack: true,
                                    percent: true,
                                    colorField: 'type',
                                    style: { maxWidth: 80 },
                                    tooltip: { channel: 'y0', valueFormatter: '.0%' },
                                    axis: {
                                        y: {
                                            title: 'Percentage',
                                            // style: { titleFill: '#5B8FF9' }
                                        }
                                    },
                                    interaction: { elementHighlightByColor: { background: true } },
                                },
                                {
                                    data: branchStatistics,
                                    type: 'line',
                                    yField: 'total_revenue',
                                    colorField: () => 'total_revenue',
                                    style: { lineWidth: 2 },
                                    axis: {
                                        y: {
                                            position: 'right',
                                            title: 'revenue',
                                            // style: { titleFill: '#5AD8A6' },
                                        },
                                    },
                                    interaction: {
                                        tooltip: {
                                            crosshairs: false,
                                            marker: false,
                                        },
                                    },
                                },
                            ]} />
                    </Card>
                </div>
                <Card style={{ width: "100%", height: "100%", borderRadius: 16, borderColor: antdTheme.token.colorBorder }} styles={{ body: { padding: 0 } }}>
                    <Table
                        bordered
                        columns={branchStatisticsColumn}
                        rowKey={(record) => record.month_num}
                        dataSource={branchStatistics}
                        pagination={false}
                        style={{ width: "100%", height: "100%", borderRadius: 8 }}
                        footer={() => 'Statistics of each month'}
                    />
                </Card>

            </div>

            <Typography.Title level={1}>Rooms calendar</Typography.Title>
            <Space style={{ marginBottom: 8 }}>
                <Select
                    defaultValue="BR01"
                    style={{
                        width: 120,
                    }}
                    onChange={(value) => {
                        handleBranchStatistics(value, statisticsYear)
                        handleRoomCalendar(value, statisticsYear, statisticsMonth)
                        setStatisticsBranch(value)
                    }}
                    value={statisticsBranch}
                    options={[
                        {
                            value: 'BR01',
                            label: 'BR01',
                        },
                        {
                            value: 'BR02',
                            label: 'BR02',
                        }
                    ]}
                />
                <Select
                    defaultValue="2023"
                    style={{
                        width: 120,
                    }}
                    value={statisticsYear}
                    onChange={(value) => {
                        handleBranchStatistics(statisticsBranch, value)
                        handleRoomCalendar(statisticsBranch, value, statisticsMonth)
                        setStatisticsYear(value)
                    }}
                    options={[
                        {
                            value: '2023',
                            label: '2023',
                        },
                        {
                            value: '2024',
                            label: '2024',
                        }
                    ]}
                />
                <Select
                    defaultValue="04"
                    style={{
                        width: 120,
                    }}
                    value={statisticsMonth}
                    onChange={(value) => {
                        handleRoomCalendar(statisticsBranch, statisticsYear, value)
                        setStatisticsMonth(value)
                    }}
                    options={[
                        {
                            value: '01',
                            label: 'January',
                        },
                        {
                            value: '02',
                            label: 'February',
                        },
                        {
                            value: '03',
                            label: 'March',
                        },
                        {
                            value: '04',
                            label: 'April',
                        },
                        {
                            value: '05',
                            label: 'May',
                        },
                        {
                            value: '06',
                            label: 'June',
                        },
                        {
                            value: '07',
                            label: 'July',
                        },
                        {
                            value: '08',
                            label: 'August',
                        },
                        {
                            value: '09',
                            label: 'September',
                        },
                        {
                            value: '10',
                            label: 'October',
                        },
                        {
                            value: '11',
                            label: 'November',
                        },
                        {
                            value: '12',
                            label: 'December',
                        },
                    ]}
                />
            </Space>
            <Collapse destroyInactivePanel={true} items={roomCalendar?.map((roomtype, index1) => {
                return {
                    key: index1,
                    label: <Row>
                        <Col md={4}>
                            <Typography.Text>
                                {roomtype.roomname}
                            </Typography.Text>
                        </Col>
                        <Col md={4}>
                            <Typography.Text>
                                {roomtype.occupancy_rate}
                            </Typography.Text>
                        </Col>
                    </Row>,
                    children: <Row gutter={[16, 16]}>
                        <Col md={6} style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", flexDirection: "column" }}>
                            <Row gutter={[0, 16]} style={{ marginRight: "-150px" }}>
                                <Col md={12}>
                                    <Statistic title="Room type" value={roomtype.roomname} />
                                </Col>
                                <Col md={12}>
                                    <Statistic title="Occupancy rate" value={`${parseFloat(roomtype.occupancy_rate * 100).toFixed(2)} %`} />
                                </Col>
                                <Col md={12}>
                                    <Statistic title="Branch" value={allBranch[parseInt(statisticsBranch[3]) - 1]?.province} />
                                </Col>
                                <Col md={12}>
                                    <Statistic title="Time" value={`${statisticsYear}/${statisticsMonth}`} />
                                </Col>
                            </Row>
                            <Liquid height={235} percent={parseFloat(roomtype.occupancy_rate.toFixed(4))} />
                            <Typography.Text style={{ marginTop: "-10px" }}>Average occupancy rate</Typography.Text>
                        </Col>
                        {/* <Col md={6}>
                        </Col> */}
                        {roomtype.rooms.map((room, index2) =>
                            <Col key={index2} md={6}>
                                <RoomCalender branchid={room.branchid} roomnumber={room.roomnumber} statisticsYear={statisticsYear} statisticsMonth={statisticsMonth} events={room.bookings} />
                            </Col>)}
                    </Row>
                }
            })} />

        </>
    )
}

export default Page_Hotel_Management