function buildChains(corpus, chainLength) {
    // Break the corpus into sentences and only take sentences with more than 10
    // characters.
    corpus = corpus.toLowerCase().replace("\n", ".");

    let sentences = corpus.split('.').filter(sentence => sentence.length > 10);

    let chains = {};

    for (var i = 0; i < sentences.length; ++i) {
        parseSentence(sentences[i], chainLength, chains);
    }

    return chains;
}

function parseSentence(sentence, chainLength, chains) {
    // We only want normal people characters (ASCII because we're racist).
    sentence = sentence.replace(/[^a-z^ ]/g, "");

    let tokens = sentence.split(" ").filter(token => token.length > 0);

    // Ignore niggardly sentences with fewer than four words. Who even, amirite? <-- Irony. Heh.
    if (tokens.count < 3) return;

    for (var i = 0; i < tokens.length; ++i) {
        var word = tokens[i],
            prefix = [];

        //addForPrefix([], word, chains);

        // Build the sequence preceeding this word.
        for (var j = Math.min(chainLength, i); j >= 1; --j) {
            prefix.push(tokens[i - j]);
        }
        addForPrefix(prefix, word, chains);
    }
}

function addForPrefix(prefix, word, chains) {
    // Turn the prefix into a string so it makes a good property name.
    prefix = prefix.join(" ");

    // Create an empty object to use as a map if we haven't already.
    if (!chains[prefix]) {
        chains[prefix] = {};
        chains[prefix]['@sum'] = 0;
    }

    // Make sure we have an entry for this word.
    if (!chains[prefix][word]) {
        chains[prefix][word] = 0;
    }

    // Add the count for this word.
    chains[prefix][word]++;
    // Keep track of how many words we've seen.
    chains[prefix]['@sum']++;
}

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

        let corpus = this.corpora[corpusName];
        let sentence = [];

        for (var i = 0; i < length; ++i) {
            sentence.push(this.getNextWord(corpus, sentence));
        }

        return sentence.join(" ");
    }

    getNextWord(corpus, sentence) {
        var lastN = [];
        for (var i = Math.min(corpus.n, sentence.length); i > 0; --i) {
            lastN.push(sentence[sentence.length - i]);
        }

        let options = false;

        let prefix = lastN.join(" ");
        options = corpus.chains[prefix];

        // If we have nowhere, give up.
        if (!options) return "";

        let pick = Math.floor(Math.random() * options['@sum']);
        var runningSum = 0;
        for (var key in options) {
            if (key == '@sum') continue;

            runningSum += options[key];
            if (runningSum >= pick) return key;
        }

        console.log("Pick: " + pick + ", Sum: " + runningSum);
        console.log(options);

        // Should never reach here.
        throw Error("I have no idea what's happening...");
     }
}

module.exports = MarkovGenerator;