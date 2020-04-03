import React, {useState, useEffect} from "react";
import {LoadingSpinner} from "../component/misc";
import {ListCard} from "../component/card";
import {getTab} from "../component/misc/api";


const renderCards = (data, src) => {
    return (
        <div className='container-fluid'>
            {
                data.map(d => {
                    return (<ListCard
                        key={d.title}
                        src={src}
                        title={d.title}
                        detail={d.description}
                        imgUrl={d.imageUrl}
                        url={d.url}
                        date={d.date}
                        tag={d.section}
                        rawArtId={d.artId}
                    />);
                })
            }

        </div>
    );
};

const TabPage = (props) => {
    /*
   * props:
   *   tab
   *   src
   * */
    const [data, setData] = useState(null);
    const tab = props.tab == "" ? "home" : props.tab;
    const src = props.src;

    const loadData = async () => {

        const obj = await getTab(tab, src);
        if (obj.status != 'ok') {
            //TODO: action on error
            console.error(obj);
            return;
        }
        setData(obj.content);
    };
    useEffect(() => {
        //on change re-render
        props.curPageSetter(props.tab);
        setData(null);

    }, [props.src, props.tab]);

    useEffect(() => {
        if (data == null) {
            //ondata set to null: reload data
            loadData();
        }
    }, [data]);


    if (data == null) {
        return <LoadingSpinner show/>
    } else {
        return renderCards(data, src);
    }
};


export default TabPage;