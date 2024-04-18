import {
    Typography,
    Button,
    Image,
    Card,
    Form,
    Input,
    theme
} from "antd"
import {
    AppstoreOutlined,
    UserOutlined,
    LockOutlined
} from '@ant-design/icons';
import ModeThemeContext from "../../context/ModeThemeContext";
import { userLogin, getMe } from "../../apis/userApi";
import { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import { useNavigate } from 'react-router-dom';
const Page_Login = () => {
    let [loadingLogin, setLoadingLogin] = useState(false)
    let [user, dispatchUser] = useContext(UserContext)
    let [loginType, setLoginType] = useState(true)
    const antdTheme = theme.useToken()
    let loginColor = antdTheme.token.colorFill
    const navigate = useNavigate()
    async function handleLogin(values) {
        setLoadingLogin(true)
        try {
            if (loginType) {
                if (values.username == "smanager" && values.password == "postgres") {
                    dispatchUser({
                        type: "login", payload: {
                            username: "smanager",
                            fullname: "sManager",
                            admin: true
                        }
                    })
                    navigate(`/hotel-management`)
                }
                else {
                    throw "wrong password"
                }
            }
            else {
                let response = await userLogin(values)
                console.log("login", response)
                dispatchUser({ type: "login", payload: response })
                navigate(`/hotel-customer`)
            }
        }
        catch (e) {
            console.log("error is: ", e)
        }
        setLoadingLogin(false)
    };
    return (
        <div style={{
            width: "100%",
            height: "100%",
            backgroundImage: "url('/file/login.png')",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Card style={{
                width: "25%",
                boxShadow: "0px 0px 20px 1px",
                // opacity: "0.6",
                // backgroundColor: `${loginColor}`,
                // backgroundColor: `rgba(255,255,255,0.4)`,
                // backdropFilter: `blur(0px)`,
                // border: "0px"
            }}>
                <Typography.Title level={1} style={{
                    marginTop: 0,
                    textAlign: "center"
                }}>
                    Login as {loginType ? "admin" : "guest"}
                </Typography.Title>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={handleLogin}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Email!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button loading={loadingLogin} type="primary" htmlType="submit" className="login-form-button" style={{ width: "100%" }}>
                            Log in
                        </Button>
                    </Form.Item>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Button type="text" onClick={() => { setLoginType(!loginType) }}>Login as {loginType ? "guest" : "admin"}</Button>
                    </div>
                </Form>
            </Card>
        </div>
    )
}
export default Page_Login