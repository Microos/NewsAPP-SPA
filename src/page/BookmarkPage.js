import React, {useState, useEffect} from "react";
import {favManager} from "../component/misc/localStorageManager";
import {Row, Col} from "react-bootstrap";
import TinyCard from "../component/card/TinyCard";


const BookmarkPage = (props) => {

    /*
    * props:
    *
    *
    *
    *   function:
    *     curPageSetter
    * */


    const [favKeys, setFavKeys] = useState(favManager.getKeys());

    useEffect(() => {
        props.curPageSetter('bookmark');
    }, [props.curPageSetter]);

    let titleBar;
    if (favKeys.length == 0) {
        titleBar = (
            <div className='text-center my-2' style={{fontSize: '1.65rem', fontWeight: 'normal'}}>You have not saved
                articles</div>
        );
    } else {
        titleBar = (
            <div className='mx-3 mt-1' style={{color: '#37272b', fontSize: '2rem'}}>
                Favorites
            </div>
        );
    }

    return (
        <>
            {titleBar}
            <div className='d-flex flex-wrap'>
                {favKeys.map((key, idx) => {
                    const data = favManager.getDataByKey(key);
                    return (
                        <Col key={key} xl={3} lg={4} md={6} sm={12} xs={12} className='mb-3'>
                            <TinyCard data={data} updateFavKeys={setFavKeys}/>
                        </Col>
                    )
                })}
            </div>
        </>
    )

};


export default BookmarkPage