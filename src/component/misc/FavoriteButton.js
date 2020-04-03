import React from "react";
import {
    FaRegBookmark as FaBookmark,
    FaBookmark as FaBookmarked
} from 'react-icons/fa';
import ReactTooltip from "react-tooltip";

const FavoriteButton = (props) => {
    const marked = props.marked;
    const size = props.size || 23;
    const onClick = () => {
        ReactTooltip.hide();
        props.onClick();
    };

    const icon = marked ? <FaBookmarked/> : <FaBookmark/>;

    const style = {
        fontSize: size + 'px',
        color: 'red'
    };
    return (
        <>
            <div onClick={onClick} style={style} data-tip data-for="fav-btn">
                {icon}
            </div>
            <ReactTooltip id='fav-btn' effect='solid' offset={{'top': -10}} className='py-1 px-2'>
                Bookmark
            </ReactTooltip>
        </>

    );
};


export default FavoriteButton;