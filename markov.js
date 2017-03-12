const fixCapitalisation = sentences => {
    for (let i = 0; i < sentences.length; i++) {
        sentences[i][0] = sentences[i][0].charAt(0).toUpperCase() + sentences[i][0].slice(1);
        for (let j = 0; j < sentences[i].length; j++) {
            switch (sentences[i][j].trim()) {
                case 'i':
                    sentences[i][j] = 'I';
                    break;
                case 'ill':
                    sentences[i][j] = "I'll";
                    break;
                case 'dont':
                    sentences[i][j] = "don't";
                    break;
                case 'wont':
                    sentences[i][j] = "won't";
                    break;
                case 'shouldnt':
                    sentences[i][j] = "shouldn't";
                    break;
                case 'wouldnt':
                    sentences[i][j] = "wouldn't";
                    break;
                case 'cant':
                    sentences[i][j] = "can't";
                    break;
            }
        }
    }
    return sentences;
};

const buildChains = (corpus, chainLength) => {
    // Break the corpus into sentences and only take sentences with more than 10
    // characters.
    corpus = corpus.toLowerCase().replace("\n", ".");

    let sentences = corpus.split(/[\.!\?\n]/).filter(sentence => sentence.length > 10);

    let chains = {};

    for (let i = 0; i < sentences.length; ++i) {
        parseSentence(sentences[i], chainLength, chains);
    }

    return chains;
};

const parseSentence = (sentence, chainLength, chains) => {
    // We only want normal people characters (ASCII because we're racist).
    sentence = sentence.replace(/[^a-z^ ]/g, "");

    let tokens = sentence.split(" ").filter(token => token.length > 0);

    // Ignore niggardly sentences with fewer than four words. Who even, amirite? <-- Irony. Heh.
    if (tokens.count < 3) return;

    for (let i = 0; i < tokens.length; ++i) {
        let word = tokens[i],
            prefix = [];

        //addForPrefix([], word, chains);

        // Build the sequence preceeding this word.
        for (let j = Math.min(chainLength, i); j >= 1; --j) {
            prefix.push(tokens[i - j]);
        }
        addForPrefix(prefix, word, chains);
    }
};

const addForPrefix = (prefix, word, chains) => {
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
};

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
        if (!this.corpora[corpusName])
            return 'That is not a thing (no such corpus).';

        const corpus = this.corpora[corpusName];
        const sentences = [];
        let sentence = [];

        for (let i = 0; i < length; ++i) {
            let word = this.getNextWord(corpus, sentence);
            if (word === '') {
                sentences.push(sentence);
                sentence = [];
                word = this.getNextWord(corpus, sentence);
            }
            sentence.push(word);
        }

        return fixCapitalisation(sentences).map(s => s.join(' ')).join('. ') + '.';
    }

    getNextWord(corpus, sentence) {
        let lastN = [];
        for (let i = Math.min(corpus.n, sentence.length); i > 0; --i) {
            lastN.push(sentence[sentence.length - i]);
        }

        let prefix = lastN.join(' ');
        let options = corpus.chains[prefix];

        // If we have nowhere, give up.
        if (!options)
            return '';

        let pick = Math.floor(Math.random() * options['@sum']);
        let runningSum = 0;
        for (let key in options) {
            if (key === '@sum')
                continue;

            runningSum += options[key];
            if (runningSum >= pick)
                return key;
        }

        console.debug(`Pick: ${pick}, Sum: ${runningSum}`);
        console.debug(options);

        // Should never reach here.
        throw new Error("I have no idea what's happening...");
     }
}

module.exports = MarkovGenerator;
