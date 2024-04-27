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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Page_Login_Guest = () => {
    let [loadingLogin, setLoadingLogin] = useState(false)
    let [user, dispatchUser] = useContext(UserContext)
    const antdTheme = theme.useToken()
    let loginColor = antdTheme.token.colorFill
    const navigate = useNavigate()
    async function handleLogin(values) {
        setLoadingLogin(true)
        try {
            let response = await userLogin(values)
            console.log("login", response)
            dispatchUser({ type: "login", payload: response })
            navigate(`/hotel-customer`)
        }
        catch (e) {
            console.log("e: ", e)
            toast.error(e.response.data.error, {
                theme: "colored",
                autoClose: 3000
            });
        }
        setLoadingLogin(false)
    };
    return (
        <div style={{
            width: "100%",
            height: "100%",
            backgroundImage: "url('/file/login_guest.jpg')",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <ToastContainer className={"mytoast"} />
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
                    Login as guest
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
                        <Button type="text" onClick={() => { navigate("/login") }}>Login as admin</Button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Button type="text" onClick={() => { navigate("/signup") }}>Sign up</Button>
                    </div>
                </Form>
            </Card>
        </div>
    )
}
export default Page_Login_Guest