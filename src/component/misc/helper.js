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





export {sentenceSplit};