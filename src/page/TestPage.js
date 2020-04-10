import React from "react";
import {LoadingSpinner} from "../component/misc";


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