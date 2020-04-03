import React, {useState} from 'react'
import {Card, Image, Row, Col} from 'react-bootstrap'
import {IoMdShare} from 'react-icons/io'

import SectionBadge from "./SectionBadge";
import {ShareModal} from "../misc";
import {useHistory} from "react-router-dom";
import Truncate from '@konforti/react-truncate';


const nytImage = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
const grdImage = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";

const ListCard = (props) => {
    /*
    * props:
    *
    *       src: string
    *       title: string
    *       detail: string
    *       imgUrl: string / null
    *       url: string
    *       date: string
    *       tag: string
    *
    *
    *       artId: string -> for get into article Page
    *
    * */
    const [showShare, setShowShare] = useState(false);

    const history = useHistory();


    const imgUrl = props.imgUrl || (props.src == 'grd' ? grdImage : nytImage);

    const handleClick = () => {
        console.log("Card clicked", props.title, props.artId);
        const artId = Buffer.from(props.rawArtId).toString('base64');
        const src = props.src;
        const tag = props.tag;
        history.push(`/article?src=${src}&tag=${tag}&artId=${artId}`);
    };


    return (
        <>
            <ShareModal
                show={showShare}
                title={props.title}
                url={props.url}
                onHide={() => setShowShare(false)}
            />
            <Card className="mt-lg-3 mb-lg-5 mt-3 mb-4 shadow hover-pointer" onClick={handleClick}>
                <Card.Body className="">
                    <Row>
                        <Col lg={3}>
                            <Image src={imgUrl} fluid thumbnail/>
                        </Col>
                        <Col lg={9} className="mt-lg-0 mt-1">
                            <Card.Title className='font-italic'>
                                {props.title}
                                <span className="hover-pointer ml-1" onClick={(e) => {
                                    e.stopPropagation();
                                    setShowShare(true)
                                }}><IoMdShare/></span>
                            </Card.Title>
                            <Card.Text>
                                <Truncate lines={3} ellipsis="...">
                                    {props.detail}
                                </Truncate>

                            </Card.Text>
                            <div className="d-flex justify-content-between">
                                <div className="font-italic ">{props.date}</div>
                                <h5><SectionBadge text={props.tag}/></h5>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>

    );
};


export default ListCard;