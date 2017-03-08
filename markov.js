function buildChains(corpus, chainLength) {
    // Break the corpus into sentences and only take sentences with more than 10
    // characters.
    corpus = corpus.toLowerCase();
    let sentences = corpus.split('.').filter(sentence => sentence.length > 10);
    let tokens = corpus.split(" ");

    let sequences = {};

    for (var i = 0; i < sentences.length; ++i) {
        parseSentence(sentences[i], chainLength, sequences);
    }

    return sequences;
}

function parseSentence(sentence, chainLength, sequences) {
    // We only want normal people characters (ASCII because we're racist).
    sentence = sentence.replace(/[^\w^ ][]/g, "");

    let tokens = sentence.split(" ");

    for (var i = 0; i < tokens.length; ++i) {
        var word = tokens[i],
            sequence = [];

        // Build the sequence preceeding this word.
        for (var j = Math.min(chainLength, i - 1); j >= 1; --j) {
            sequence.push(tokens[i - j]);
        }

        // Turn the sequence into a string so it makes a good property name.
        sequence = sequence.join(" ");

        // Create an empty object to use as a map if we haven't already.
        if (!sequences[sequence]) {
            sequences[sequence] = {};
        }

        // Make sure we have an entry for this word.
        if (!sequences[sequence][word]) {
            sequences[sequence][word] = 0;
        }

        // Add the count for this word.
        sequences[sequence][word]++;
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
            n: n
        };
    }

    generate(corpusName, length) {

    }
}