import React from "react";
import {Badge} from "react-bootstrap";

const colorDefault = "#6e757c";

const colorMapping = {
    "WORLD": "#7C4EFF",
    "POLITICS": "#419488",
    "BUSINESS": "#4696EC",
    "TECHNOLOGY": "#cedc39",
    "SPORTS": "#f6c244",
    "GUARDIAN": "#14284a",
    "NYTIMES": "#dddddd",
};


const SectionBadge = (props) => {
    if (!props.text) {
        return <></>;
    }
    const text = props.text.toUpperCase();


    const textColorClass =
        ["TECHNOLOGY", "SPORTS", "NYTIMES"].includes(text) ? "" : "text-white";

    const style = {
        backgroundColor: colorMapping[text] ? colorMapping[text] : colorDefault,
    };
    return (
        <div className={props.className || ""} style={{fontSize: props.fontSize || "1rem"}}>
            <Badge style={style}
                   className={textColorClass}>
                {text}
            </Badge>
        </div>

    )
};


export default SectionBadge;