# HashREST

*A simple REST server project that runs some proof-of-work like hashing based on
inputs.*

## Goals

This project serves little functional purpose other than as a place to learn
more about GitHub's CI/CD integrations. Building out this simple system provides
an opportunity to use the development process with GitHub's Actions in order to
learn more about container-based CI/CD.

## What is HashREST?

HashREST is meant to be a fun proof-of-concept that demonstrates how much
complexity goes into the solution space of a hash-based proof-of-work algorithm,
not unlike that used in Bitcoin. However, since HashREST isn't going to have any
notion of consensus, it's more like a "work algorithm".

Given some input (e.g., the string "foo"), HashREST's hash worker(s) work to
find a nonce (another 16-character string) that, when concatenated with the
input, results in a SHA256 hash that, when converted to a number (a very large
number), is lower than the specified target (also a very large number). The
simplest way to think of this is that the solution has to do with the number of
leading 0's in the resulting hash.

### More on SHA256 and Difficulty Target

SHA256 produces hashes that are 256 bits, or 32 bytes, long, hence the 64
characters in the hex form of the resultant hash. As an unsigned integer, 2^256
is a *very* large number of possible hashes - we refer to that as the "solution
space". The purpose of the aforementioned target (or difficulty) is to constrain
the solution space by making it smaller.

For example, if we set the target to 2^256 - 1 (or `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF`),
virtually any SHA256 output is lower than the target, meaning that any nonce
applied to the input will work. If we lower the target by 1 (so `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE`),
that solution space decreased. If we lower the target more dramatically, such as
to `0x0000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE`), now
the solution space has been reduced significantly. Effectively, this target
requires that a solution hash must have at least 7 leading 0's.

## Implementation Features

The following features are desired for this implementation:

* REST API with the ability to:
  * Receive a HashREST request (input, target) and return a solution response
    (basic, stateless execution of hash worker)
  * Receive an asynchronous HashREST request (kick off stateful work)
  * Receive a query on a previous HashREST request (query stateful work)
* Simple command line client to interact with HashREST API
* Simple web-based UI to interact with HashREST API, including:
  * Ability to browse multiple previous HashREST requests

### Feature Requirements

* Backend API: REST server with logic to kick off hash workers
  * Including ability to specify timeouts
* Stateful database to store HashREST requests
  * Provides statistics including input, solution nonce, number of iterations
    required, time required, success/failure, pending/complete, etc.
* Web server to provide UI for interaction

### Deployment Model

* Container-based:
  * REST API container; node-based
  * Database container (locally accessible on deployment host); postgres-based
  * Web UI container; nginx-based

## Phases of Implementation

The sections below define the general approach taken to fulfill the features
described above. Most of these are aspirational, and may change over time. No
time frame is set for their development.

As part of each of these phases, test-driven-development will be employed as
much as possible.

### Phase 1: Stateless REST API

* REST API implementation
  * Ability to receive HashREST requests, spin up hash worker, and send result
  * Timeout parameter and error states in timeout events
  * No interaction with a database, purely a request-response model
* Hash worker implementation
  * Basic processing of input, target, and timeout parameters
  * Ability to verify existing solution provided
* Beginnings of CLI client with basic operations
  * Ability to run one-off with specified parameters
  * Interactive CLI with prompts for parameters

### Phase 2: Stateful REST API

* Database configuration
  * Creation of database schema
* REST API update to add database interaction
  * Asynchronous HashREST requests - "start job", returns generated job index
  * Ability to query HashREST jobs (probably by a generated index) -
    completed/failed
  * Ability to query previous jobs to see number of iterations, total time, etc.
  * Ability to paginate job requests
* Chain route
  * New route for operations
  * Same functionality as regular HashREST, but now requires the output of the
    previous job to be the input of the new job
  * Ability to verify chain
* Update CLI to interact with new operations/endpoints

### Phase 3: Web UI

* Creation of web application that interacts with REST API
* Routes that correspond to different operations
