import React from "react";
import {BounceLoader} from "react-spinners";

const LoadingSpinner = (props) => {


    const display = props.show ? "d-flex " : "d-none ";
    const text = props.text || "Loading";
    return (
        <div className={display + "spinner flex-column justify-content-center"}>
            <div className="mx-auto">
                <BounceLoader
                    size={props.size || 60}
                    color={"#304fd1"}
                    loading={props.show}
                />
            </div>
            <div className="mx-auto"><h3>{text}</h3></div>
        </div>
    );
};


export default LoadingSpinner;