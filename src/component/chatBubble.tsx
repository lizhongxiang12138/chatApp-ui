import "../css/index.css"
import {Avatar, Space} from "antd";
import React, {useState, useEffect} from "react";

const ChatBubble = (props) => {
    const [arrowdirection, setArrowdirection] = useState('left');
    const [contentTxt, setContentTxt] = useState('')
    const onInitData = (data) => {
        if (data && data.content) {
            setContentTxt(data.content)
        }
        if (data && data.direction) {
            setArrowdirection(data.direction)
        }
    }

    const resNode = () => {
        if (arrowdirection === 'right') {
            return (
                <Space.Compact>
                    <div className="bubble-right">
                        {contentTxt}
                    </div>
                    {/*<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=3"/>*/}
                    <Avatar style={{backgroundColor: '#131211'}}>my</Avatar>
                </Space.Compact>
            )
        } else {
            return (
                <Space.Compact>
                    <Avatar style={{backgroundColor: '#f56a00'}}>AI</Avatar>
                    <div className="bubble-left">
                        {contentTxt}
                    </div>
                </Space.Compact>
            )
        }
    }

    useEffect(() => {
        onInitData(props);
    }, [props])

    return resNode()
}

export default ChatBubble