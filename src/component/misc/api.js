import axios from 'axios'


const getTab = async (tab, src) => {
    const tabApi = '/api/tab';
    // 'title',
    // 'section',
    // 'date',
    // 'description',
    // 'imageUrl'

    const url = tabApi + `?tab=${tab}&src=${src}`;
    console.log('Api:getTab', url);
    const resp = await axios.get(url);
    //TODO: if status != ok
    return resp.data;
};


const getArticle = async (artId, src) => {
    const artApi = '/api/article';
    const url = artApi + `?artId=${artId}&src=${src}`;
    console.log('Api:getArticle', url);
    const resp = await axios.get(url);
    //TODO: if status != ok
    return resp.data;
};


const getSearch = async (q, src) => {
    const searchApi = '/api/search';
    const url = searchApi + `?q=${q}&src=${src}`;
    console.log('Api:getSearch', url);
    const resp = await axios.get(url);

    return resp.data;

};


export {getTab, getArticle, getSearch};