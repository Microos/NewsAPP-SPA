import React, {useState, useEffect} from "react";
import {useHistory} from 'react-router-dom';
import {HashLoader} from "react-spinners";

const ErrorPage = (props) => {
    const [time, setTime] = useState(3);

    const history = useHistory();
    useEffect(() => {
        setTimeout(() => {
            if (time > 0) {
                setTime(time - 1);
            } else {
                if (!props.debug) {
                    history.push('/');
                }
            }
        }, 1000);
    });


    const renderErrorMessage = () => {
        if (!props.msg) return;
        return props.msg.map(m => {
                return (<div key={m} className='text-center'><samp>{m}</samp><br/></div>);
            }
        )
    };

    return (
        <div className='d-flex flex-column mt-5'>
            <div className='mx-auto mt-3'>
                <HashLoader
                    size={60}
                    color={"#2b9efd"}
                    loading={true}
                />

            </div>

            <h2 className='mx-1 mt-2 text-center'>Your input URL is incorrect :(
            </h2>
            <div className='mx-1 text-center' style={{fontSize: '1.25rem', fontWeight: 'normal'}}>Redirect you to
                home page
                in {time}s
            </div>
            <div className='mx-auto mt-3 p-1' style={{backgroundColor: "#FDF2F4", fontSize: "0.8rem"}}>
                {renderErrorMessage()}
            </div>
        </div>
    )

};


export default ErrorPage;