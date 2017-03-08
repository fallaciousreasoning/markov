const MarkovGenerator = require("./markov.js");
let markovGenerator = new MarkovGenerator();

exports.match = function (event, commandPrefix) {
    return event.arguments[0] === commandPrefix + 'markov';
};

exports.run = function (api, event) {
    if (event.arguments.length >= 4 && event.arguments[1] == 'add') {
        addCorpus(api, event, event.arguments[2], event.arguments.slice(3).join(" "));
    } else if (event.arguments.length == 2 && event.arguments[1] == 'list') {
        listCorpora(api, event);
    } else if (event.arguments.length == 3) {
        generate(api, event, event.arguments[1], parseInt(event.arguments[2]))
    } else {
        api.sendMessage("I have no idea what you're doing (and neither do you...)", event.thread_id);
    }
};

function addCorpus(api, event, corpusName, corpus) {
    markovGenerator.addCorpus(corpusName, corpus);
    api.sendMessage("Added you your corpus '" + corpusName + "'", event.thread_id);
}

function listCorpora(api, event) {
    var corporaNames = [];
    for (var key in markovGenerator.corpora) {
        corporaNames.push(key);
    }
    
    api.sendMessage("Available Corpora:\n" +corporaNames.join("\n"), event.thread_id);
}

function generate(api, event, corpusName, length) {
    let message = markovGenerator.generate(corpusName, length);
    api.sendMessage(message, event.thread_id);
}