import React, {useState, useEffect} from 'react';
import mqtt from 'mqtt';
import uuid from 'react-uuid';
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
import {MqttClient} from "mqtt/types/lib/client";

const {Header, Content, Footer} = Layout;
const {TextArea} = Input;


const App: React.FC = () => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();
    const [chatDataList, setChatDataList] = useState([])
    const [client, setClient] = useState(null)
    const [connectStatus, setConnectStatus] = useState('create')
    const [payload, setPayload] = useState({})
    const [isSub, setIsSub] = useState(false)
    const [chatSub, setChatSub] = useState(null)
    const [chatServiceTopic, setChatServiceTopic] = useState('/chatService/01')
    const [myChatTxt, setMyChatTxt] = useState('')

    useEffect(() => {
            if (!chatSub) {
                setChatSub(`/chaui/${uuid()}`)
            }
        }
        , [chatSub])

    const mqttConnect = (host, mqttOption) => {
        setConnectStatus('Connecting');
        setClient(mqtt.connect(host, mqttOption));
    };
    const mqttSub = (subscription) => {

        if (client) {
            const {topic, qos} = subscription;
            client.subscribe(topic, {qos}, (error) => {
                if (error) {
                    console.log('Subscribe to topics error', error)
                    return
                }
                setIsSub(true)
            });
        }
    };

    const mqttUnSub = (subscription) => {
        if (client) {
            const {topic} = subscription;
            client.unsubscribe(topic, error => {
                if (error) {
                    console.log('Unsubscribe error', error)
                    return
                }
                setIsSub(false);
            });
        }
    };

    const mqttPublish = (context) => {
        if (client) {
            const {topic, qos, payload} = context;
            client.publish(topic, payload, {qos}, error => {
                if (error) {
                    console.log('Publish error: ', error);
                }
            });
        }
    }

    const mqttDisconnect = () => {
        if (client) {
            client.end(() => {
                setConnectStatus('Connect');
            });
        }
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

    const onFinish = () => {
        if (!myChatTxt) {
            return
        }
        console.log(myChatTxt)
        setChatDataList(prev => [...prev, {
            txt: myChatTxt,
            type: 'right'
        }])
        //给mqtt发消息
        let mqttMsg = {
            myTopic: chatSub,
            msg: myChatTxt
        }
        mqttMsg = JSON.stringify(mqttMsg)

        mqttPublish({topic: chatServiceTopic, qos: 0, payload: mqttMsg})
        setMyChatTxt(null)
    }

    const onHandlerMsgChatService = (mqMsg) => {
        const msgJson = JSON.parse(mqMsg);
        if (msgJson && msgJson.msg) {
            setChatDataList(newChatPrev => [...newChatPrev, {
                txt: msgJson.msg,
                type: 'left'
            }]);
        }
    }

    useEffect(() => {
        if (client) {
            console.log(client)
            client.on('connect', () => {
                setConnectStatus('Connected');
            });
            client.on('error', (err) => {
                console.error('Connection error: ', err);
                client.end();
            });
            client.on('reconnect', () => {
                setConnectStatus('Reconnecting');
            });
            client.on('message', (topic, message) => {
                // const payload = {topic, message: message.toString()};
                onHandlerMsgChatService(message.toString())
            });
        }
        if (!isSub) {
            mqttSub({topic: chatSub, qos: 0})
        }
    }, [client])

    useEffect(() => {

        if (connectStatus == 'create') {
            mqttConnect(`ws://118.178.106.202:8083/mqtt`, {
                keepalive: 30,
                protocolId: 'MQTT',
                protocolVersion: 4,
                clean: true,
                reconnectPeriod: 1000,
                connectTimeout: 30 * 1000,
                will: {
                    topic: 'WillMsg',
                    payload: 'Connection Closed abnormally..!',
                    qos: 0,
                    retain: false
                },
                rejectUnauthorized: false
            })
        }
    }, [connectStatus])


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
                <div className="site-layout-content" style={{background: colorBgContainer}}>
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

                <Space.Compact style={{width: '100%'}}>
                    <TextArea value={myChatTxt} onChange={({ target: { value } })=>{setMyChatTxt(value)}} placeholder="请输入"/>
                    <Button type="primary">发送</Button>
                </Space.Compact>

            </Footer>
        </Layout>
    );
};

export default App;