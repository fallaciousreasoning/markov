# markov
A simple program for building markov chains and generating text (intended for use with Concierge). The program allows for custom corpora to be specified to generate a piece of text of fixed length. The back end has support for ngrams but the current front end only supports bigrams for text generation :'(

# Usage

## Installation
`/kpm install markov`

## Adding a Corpus
/markov add [corpusName] [corpus]

## Generating a Markov Chain
/markov [corpusName] [length]

## Listing available corpora
/markov list
