const key = "54eec2ae34954f99ad268199edc109fd";
const endpoint = "https://api.cognitive.microsoft.com/bing/v7.0/suggestions";


const searchSuggest = (inp, callback) => {

    const handleErrorResponse = (resp) => {
        if (!resp.ok) {
            throw new Error(`[${resp.status}:${resp.statusText}]<=${url}`);
        }
        return resp;
    };
    let url = `${endpoint}?q=${inp}`;
    console.log("fire resq @ " + url);
    fetch(url, {
        method: "GET",
        headers: {
            "Ocp-Apim-Subscription-Key": key
        }
    }).then(handleErrorResponse).then(resp => resp.json())
        .then(
            data => {
                let suggs = data.suggestionGroups[0].searchSuggestions;
                callback(suggs.map(s => s.displayText));
            }
        ).catch((e) => {
        console.error(e);
        callback([]);
    });
};


export default searchSuggest;
