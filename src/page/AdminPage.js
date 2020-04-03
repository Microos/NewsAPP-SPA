import React from "react";
import {Button} from "react-bootstrap";
import {favManager, lockrFlush} from "../component/misc/localStorageManager";
import {fireToast} from "../component/misc";

const AdminPage = (props) => {

    const lockrFlushButton = (
        <Button className="mt-3"
                onClick={() => {
                    lockrFlush();
                    fireToast("Cleared all Lockr items.");
                }}>
            Flush Lockr
        </Button>
    );

    const resetFavoritesButton = (
        <Button className="mt-3"
                onClick={() => {
                    favManager.init(true);
                    fireToast("Cleared all favorites.");
                }}>
            Reset Favorites
        </Button>
    );


    return (
        <div className="d-flex flex-column align-items-center">
            {resetFavoritesButton}
            {lockrFlushButton}
        </div>
    )

};


export default AdminPage;