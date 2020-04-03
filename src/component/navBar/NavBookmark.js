import {
    FaRegBookmark as FaBookmark,
    FaBookmark as FaBookmarked
} from 'react-icons/fa';
import React from "react";
import {Navbar} from "react-bootstrap";
import ReactTooltip from "react-tooltip";

const style = {
    color: 'white'
};

class NavBookmark extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {marked: props.marked || false};
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        ReactTooltip.hide();
        this.props.onClick(this.props.marked);
    }


    render() {
        const icon = this.props.marked ? <FaBookmarked/> : <FaBookmark/>;

        return (
            <>
                <Navbar.Text
                    onClick={this.onClick}
                    style={{"fontSize": "1.2rem"}}
                    className='text-white mr-1'
                    data-tip
                    data-for='nav-btn-bookmark'>
                    {icon}
                </Navbar.Text>
                <ReactTooltip
                    id='nav-btn-bookmark'
                    effect='solid'
                    offset={{bottom: -10}}
                    place='bottom'
                    className='py-1 px-2'>
                    Bookmark
                </ReactTooltip>
            </>
        );

    }
}


export default NavBookmark;