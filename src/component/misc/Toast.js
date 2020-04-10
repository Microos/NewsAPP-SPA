import React from 'react';
import {toast, Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const css = {
    color: 'black',
    fontSize: '0.75rem'
};

const conf = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    transition: Zoom
};
toast.configure(conf);

const fireToast = (text) => {
    const div = (
        <div style={css}>
            {text}
        </div>
    );
    toast(div);
};

export default fireToast;