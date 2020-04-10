import {split} from 'sentence-splitter'

function sentenceSplit(text) {
    const sents = text.match(/[^\.!\?]+[\.!\?]+/g);
    for (let i = 0; i < sents.length; i++) {
        if (i == 0) continue;
        if (sents[i].startsWith("\n")) {
            // move leading \n to the previous sentence
            sents[i - 1] += '\n';
            sents[i] = sents[i].substring(1);
        }
    }

    return sents;
}


function sentenceSplitv2(text) {
    let ret = [];
    const sents = split(text);
    console.log('split debug:', sents);
    for (let s of sents) {
        if (s.type == 'Sentence') {
            ret.push(s.raw);
        }
    }
    return ret;
}

export {sentenceSplit, sentenceSplitv2};