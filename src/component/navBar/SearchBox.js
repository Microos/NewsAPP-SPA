import React, {useEffect} from "react";
import AsyncSelect from 'react-select/async';
import searchSuggest from "./searchSuggest";
import {debounce} from "underscore";


const loadSuggestions = (inputValue, callback) => {
    searchSuggest(inputValue, (values) => {

        // prepend input
        if (values.length == 0 || values[0] != inputValue)
            values.unshift(inputValue);
        callback(values.map(a => {
            return {label: a, value: a};
        }));

    });

};
const debouncedLoadSuggestions = debounce(loadSuggestions, 1000);


function SearchBox(props) {


    //on input -> reflect on input box


    useEffect(() => {
    }, [props.initText]);


    //on input
    const handleInputChange = (value, {action}) => {

    };

    //on search
    const handleChange = (value, info) => {
        if (info.action == "select-option") {
            const text = value.value;

            // setUserInput(text);
            props.onSearch(text);
        }
    };

    //on key down
    //https://reactjs.org/docs/events.html#keyboard-events
    const handleKeyDown = (e) => {
        if (e.key == "Enter")
            console.log("keydown: " + e.key);
    };


    //https://react-select.com/props#async-props
    const rsProps = {
        cacheOptions: true,
        placeholder: "Enter Keyword ..",
        loadOptions: debouncedLoadSuggestions,
        onInputChange: handleInputChange,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        noOptionsMessage: (() => "No Match"),
    };

    if (props.initText) {
        rsProps.value = {label: props.initText, value: props.initText};
    } else {
        rsProps.value = null;
    }

    return (
        <AsyncSelect {...rsProps}/>
    );

}

export default SearchBox;