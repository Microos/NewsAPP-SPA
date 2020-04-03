const _ = require('lodash');
const strickKeysCheck = (ret, ks) => {
    ks.map(k => {
        if (!ret[k])
            throw new Error(`bad value for key-value: ${k}-[${ret[k]}]`);
    })
};

const tabPostProcessor = (src) => {
    let name = src + ' tab postprocessor';

    // keys
    const looseKeys = ['imageUrl']; //allow null
    const striclKeys = ['title', 'section', 'date', 'description', 'url', 'artId'];

    if (src == 'grd') {
        return (arr) => {
            let processedArr = arr.map(o => {
                let ret = {};
                try {
                    ret['title'] = o['webTitle'];
                    ret['section'] = o['sectionId'];
                    ret['date'] = o['webPublicationDate'].slice(0, 10);

                    ret['description'] = o.blocks.body[0].bodyTextSummary;
                    ret['url'] = o['webUrl'];
                    ret['artId'] = o['id'];

                    //check if any bad results
                    strickKeysCheck(ret, striclKeys);
                } catch (e) {
                    console.error(`${name}: ${e} => item will not be included.`);
                    return null;
                }

                //image allow null
                try {
                    let assets = o.blocks.main.elements[0].assets;
                    ret['imageUrl'] = assets[assets.length - 1].file;
                } catch (e) {
                    console.error(`${name}: ${e} => use null for image`);
                    ret['imageUrl'] = null;
                }

                return ret;
            });


            return _.filter(processedArr, (o) => {
                return o != null;
            });
        }
    } else if (src == 'nyt') {
        return (arr) => {
            let processedArr = arr.map(o => {
                let ret = {};

                try {
                    ret['title'] = o['title'];
                    ret['section'] = o['section'];
                    ret['date'] = o['published_date'].slice(0, 10);
                    ret['description'] = o['abstract'];
                    ret['url'] = o['url'];
                    ret['artId'] = o['url'];
                    //check if any bad results
                    strickKeysCheck(ret, striclKeys);
                } catch (e) {
                    console.error(`${name}: ${e} => item will not be included.`);
                    return null;
                }

                // image allow null
                try {
                    let img = null;
                    for (let imgObj of (o.multimedia || [])) {
                        if (imgObj.type == 'image' && imgObj.url && imgObj.width >= 2000) {
                            img = imgObj.url;
                            break;
                        }
                    }
                    ret['imageUrl'] = img;

                } catch (e) {
                    console.error(`${name}: ${e} => use null for image`);
                    ret['imageUrl'] = null;
                }
                return ret;
            });

            return _.filter(processedArr, (o) => {
                return o;
            });

        }
    }

};
const articlePostProcessor = (src) => {
    let name = src + ' article postprocessor';
    const strickKeys = ['title', 'imageUrl', 'date', 'description', 'section']; //section needed for bookmark


    const grd = (content) => {
        let ret = {};
        ret['title'] = content.webTitle;
        try {
            const assets = content.blocks.main.elements[0].assets;
            ret['imageUrl'] = assets[assets.length - 1].file;
        } catch (e) {
            console.error(`Error when try to get image: [${e}]; => use null for imageUrl`);
            ret['imageUrl'] = null;
        }
        //date : 2020-03-26T21:43:01Z
        ret['date'] = content.webPublicationDate.slice(0, 10);
        ret['description'] = content.blocks.body[0].bodyTextSummary;
        ret['section'] = content['sectionName'];
        return ret;
    };

    const nyt = (content) => {
        let ret = {};
        ret['title'] = content.headline.main;
        // imageUrl: pick the first image with width >= 2000
        try {
            ret['imageUrl'] = null;
            const imgObjs = content.multimedia;
            for (let i = 0; i < imgObjs.length; i++) {
                const imgObj = imgObjs[i];
                if (imgObj.width >= 2000) {
                    ret['imageUrl'] = imgObj.url;
                    if (!ret['imageUrl'].startsWith('http')) {
                        ret['imageUrl'] = "https://nyt.com/" + ret['imageUrl'];
                    }
                    break;
                }
            }

            if (ret['imageUrl'] == null)
                throw "Did not find an image with width >= 2000"


        } catch (e) {
            console.error(`Error when try to get image: [${e}]; => use null for imageUrl`);
            ret['imageUrl'] = null;
        }
        //date: 2020-03-26T04:11:05+0000
        ret['date'] = content.pub_date.slice(0, 10);
        ret['description'] = content.abstract;
        ret['section'] = content['section_name'];
        return ret;


    };

    if (src == 'grd') return grd;
    else return nyt;

};


const searchPostProcessor = (src) => {
    let name = src + ' search postprocessor';
    const strickKeys = ['title', 'imageUrl', 'date', 'section', 'url', 'artId']; //section needed for bookmark

    const grd = (content) => {
        return content.map(o => {
            let ret = {};
            ret['title'] = o['webTitle'];
            ret['date'] = o['webPublicationDate'].slice(0, 10);
            ret['artId'] = o['id'];

            //section may miss: undefined/"";
            ret['section'] = o['sectionId'] || null;
            ret['url'] = o['webUrl'];


            // imageUrl
            try {
                const assets = o.blocks.main.elements[0].assets;
                ret['imageUrl'] = assets[assets.length - 1].file;
            } catch (e) {
                ret['imageUrl'] = null;
            }

            return ret;
        });
    };

    const nyt = (content) => {
        return content.map(o => {
            let ret = {};

            ret['title'] = o.headline.main;

            //news deck can be "None"
            ret['section'] = o['news_desk'] || null;
            if (!ret['section'] || ret['section'].toLowerCase() == 'none')
                ret['section'] = null;


            ret['date'] = o['pub_date'].slice(0, 10);
            ret['artId'] = o['web_url']; //TODO: this inconsistent with 'url' in getTab()
            ret['url'] = o['web_url'];
            try {
                ret['imageUrl'] = null;
                const imgObjs = o['multimedia'];
                let maxW = -1;
                for (let imgObj of imgObjs) {
                    if (imgObj.type != 'image') continue;
                    maxW = Math.max(maxW, imgObj.width);
                    if (imgObj.width >= 2000) {
                        ret['imageUrl'] = imgObj.url;
                        if (!ret['imageUrl'].startsWith('http')) {
                            ret['imageUrl'] = "https://nyt.com/" + ret['imageUrl'];
                        }
                        break;
                    }
                }
                if (ret['imageUrl'] == null)
                    throw `Did not find an image with width >= 2000; Max width: ${maxW}`;

            } catch (e) {
                console.error(`Error when try to get image: [${e}]; => use null for imageUrl`);
                ret['imageUrl'] = null;
            }


            return ret;
        });
    };

    if (src == 'grd') return grd;
    else return nyt;

};

module.exports = {
    tabPostProcessor: tabPostProcessor,
    articlePostProcessor: articlePostProcessor,
    searchPostProcessor: searchPostProcessor

};