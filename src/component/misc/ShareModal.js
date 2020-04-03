import React, {useState} from "react";
import {Modal} from "react-bootstrap";
import SocialMediaButton from "./SocialMediaButton";

function ShareModal(props) {

    /*
    * props:
    *   show (optional): true/false
    * */


    // props for all variant
    const title = props.title;
    const url = props.url;

    let variant = props.variant || "listcard";
    variant = variant.toLowerCase();
    if (!["listcard", "favcard", 'searchcard'].includes(variant)) {
        variant = "listcard";
    }

    let cardTitle;
    if (variant == 'listcard' || variant == 'searchcard') {
        cardTitle = (<Modal.Title style={{fontSize: "1.15rem"}} className="font-weight-normal">
            {title}
        </Modal.Title>);
    } else if (variant == 'favcard') {
        cardTitle = (
            <div className="d-flex flex-column">
                <Modal.Title>{props.srcName.toUpperCase()}</Modal.Title>
                <Modal.Title style={{fontSize: "1.15rem"}} className="font-weight-normal">
                    {title}
                </Modal.Title>
            </div>
        );
    }


    const hashtag = "CSCI_571_NewsApp";

    const btnSize = 55;
    return (
        <Modal show={props.show} onHide={() => props.onHide()}>
            <Modal.Header closeButton>
                {cardTitle}
            </Modal.Header>


            <Modal.Body>
                <div className="d-flex flex-column ">
                    <div className='mx-auto mb-2'>Share via</div>
                    <div className="d-flex justify-content-around">
                        {['facebook', 'twitter', 'email'].map(v => {
                            return (
                                <SocialMediaButton
                                    key={v}
                                    variant={v}
                                    size={btnSize}
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

                </div>


            </Modal.Body>

        </Modal>
    );

}

export default ShareModal;
