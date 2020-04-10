import React, {useState} from 'react'
import {Card, Row, Col, Image} from 'react-bootstrap'
import {IoMdShare, IoMdTrash} from 'react-icons/io'
import SectionBadge from "./SectionBadge";
import ReactTooltip from "react-tooltip";
import {favManager} from "../misc/localStorageManager";
import {fireToast} from "../misc";
import ShareModal from "../misc/ShareModal";
import {useHistory} from 'react-router-dom'

const handleBtnOnClick = (e, func) => {
    ReactTooltip.hide();
    if (e) e.stopPropagation();
    if (func) func();
};
const ShareButton = (props) => {
    const tooltipId = 'share-btn-' + props.id;
    return (
        <>
            <span
                onClick={(e) => handleBtnOnClick(e, props.onClick)}
                className='hover-pointer'
                data-tip={true}
                data-for={tooltipId}
            >
                <IoMdShare/>
            </span>

            <ReactTooltip
                id={tooltipId}
                effect='solid'
                offset={{top: -8}}
                className='py-1 px-2'
                place='top'>
                Share
            </ReactTooltip>
        </>
    );
};

const RemoveButton = (props) => {
    const tooltipId = 'remove-btn-' + props.id;
    return (
        <>
            <span
                onClick={(e) => handleBtnOnClick(e, props.onClick)}
                className='hover-pointer'
                data-tip={true}
                data-for={tooltipId}
            >
                <IoMdTrash/>
            </span>
            <ReactTooltip
                id={tooltipId}
                effect='solid'
                offset={{top: -8}}
                className='py-1 px-2'
                place='top'>
                Remove
            </ReactTooltip>
        </>
    );
};


const TinyCard = (props) => {
    let variant = props.variant || 'favcard';
    variant = variant.toLowerCase();

    const data = props.data;


    const artId = data.artId; //b64 encoded
    const srcName = data.src == 'nyt' ? "NYTIMES" : "GUARDIAN";
    const title = data.title;
    const section = data.section;
    const url = data.url;
    const imgUrl = data.imageUrl;
    const date = data.date;


    const [showShare, setShowShare] = useState(false);

    const history = useHistory();
    const cardOnClick = (src, section, artId) => {

        history.push(`/article?src=${src}&tag=${section}&artId=${artId}`);
    };


    let badges, removeBtn;
    if (variant == 'favcard') {
        badges = (
            <>
                <SectionBadge text={section} fontSize="0.95rem" className='mr-1'/>
                <SectionBadge text={srcName} fontSize="0.95rem"/>
            </>
        );

        const updateFavKeys = props.updateFavKeys;
        removeBtn = <RemoveButton id={artId} onClick={() => {
            favManager.removeFavorite(artId);
            fireToast('Removing ' + title);
            updateFavKeys(favManager.getKeys());
        }}/>;


    } else { //search card
        badges = (
            <>
                <SectionBadge text={section}/>
            </>
        );
        removeBtn = <></>;
    }


    return (
        <>
            <ShareModal
                variant='favcard'
                show={showShare}
                title={title}
                url={url}
                srcName={srcName}
                onHide={() => setShowShare(false)}
            />
            <Card className='shadow'
                  style={{minHeight: '20.5rem'}}
                  onClick={() => cardOnClick(data.src, section, artId)}>

                <Card.Body className='d-flex flex-column justify-content-between'>
                    <Card.Title className='font-italic font-weight-bold'
                                style={{fontSize: '0.90rem', minHeight: '2rem'}}>
                        <span className='mr-1'>{title}</span>
                        <span style={{fontStyle: "normal"}}>
                        <ShareButton id={artId} onClick={() => {
                            setShowShare(true)
                        }}/>
                            {removeBtn}
                        </span>
                    </Card.Title>
                    <Image src={imgUrl} fluid thumbnail className=''/>
                    <Row className='mt-2 d-flex flex-row justify-content-between align-items-center'>
                        <Col className='pr-0'>
                            <span className="font-italic my-auto" style={{fontSize: '0.9rem'}}>
                            {date}
                            </span>
                        </Col>

                        <Col className='d-flex flex-row justify-content-end pl-0'>
                            {badges}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    );

};


export default TinyCard;