import React, {useState, useEffect} from 'react';
import {
    Breadcrumb,
    Layout,
    Menu,
    theme,
    Button,
    Input,
    Select,
    Space,
    Col,
    Row,
    Tooltip,
    Avatar,
    Popover,
    Form
} from 'antd';
import ChatBubble from "../component/chatBubble"

const {Header, Content, Footer} = Layout;
const {TextArea} = Input;


const App: React.FC = () => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();
    const [chatDataList, setChatDataList] = useState([])
    const [chatForm] = Form.useForm();

    const onInitData = () => {
        setChatDataList([])
    }

    const onGetChatView = () => {
        return chatDataList.map((item) => {
            if (item.type == 'right') {
                return (
                    <Row style={{marginTop: '10px'}}>
                        <Col span={4}></Col>
                        <Col style={{textAlign: "right"}} span={20}>
                            <ChatBubble direction="right" content={item.txt}></ChatBubble>
                        </Col>
                    </Row>
                )
            } else {
                return (
                    <Row style={{marginTop: '10px'}}>
                        <Col style={{textAlign: "left", minHeight: '60px'}} span={20}>
                            <Space.Compact>
                                <ChatBubble direction="left" content={item.txt}></ChatBubble>
                            </Space.Compact>
                        </Col>
                        <Col span={4}></Col>
                    </Row>
                )
            }
        });
    }

    const onFinish = (value) => {
        console.log(value)
        if (value && value.myChat) {
            setChatDataList([...chatDataList,{
                txt: value.myChat,
                type: 'right'
            }])
        }
        chatForm.setFieldValue('myChat', '')
    }

    useEffect(() => {
        onInitData();
    }, [])

    return (
        <Layout className="layout">
            <Content style={{
                padding: '0 5%',
                background: '#ffff0000',
                position: 'fixed',
                width: '100%',
                height: '90%',
                overflow: 'scroll'
            }}>
                <div className="site-layout-content" style={{ background: colorBgContainer }}>
                    {onGetChatView()}
                </div>
            </Content>
            <Footer style={{
                textAlign: 'center',
                position: 'fixed',
                top: '90%',
                width: '100%',
                height: '10%',
                backgroundColor: '#00000000'
            }}>
                <Form
                    form={chatForm}
                    onFinish={onFinish}
                >
                <Space.Compact style={{width: '100%',}}>
                        <Form.Item
                            name="myChat"
                        >
                            <TextArea rows={1} placeholder="请输入" maxLength={6}/>
                        </Form.Item>
                        <Button type="primary" htmlType="submit">发送</Button>
                </Space.Compact>
                </Form>
            </Footer>
        </Layout>
    );
};

export default App;