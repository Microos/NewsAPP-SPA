import React, {useState} from "react";
import {Navbar, Nav} from "react-bootstrap";
import SearchBox from "./SearchBox";
import NavBookmark from "./NavBookmark";
import SourceSwitch from "./SourceSwitch";
import {LinkContainer as Link} from 'react-router-bootstrap'

const NewsNavBar = (props) => {
    /*
    * props:
    *   - searchText: null (no in search), string (in search state)
    *   - selectedTab: "", "World", "Politics", "Business", "Technology", "Sports", "Bookmark", null if null or in search
    *   - selectedSrc: "grd", "nyt"
    *   - displaySrcSwitch: true, false
    *
    *   - onSourceChange(string of ["grd", "nyt"])
    *   - onSearch(string of search text)
    *   - onTabSelect(string of [Tabs + "Bookmark"])
    * */
    const tabNames = ["", "World", "Politics", "Business", "Technology", "Sports"];
    // const [stSrc, setSrc] = useState("grd");
    // const [curPage, setCurPage] = useState(props.initPage || "Home"); // default Home
    const handleSourceChange = (changeTo) => {
        props.onSourceChange(changeTo ? "grd" : "nyt");
    };

    const handleOnSearch = (text) => {
        props.onSearch(text)
    };
    const handleTabSelect = (e) => {
        props.onTabSelect(e.target.dataset['rbEventKey']);
    };
    const handleBookmarkSelect = (marked) => {
        props.onTabSelect("bookmark");
    };


    return (
        <Navbar className="news-nav-bar py-md-2 py-lg-0" expand="lg" bg="dark" variant="dark">
            <div className='nav-search-box my-auto p-0 mr-2'>
                <SearchBox initText={props.searchText}
                           onSearch={handleOnSearch}/>
            </div>


            <Navbar.Toggle aria-controls="stackable"/>

            <Navbar.Collapse id="stackable">
                <Nav defaultActiveKey={""}>
                    {tabNames.map((tab) => {
                        return (
                            <Link to={"/" + tab.toLowerCase()} key={tab} exact>
                                <Nav.Link className={"mr-3 px-0"}
                                          eventKey={tab.toLowerCase()}
                                          onClick={handleTabSelect}
                                          active={false}>
                                    {(tab == "" ? "Home" : tab)}
                                </Nav.Link>
                            </Link>
                        );

                    })}
                </Nav>
                <Nav className="mr-2 ml-auto">
                    <Link to="/bookmark" exact>
                        <Nav.Link>
                            <NavBookmark
                                onClick={handleBookmarkSelect}
                                marked={props.selectedTab == "bookmark"}
                            />
                        </Nav.Link>
                    </Link>
                    <SourceSwitch checked={props.selectedSrc == "grd"}
                                  className="text-white" display={props.displaySrcSwitch}
                                  onSwitch={handleSourceChange}/>
                </Nav>

            </Navbar.Collapse>
        </Navbar>
    );
};

export default NewsNavBar
