import React, {useEffect, useState} from "react";
import {getSearch} from "../component/misc/api";
import {LoadingSpinner} from "../component/misc";
import TinyCard from "../component/card/TinyCard";
import {Col} from "react-bootstrap";

const nytImage = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
const grdImage = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";

const SearchPage = (props) => {
    const q = props.q;
    const src = props.src;
    const [data, setData] = useState(null);


    const loadData = async () => {
        const obj = await getSearch(q, src);
        //TODO: status != ok
        if (obj.status != 'ok') {
            console.error(obj);
            return;
        }
        setData(obj.content);
    };


    useEffect(() => {
        props.curPageSetter('search', q);
        setData(null);
    }, [q, src]);

    useEffect(() => {
        if (data == null) {
            loadData();
        }
    }, [data]);


    const renderCards = () => {
        return data.map(d => {
            d.artId = Buffer.from(d.artId).toString('base64');
            d.src = src;
            if (d.imageUrl == null) d.imageUrl = (src == 'grd' ? grdImage : nytImage);


            return(
                <Col key={d.artId} xl={3} lg={4} md={6} sm={12} xs={12} className='mb-3'>
                    <TinyCard variant='searchcard' data={d}/>
                </Col>);
        });
    };

    if (data == null) {
        return <LoadingSpinner show/>
    } else {
        if (data.length == 0) {
            return (<div className='text-center my-2' style={{fontSize: '1.65rem', fontWeight: 'normal'}}>
                No results for keyword "{q}"</div>);
        }
        return (<>
            <div className='mx-3 mt-1' style={{color: '#37272b', fontSize: '2rem'}}>
                Results
            </div>
            <div className='d-flex flex-wrap'>
                {renderCards()}
            </div>
        </>);
    }


};


export default SearchPage;