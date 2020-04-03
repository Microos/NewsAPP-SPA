import {Route, Switch} from "react-router-dom";
import React, {useEffect} from "react";
import {TestPage} from "./src/page";

function App() {
    const [showNavbar, setShowNavbar] = useState(true);

    return (
        <>

            <MyNavBar show={showNavbar}/>
            <Switch>
                <Route exact path='/child' component={() => <ChildPart setter={showNavbar}/>}/>
            </Switch>
        </>
    )
}

function ChildPart(props) {
    useEffect(() => {
        props.setter(false);
    }, [props.setter]);

    return (<div>
        Data here....
    </div>)
}