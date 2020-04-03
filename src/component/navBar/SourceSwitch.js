import React from "react";
import Switch from "react-switch";
import {Navbar} from 'react-bootstrap';

class SourceSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(changeTo) {
        this.props.onSwitch(changeTo);
    }

    render() {
        const className = this.props.display ? "d-flex flex-column flex-sm-row " + this.props.className : "d-none";

        return (
            <div className={className}>
                <Navbar.Text style={{color: "white", marginRight: "20px"}} className="my-auto">NYTimes</Navbar.Text>
                <Switch
                    onChange={this.handleChange}
                    checked={this.props.checked}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    onColor="#028EFC"
                    offColor="#DAD9D8"
                    className="react-switch my-auto"
                    width={53}
                    height={26}
                />
                <Navbar.Text style={{color: "white"}} className="my-auto">Guardian</Navbar.Text>
            </div>
        );
    }
}


export default SourceSwitch;




