APHAjs
======

[![Build Status](https://travis-ci.org/martyn82/aphajs.svg?branch=master)](https://travis-ci.org/martyn82/aphajs)

APHAjs is a CQRS/ES library for TypeScript. It contains all the
building blocks you need to build an application that implements
Command-Query Responsibility Segregation either with or without
Event Sourcing.

APHAjs provides:
* Typed command and event handling with annotations
*

## Prerequisites

Requirements:
* Node 6+

## Installation
```
$ npm install
```

## Usage

Compile:
```
$ npm run compile
```

Run the tests (requires compilation first):
```
$ npm test
```

## Documentation
Currently, documention is there in the form of examples. These can
be found in the `examples/` directory. You can compile them
by running:
```
$ npm run compile:examples
```
and then execute these with:
```
# Replace [example-filename] with one of the files in this directory.
$ node target/build/examples/examples/[example-filename].js
```

## Licensing

Please consult the `LICENSE` file for this.
