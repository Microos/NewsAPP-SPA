const clients = require('./ApiClients');
const post = require('./postProcessors');
const _ = require('lodash');

class ServerFacade {


    constructor() {
        let nytClient = new clients.NYCClient();
        let grdClient = new clients.GRDClient();
        this.mapping = {
            "nyt": nytClient,
            "grd": grdClient
        };
    }


    async getTab(tab, src) {
        const postprocessor = post.tabPostProcessor(src);
        try {
            const api = this.mapping[src];

            console.time(`getTab[GET]:${tab}&${src}`);
            const obj = await api.getTab(tab);
            console.timeEnd(`getTab[GET]:${tab}&${src}`);

            if (obj.status != "ok") return obj;

            obj.content = postprocessor(obj.content).slice(0, 10);
            return obj;

        } catch (e) {
            return {status: "FacadeError:getTab()", err_msg: e, content: null};
        }
    };


    async getArticle(id, src) {
        const postprocessor = post.articlePostProcessor(src);
        try {
            const api = this.mapping[src];
            const obj = await api.getArticle(id, src);
            if (obj.status != 'ok') return obj;
            obj.content = postprocessor(obj.content);
            return obj;
        } catch (e) {
            return {status: "FacadeError: getArticle()", err_msg: e.message, content: null};
        }
    };


    async getSearch(q, src) {
        const postprocessor = post.searchPostProcessor(src);
        try {
            const api = this.mapping[src];
            const obj = await api.getSearch(q);
            if (obj.status != 'ok') return obj;

            obj.content = postprocessor(obj.content);

            return obj;
        } catch (e) {
            return {status: "FacadeError: getSearch()", err_msg: e.message, content: null};
        }
    }
}


// tabs


module.exports = {
    ServerFacade: ServerFacade
};