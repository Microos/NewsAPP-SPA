let config = require('./config.json');

const axios = require('axios');

/*
* Response json from Client:
*   status: 'ok' | type of error;
*   err_msg: null | 'detailed error message';
*   content: response body | null;
* */

class ApiClient {
    constructor(key) {
        this.apiKey = key;
        this.tabs = [];

    }

    getErrorResponse(errType, errMsg) {
        return {status: errType, err_msg: errMsg, content: null};
    }

    validateTab(tab) {
        if (!this.tabs.includes(tab)) {
            return [false, this.getErrorResponse('ApiParamError', `tab:[${tab}] is not valid.`)];
        }
        return [true, null];
    }
}


class NewYorkTimesClient extends ApiClient {
    constructor(key = config.nytKey) {
        super(key);
        this.name = 'NewYorkTimesClient';
        this.tabs = ['home', 'world', 'politics', 'business', 'technology', 'sports'];
        this.baseUrl = 'https://api.nytimes.com/svc/topstories/v2';


    }

    constructRespError(err) {
        let retFallback = this.getErrorResponse(err.name, err.message);
        let resp = err.response;
        if (!resp) return retFallback;


        try {
            let data = resp.data;

            if (typeof (data) == "string") {
                return this.getErrorResponse('NYTApiError', `[${resp.status}:${resp.statusText}] ${data}.`);
            } else if (data.fault && data.fault.faultstring) {
                return this.getErrorResponse('NYTApiError', `[${resp.status}:${resp.statusText}] ${data.fault.faultstring}.`);
            }


        } catch (e) {
            return retFallback;
        }
        return retFallback;
    }

    getTab(tab) {
        let [ok, msg] = this.validateTab(tab);
        if (!ok) return Promise.resolve(msg);
        let url = `${this.baseUrl}/${tab}.json?api-key=${this.apiKey}`;

        console.log('api GET: ' + url);

        return axios.get(url).then((resp) => {
            return {status: 'ok', err_msg: null, content: resp.data.results};
        }).catch(err => {
            return this.constructRespError(err);
        });
    }


    async getArticle(id) {
        const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("${id}")&api-key=${this.apiKey}`;
        try {
            console.log('api GET: ' + url);
            const resp = await axios.get(url);

            const ctnt = resp.data.response.docs;
            if (!ctnt || (Array.isArray(ctnt) && !ctnt.length)) {
                throw {name: "NYTRespError", message: "Response with empty results"};
            }

            return {status: 'ok', err_msg: null, content: ctnt[0]};
        } catch (err) {
            return this.constructRespError(err);
        }
    }


    async getSearch(q) {
        const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${q}&api-key=${this.apiKey}`;
        try {
            console.log('api GET: ' + url);
            const resp = await axios.get(url);
            return {status: 'ok', err_msg: null, content: resp.data.response.docs};
        } catch (e) {
            return this.constructRespError(err);
        }
    }
}

class GuardianClient extends ApiClient {
    constructor(key = config.grdKey) {
        super(key);
        this.name = 'Guardian Client';
        this.tabs = ['home', 'world', 'politics', 'business', 'technology', 'sport'];
        this.homeUrl = `https://content.guardianapis.com/search?api-key=${this.apiKey}&section=(sport|business|technology|politics)&show-blocks=all`;
        this.tabUrl = 'https://content.guardianapis.com';

    }


    getTab(tab) {
        tab = tab == "sports" ? "sport" : tab;


        let [ok, msg] = this.validateTab(tab);
        if (!ok) return Promise.resolve(msg);

        let pms;

        // console.log('GET guardian tab: ' + tab);
        if (tab == 'home') {
            pms = axios.get(this.homeUrl);
        } else {
            pms = axios.get(`${this.tabUrl}/${tab}`, {
                params: {'show-blocks': 'all', 'api-key': this.apiKey}
            });
        }

        pms = pms.then((resp) => {
            return {status: 'ok', err_msg: null, content: resp.data.response.results};
        }).catch((err) => {
            let retFallback = this.getErrorResponse(err.name, err);
            let resp = err.response;
            if (!resp) return retFallback;


            if (resp.data) {
                let data = resp.data;
                return this.getErrorResponse('GRDApiError:tab', `[${resp.status}:${resp.statusText}] ${data.message}.`);
            }

            return retFallback;

        });

        return pms;
    }

    async getArticle(id) {
        const url = `https://content.guardianapis.com/${id}?api-key=${this.apiKey}&show-blocks=all`;
        try {
            console.log('api GET: ' + url);
            const resp = await axios.get(url);
            return {status: 'ok', err_msg: null, content: resp.data.response.content};

        } catch (e) {
            return {status: 'GRDApiError:article', err_msg: e.message, content: null};
        }
    }

    async getSearch(q) {
        const url = `https://content.guardianapis.com/search?q=${q}&api-key=${this.apiKey}&show-blocks=all`;
        try {
            console.log('api GET: ' + url);
            const resp = await axios.get(url);
            return {status: 'ok', err_msg: null, content: resp.data.response.results};
        } catch (e) {
            return {status: 'GRDApiError:search', err_msg: e.message, content: null};
        }


    }
}

module.exports = {
    NYCClient: NewYorkTimesClient,
    GRDClient: GuardianClient
};