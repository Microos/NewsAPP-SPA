import React, {useState} from "react";
import {
    FacebookShareButton,
    TwitterShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    EmailIcon
} from "react-share";
import ReactTooltip from "react-tooltip";

const SocialMediaButton = (props) => {
    const variant = props.variant.toLowerCase(); // 'facebook', 'twitter', 'email'
    const btnSize = props.size;
    const url = props.url;
    const hashtag = props.hashtag || null;
    const tooltipConfig = props.tooltipConfig || {};
    const twHashtag = hashtag ? [hashtag] : null;
    const tooltipId = `share-bt-${variant}`;
    const onClickHideTooltip = () => {
        ReactTooltip.hide();
    };


    let btn = null;
    switch (variant) {
        case 'facebook':
            btn = (
                <FacebookShareButton
                    url={url}
                    hashtag={'#' + hashtag}
                    data-tip
                    data-for={tooltipId}
                    onClick={onClickHideTooltip}
                >
                    <FacebookIcon size={btnSize} round/>
                </FacebookShareButton>
            );
            break;
        case 'twitter':
            btn = (
                <TwitterShareButton
                    url={url}
                    hashtags={twHashtag}
                    data-tip data-for={tooltipId}
                    onClick={onClickHideTooltip}
                >
                    <TwitterIcon size={btnSize} round/>
                </TwitterShareButton>
            );
            break;
        case 'email':
            btn = (
                <EmailShareButton
                    url={url}
                    subject={'#' + hashtag}
                    data-tip data-for={tooltipId}
                    onClick={onClickHideTooltip}
                >
                    <EmailIcon size={btnSize} round/>
                </EmailShareButton>
            );
            break;
        default:
            throw `Unexpected variant value: "${variant}"`;
    }

    return (
        <>
            {btn}
            <ReactTooltip id={tooltipId} effect='solid' {...tooltipConfig} className='py-1 px-2'>
                <span>
                    {variant.slice(0, 1).toUpperCase() + variant.substr(1)}
                </span>
            </ReactTooltip>
        </>
    );
};


export default SocialMediaButton;