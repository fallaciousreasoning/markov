function buildChains(corpus, chainLength) {
    // Break the corpus into sentences and only take sentences with more than 10
    // characters.
    corpus = corpus.toLowerCase();
    let sentences = corpus.split('.').filter(sentence => sentence.length > 10);
    let tokens = corpus.split(" ");

    let chains = {};

    for (var i = 0; i < sentences.length; ++i) {
        parseSentence(sentences[i], chainLength, chains);
    }

    return chains;
}

function parseSentence(sentence, chainLength, chains) {
    // We only want normal people characters (ASCII because we're racist).
    sentence = sentence.replace(/[^\w^ ][]/g, "");

    let tokens = sentence.split(" ").filter(token => token.length > 0);

    for (var i = 0; i < tokens.length; ++i) {
        var word = tokens[i],
            sequence = [];

        // Build the sequence preceeding this word.
        for (var j = Math.min(chainLength, i); j >= 1; --j) {
            sequence.push(tokens[i - j]);
        }

        // Turn the sequence into a string so it makes a good property name.
        sequence = sequence.join(" ");

        // Create an empty object to use as a map if we haven't already.
        if (!chains[sequence]) {
            chains[sequence] = {};
            chains[sequence]['@sum'] = 0;
        }

        // Make sure we have an entry for this word.
        if (!chains[sequence][word]) {
            chains[sequence][word] = 0;
        }

        // Add the count for this word.
        chains[sequence][word]++;
        // Keep track of how many words we've seen.
        chains[sequence]['@sum']++;
    }
}

console.log(buildChains("Hello World This is an example sentence that I am quite proud of because it is a work of art and exceedingly clever. Or something like that....", 2));

class MarkovGenerator {
    constructor() {
        this.corpora = {};
    }

    addCorpus(name, corpus, n) {
        n = n || 2;

        this.corpora[name] = {
            corpus: corpus,
            n: n,
            chains: buildChains(corpus, n)
        };
    }

    generate(corpusName, length) {
        if (!this.corpora[corpusName]) return "That is not a thing (no such corpus).";

        for (var i = 0; i < length; ++i) {

        }
    }
}