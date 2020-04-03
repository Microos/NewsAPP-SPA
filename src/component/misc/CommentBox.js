import React, {useEffect} from 'react';
import commentBox from 'commentbox.io';
import sha256 from 'js-sha256';

const projId = '5729777675665408-proj';

// hash is needed when base64 encoded string too long.
const sha256Hexdigest = (s) => {
    let hash = sha256.create();
    hash.update(s);
    return hash.hex();
};

const CommentBox = ({artId}) => {

    let boxHandle = null;
    const hashId = sha256Hexdigest(artId);
    useEffect(() => {
        boxHandle = commentBox(projId);
    }, []);

    useEffect(() => {
        return () => {
            if (boxHandle) boxHandle();
        };
    }, []);

    return (
        <>
            < div className="commentbox" id={hashId}/>
        </>

    );

};

export default CommentBox;