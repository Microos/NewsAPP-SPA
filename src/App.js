import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Switch, Route, Redirect} from 'react-router-dom'
import {useHistory} from "react-router-dom";
import {NewsNavBar} from "./component";
import {
    ArticlePage,
    BookmarkPage,
    TabPage,
    TestPage,
    AdminPage,
    SearchPage,
    ErrorPage
} from "./page";


//TODO: fav icon
//TODO: clean up
//TODO: backend add api endpoint to freevar
function App() {


    const tabNames = ["", "world", "politics", "business", "technology", "sports"];
    //user inputs
    let [searchText, setSearchText] = useState(null);


    //default "" for Home Tab/Page
    // Bookmark, Search
    // Article
    let [curPage, setCurPage] = useState("");

    let [newsSrc, setNewsSrc] = useState(localStorage.getItem("src") || "grd");


    //setters
    const setCurPageWithSearchText = (page, text) => {
        if (curPage != page) setCurPage(page);
        if (page == 'search') {
            if (searchText != text) setSearchText(text);
        } else {
            setSearchText(null);
        }
    };
    const setNewsSrcWithLocalStorage = (value) => {
        localStorage.setItem('src', value);
        setNewsSrc(value);
    };


    // build newsnavbar
    let history = useHistory();
    const handleSearch = (text) => {
        setCurPageWithSearchText('search', text);
        // manually route to search
        history.push(`/search?q=${text}&src=${newsSrc}`);
    };

    const handleTabSelect = (tab) => {
        // clear out search text
        setCurPageWithSearchText(tab);
    };


    const navbarProps = {
        searchText: searchText,
        selectedTab: curPage,
        selectedSrc: newsSrc,
        displaySrcSwitch: !["search", "bookmark", "article"].includes(curPage),

        onSourceChange: setNewsSrcWithLocalStorage,
        onSearch: handleSearch,
        onTabSelect: handleTabSelect
    };
    const newsNavBar = <NewsNavBar {...navbarProps}/>;

    const renderRoutes = () => {
        const tabRoutes = tabNames.map(tab => {
            return <Route key={tab} exact path={"/" + tab}
                          render={() => <TabPage src={newsSrc} tab={tab}
                                                 curPageSetter={setCurPageWithSearchText}/>}/>
        });

        return (
            <Switch>
                {tabRoutes}
                <Route exact path="/bookmark" render={() => {
                    return <BookmarkPage curPageSetter={setCurPageWithSearchText}/>
                }}/>
                <Route exact path='/article' render={({location}) => {

                    const query = new URLSearchParams(location.search); //artId base64encoded
                    let error = false;
                    let msg = [];
                    const src = query.get('src');
                    if (src == null || !['grd', 'nyt'].includes(src)) {
                        error = true;
                        msg.push(`- /article with bad parameter src: [${src}].`);
                    }
                    const artId = query.get('artId');
                    if (artId == null) {
                        error = true;
                        msg.push(`- /article with bad parameter artId: [${artId}].`);
                    }

                    //tag is optional
                    const tag = query.get('tag');

                    if (error) {
                        return <ErrorPage msg={msg}/>
                    }

                    return <ArticlePage src={src} artId={artId} tag={tag}
                                        curPageSetter={setCurPageWithSearchText}/>

                }}/>
                <Route exact path='/search' render={
                    ({location}) => {
                        //TODO: URL validation needed if user modified the URL
                        const query = new URLSearchParams(location.search);
                        let error = false;
                        let msg = [];
                        const q = query.get('q');
                        if (q == null) {
                            error = true;
                            msg.push(`- /search with bad parameter q: [${q}].`);
                        }

                        const src = query.get('src');
                        if (src == null || !['grd', 'nyt'].includes(src)) {
                            error = true;
                            msg.push(`- /search with bad parameter src: [${src}].`);
                        }

                        if (error) {
                            return <ErrorPage msg={msg}/>;
                        }

                        return <SearchPage
                            q={q}
                            src={src}
                            curPageSetter={setCurPageWithSearchText}
                        />;
                    }
                }/>
                <Route exact path='/test' component={TestPage}/>
                <Route exact path='/admin' component={AdminPage}/>
                <Route exact path='/err' render={() => <ErrorPage/>}/>
                <Route exact path='/errtest' render={() => <ErrorPage debug/>}/>
                <Redirect to="/err"/>
            </Switch>
        );
    };


    return (

        <div className="d-flex flex-column">
            {newsNavBar}
            <div className="">
                {renderRoutes()}
            </div>
        </div>
    );


}

export default App;
