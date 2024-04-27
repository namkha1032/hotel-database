import {
    Typography,
    Button,
    Image,
    Card,
    Form,
    Input,
    theme,
    InputNumber,
    DatePicker
} from "antd"
import {
    AppstoreOutlined,
    UserOutlined,
    LockOutlined
} from '@ant-design/icons';
import ModeThemeContext from "../../context/ModeThemeContext";
import { userLogin, getMe, userSignup } from "../../apis/userApi";
import { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import delay from "../../functions/delay";
const Page_Signup = () => {
    let [loadingLogin, setLoadingLogin] = useState(false)
    let [user, dispatchUser] = useContext(UserContext)
    const antdTheme = theme.useToken()
    let loginColor = antdTheme.token.colorFill
    const navigate = useNavigate()
    async function handleSignup(values) {
        setLoadingLogin(true)
        try {
            let response = await userSignup(values)
            console.log("signup", response)
            toast.success('Sign up successfully!', {
                theme: "colored"
            });
            await delay(3000)
            navigate(`/login-guest`)
        }
        catch (e) {
            console.log("error is: ", e)
            toast.error(e.response.data, {
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
            backgroundImage: "url('/file/signup.jpg')",
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
                display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"

            }} styles={{ body: { width: "100%" } }}>
                <Typography.Title level={1} style={{
                    marginTop: 0,
                    textAlign: "center"
                }}>
                    Sign up
                </Typography.Title>
                <Form
                    name="basic"
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 18,
                    }}
                    style={{
                        // maxWidth: 600,
                        width: "95%"
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={handleSignup}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Full name"
                        name="fullname"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your full name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Date of birth"
                        name="dob"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your date of birth!',
                            },
                        ]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Citizen ID"
                        name="citizenid"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your citizen ID!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your phone number!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: 'Please input your phone number!',
                    //     },
                    // ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>


                    <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button type="text" onClick={() => { navigate("/login") }}>Login as admin</Button>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button type="text" onClick={() => { navigate("/login-guest") }}>Already has an account? Log in</Button>
                </div>
            </Card>
        </div >
    )
}
export default Page_Signup