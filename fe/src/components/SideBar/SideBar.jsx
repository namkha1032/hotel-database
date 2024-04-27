import { useEffect, useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import {
    AppstoreOutlined,
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    Html5TwoTone,
    CloudTwoTone,
    CompassTwoTone,
    Html5Outlined,
    HddOutlined,
    Html5Filled,
    RightOutlined,
    SlidersOutlined,
    SearchOutlined,
    UserOutlined,
    TeamOutlined,
    DeleteOutlined,
    BarsOutlined,
    ShareAltOutlined
} from '@ant-design/icons';
import {
    Breadcrumb,
    Layout,
    Menu,
    theme,
    Typography,
    Switch,
    Input,
    Flex,
    Button,
    Collapse,
    Row,
    Col,
    Avatar,
    Segmented,
    Card
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { useSearchParams, NavLink, useLocation, useNavigate } from 'react-router-dom';
import FolderTree from '../FolderTree/FolderTree';
// import context
import ModeThemeContext from '../../context/ModeThemeContext';
// //////////////////////////////////////////////////////
const { Text, Title, Paragraph } = Typography
const { Header, Content, Footer, Sider } = Layout;


const SideBar = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const [openFolderTree, setOpenFolderTree] = useState([])
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    const antdTheme = theme.useToken()
    const location = useLocation()
    const navigate = useNavigate()
    let [sidebarItem, setSidebarItem] = useState("0")
    let primaryBgColor = modeTheme == "light" ? antdTheme.token.colorBgElevated : antdTheme.token.colorBgLayout
    let secondaryBgColor = modeTheme == "light" ? antdTheme.token.colorBgLayout : antdTheme.token.colorBgElevated

    useEffect(() => {
        // if (location) {
        if (location.pathname.includes("hotel-management")) {
            setSidebarItem('1')
        }
        else if (location.pathname.includes("hotel-booking")) {
            setSidebarItem('2')
        }
        // }
    }, [location])
    const items = [
        {
            key: '1',
            icon: <ShareAltOutlined />,
            label: "Statistics"
        },
        {
            key: '2',
            icon: <HddOutlined />,
            label: "Bookings"
        }
    ]
    return (
        <Sider
            style={{
                background: secondaryBgColor
            }}
            width="13%"
            collapsible collapsed={collapsed}
            trigger={
                <Flex
                    justify="center" align="center"
                    style={{ width: "100%", height: "100%", backgroundColor: secondaryBgColor }}>
                    <Button
                        style={{ width: "100%", margin: antdTheme.token.marginXXS, backgroundColor: antdTheme.token.colorPrimaryBg, transition: "backgroundColor 0.215s" }}
                        type={modeTheme == "dark" ? "primary" : "default"}
                        // type={"primary"}
                        ghost={modeTheme == "dark" ? true : false}
                        onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </Button>
                </Flex>
            }
            onCollapse={(value) => setCollapsed(value)}>
            <div style={{
                display: "flex",
                // justifyContent: collapsed ? "center" : "flex-start",
                justifyContent: "flex-start",
                alignItems: "center",
                columnGap: 15,
                height: 60,
                // margin: `0 ${antdTheme.token.marginXXS}px`,
                padding: collapsed ? `0 ${40 - antdTheme.token.fontSizeHeading3 / 2}px` : `0 ${35 - antdTheme.token.fontSizeHeading3 / 2}px`,
                transition: "padding 0.215s"
            }}>
                <Html5Outlined
                    style={{ fontSize: antdTheme.token.fontSizeHeading3, color: antdTheme.token.colorTextBase }}
                />
                <Text strong={true} style={{
                    fontSize: antdTheme.token.fontSizeHeading3, whiteSpace: "nowrap",
                    display: collapsed ? "none" : "block"
                }}>
                    DMS
                </Text>
            </div>
            <Menu theme={modeTheme}
                style={{
                    border: 0,
                    background: secondaryBgColor,
                    padding: "0 8px"
                }}
                selectedKeys={[sidebarItem]}
                mode="inline" items={items}
                onSelect={(event) => {
                    if (event.key == '1') {
                        // setSidebarItem('1')
                        navigate("/hotel-management")
                    }
                    else if (event.key == '2') {
                        // setSidebarItem('2')
                        navigate("/hotel-booking")
                    }
                }}
            />
        </Sider>
    )
}

export default SideBar