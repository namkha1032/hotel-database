// import packages
import { useNavigate, useLocation, Link, redirect } from 'react-router-dom';
import { useContext } from 'react';
// import my components
// import ui components
import {
    Layout,
    theme,
    Typography,
    Switch,
    Input,
    Button,
    Row,
    Col,
    Avatar,
    Tag,
    Popover,
    Dropdown
} from 'antd';
// import icons
import {
    SlidersOutlined,
    SearchOutlined,
    CloseOutlined,
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
// import apis
import { getSearchResult } from '../../apis/searchApi';
// import hooks
// import functions
// import context
import ModeThemeContext from '../../context/ModeThemeContext';
import SearchOptionContext from '../../context/SearchOptionContext';
import SearchResultContext from '../../context/SearchResultContext';
import UserContext from '../../context/UserContext';
//////////////////////////////////////////////////////////////////////////////////////////////////////
const AdvancedSearchButton = (props) => {
    const navigate = useNavigate()
    return (
        <>
            <Popover placement="bottom" content={'Advanced search'}>
                <Button shape='circle' type={"text"} size='small' onClick={() => { navigate('/search') }}>
                    <SlidersOutlined style={{ fontSize: 16 }} />
                </Button>
            </Popover>
        </>
    )
}

const NavBar = () => {
    const antdTheme = theme.useToken()
    const navigate = useNavigate()
    const dropdownItems = [
        {
            label: 'My profile',
            key: '1',
            icon: <UserOutlined />,
        },
        {
            label: 'Log out',
            key: '2',
            icon: <LogoutOutlined />,
        },
    ]
    // logics
    let [modeTheme, dispatchModeTheme] = useContext(ModeThemeContext)
    let [user, dispatchUser] = useContext(UserContext)
    let primaryBgColor = modeTheme == "light" ? antdTheme.token.colorBgElevated : antdTheme.token.colorBgLayout
    let secondaryBgColor = modeTheme == "light" ? antdTheme.token.colorBgLayout : antdTheme.token.colorBgElevated
    // HTMl
    return (
        <Layout.Header
            style={{
                paddingRight: `${antdTheme.token.paddingContentHorizontal}px`,
                paddingLeft: 0,
                background: secondaryBgColor
            }
            }
        >
            <Row justify={"space-between"} align={"center"} style={{ height: "100%" }}>
                <Col md={10} style={{ display: "flex", alignItems: "center" }}>
                    {/* <Input.Search
                        placeholder="input search text"
                        // enterButton={<Typography.Text>Search</Typography.Text>}
                        enterButton='Search'
                        size="large"
                        suffix={<AdvancedSearchButton />}
                    >
                    </Input.Search> */}
                </Col>
                <Col md={5} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", columnGap: 10 }}>
                    <Switch checked={modeTheme == "dark"}
                        checkedChildren={<FontAwesomeIcon icon={icon({ name: 'moon', style: 'solid' })} />}
                        unCheckedChildren={<FontAwesomeIcon icon={icon({ name: 'sun', style: 'solid' })} />}
                        onClick={(e) => {
                            if (e) {
                                dispatchModeTheme({ type: "dark" })
                            }
                            else {
                                dispatchModeTheme({ type: "light" })
                            }
                        }} />
                    <Typography.Text>{user?.fullname}</Typography.Text>
                    <Dropdown menu={{
                        items: dropdownItems,
                        onClick: (e) => {
                            if (e.key == "2") {
                                // delete localStorage here
                                // dispatchUser({ type: "logout" })
                                navigate("/login")
                            }
                        },
                    }} placement='bottomLeft' arrow={true} trigger={["click"]}>
                        <Avatar style={{ cursor: "pointer" }} size={"large"} src="/file/avatar.png" />
                    </Dropdown>
                </Col>
            </Row>
        </Layout.Header >

    )
}

export default NavBar