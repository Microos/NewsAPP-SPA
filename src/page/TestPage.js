import React from "react";
import {LoadingSpinner} from "../component/misc";
import {ListCard} from "../component/card"
import {ShareModal} from "../component/misc";
import {Card} from "react-bootstrap";
import {CommentBox} from "../component/misc";
import AsyncSelect from "react-select/async/dist/react-select.esm";


const load = (inp, calb) => {
    const x = ['a', 'b', 'c', 'd'];
    calb(x.map(xi => {
        return ({value: xi, label: xi});
    }));
};

const TestPage = ({match, location}) => {

   return <LoadingSpinner show/>

};


export default TestPage;