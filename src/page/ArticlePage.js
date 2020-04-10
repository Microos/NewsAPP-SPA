import React, {useState, useEffect} from "react";
import {getArticle} from "../component/misc/api";
import {LoadingSpinner, FavoriteButton} from "../component/misc";
import {Accordion, Card, Row, Col} from "react-bootstrap";
import {favManager} from "../component/misc/localStorageManager";
import {sentenceSplitv2} from "../component/misc/helper";
import {useAccordionToggle} from 'react-bootstrap/AccordionToggle';
import {IoIosArrowUp, IoIosArrowDown} from 'react-icons/io'
import {SocialMediaButton} from "../component/misc";
import {CommentBox} from "../component/misc";
import {fireToast} from "../component/misc";
import {animateScroll as scroll} from 'react-scroll';

const ArrowToggle = ({eventKey, expanded, onClick}) => {
    const toggleOnclick = useAccordionToggle(eventKey, () => {

        onClick();
    });

    const icon = expanded ? <IoIosArrowUp/> : <IoIosArrowDown/>;


    return (
        <div onClick={toggleOnclick} style={{fontSize: '1.35rem', fontWeight: 'bold'}}>
            {icon}
        </div>
    )
};

const ArticlePage = (props) => {
    const nytImage = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
    const grdImage = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";

    const artId = props.artId; // base64 encoded
    const src = props.src;


    //for media sharing
    let url = Buffer.from(artId, 'base64').toString('utf8');
    if (src == 'grd')
        url = "https://www.theguardian.com/" + url;

    const hashtag = "CSCI_571_NewsApp";
    const shareBtnSize = 33;

    const [data, setData] = useState(null);
    const [fav, setFav] = useState(favManager.isFavorite(artId));


    const favBtnOnClick = () => {
        //show toast
        const action = fav ? "Removing" : "Saving";
        fireToast(action + ' ' + data.title);

        //add/remove bookmark
        if (!fav) {
            favManager.addFavorite(artId, {
                artId: artId,
                src: src,
                url: url,
                title: data.title,
                // using data section when props.tag is missing. But this is not consistent for NYT source
                section: props.tag || data.section,
                imageUrl: data.imageUrl || (props.src == 'grd' ? grdImage : nytImage),
                date: data.date
            });
        } else {
            favManager.removeFavorite(artId);
        }

        //change marked state
        setFav(!fav);
    };

    useEffect(() => {
        async function loadData() {
            console.log(`Article Page Init: [${artId}] [${src}]`);
            const obj = await getArticle(artId, src);
            //TODO: status != ok: e.g. user change nyt to xyz
            if (obj.status != 'ok') {
                console.error(obj);
                return;
            }
            setData(obj.content);
        }


        setData(null);
        loadData();
    }, [props.artId, props.src]);

    useEffect(() => {
        props.curPageSetter("article");
    }, []);

    const [expanded, setExpanded] = useState(false);
    const renderDescription = () => {
        // if description > 4 sentences/6 lines, add a toggle;
        const threshold = 4;
        const text = data.description;
        // const sents = sentenceSplit(text);
        const sents = sentenceSplitv2(text);

        //
        // if (sents.length > 4 && !expanded) {
        //     const puncts = sents[3].match(/\W$/);
        //     if (puncts.length > 0) {
        //         sents[3] = sents[3].substr(0, sents[3].length - 1) + '...';
        //     } else {
        //         sents[3] = sents[3] + '...';
        //     }
        // }

        const cardText = (
            <div className="multiline-text mt-1 mb-1">
                {sents.slice(0, 4).join(" ")}
            </div>
        );

        let toggle = (<></>);
        if (sents.length > threshold) {
            toggle = (
                <div>
                    <Accordion.Collapse eventKey="extra-text">
                        <Card.Text className="multiline-text mt-3">
                            {sents.slice(4).join(" ")}
                        </Card.Text>
                    </Accordion.Collapse>
                    <div className='d-flex justify-content-end hover-pointer'>
                        <ArrowToggle eventKey="extra-text" expanded={expanded} onClick={() => {
                            if (!expanded) scroll.scrollToBottom({duration: '1200'});
                            setExpanded(!expanded);
                        }}/>

                    </div>
                </div>
            );
        }


        return (
            <>
                {cardText}
                {toggle}
            </>


        );

    };


    const renderCard = () => {
        const imgUrl = data.imageUrl || (props.src == 'grd' ? grdImage : nytImage);
        return (
            <Accordion className='shadow m-3'>
                <Card>
                    <Card.Body className='d-flex flex-column'>
                        <Card.Title className='font-italic font-weight-normal article-title-fontsize'>
                            {data.title}
                        </Card.Title>

                        <Row className="mx-2 mb-2 d-flex align-items-center justify-content-between">

                            <Col xl={10} lg={10} md={9} sm={9} xs={6} className='p-0'>
                                <div className='font-italic' style={{fontSize: '1.3rem'}}>{data.date}</div>
                            </Col>
                            <Col xl={2} lg={2} md={3} sm={3} xs={6} className='p-0'>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex">

                                        {['facebook', 'twitter', 'email'].map(v => {
                                            return (
                                                <SocialMediaButton
                                                    key={v}
                                                    variant={v}
                                                    size={shareBtnSize}
                                                    url={url}
                                                    hashtag={hashtag}
                                                    tooltipConfig={
                                                        {
                                                            offset: {'top': -3}
                                                        }
                                                    }
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className='hover-pointer'>
                                        <FavoriteButton marked={fav} onClick={favBtnOnClick}/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Card.Img src={imgUrl}/>

                        {renderDescription()}
                    </Card.Body>
                </Card>
            </Accordion>


        );
    };
    const rendeCommentBox = () => {

        return (
            <div className='m-3'>
                <CommentBox artId={artId}/>
            </div>
        );
    };

    const render = () => {

        if (data == null) {
            return <LoadingSpinner show/>
        } else {
            return (
                <>
                    {renderCard()}
                    {rendeCommentBox()}
                </>
            );
        }
    };

    return render();
};


export default ArticlePage;