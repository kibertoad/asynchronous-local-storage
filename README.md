# asynchronous-local-storage

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Linux Build][circleci-image]][circleci-url]
  [![Coverage Status](https://coveralls.io/repos/kibertoad/asynchronous-local-storage/badge.svg?branch=master)](https://coveralls.io/r/kibertoad/asynchronous-local-storage?branch=master)

Asynchronous local storage implementation based on Node.js ALS with fallback to cls-hooked for older Node.js versions.

Heavily based on a work done in https://github.com/thorough-developer/fast-als

If you are planning to use it with [fastify](https://github.com/fastify/fastify), it is recommended to use [fastify-request-context](https://github.com/fastify/fastify-request-context) plugin instead which seamlessly integrates `asynchronous-local-storage` with the fastify request lifecycle.

## Install

```sh
$ npm install --save asynchronous-local-storage
```

## Basic usage
### Fastify

```js
const { als } = require('asynchronous-local-storage')
const fastify = require('fastify')({ logger: true })
const asyncResourceSymbol = Symbol('asyncResource')

fastify.addHook('onRequest', (req, reply, done) => {
  als.runWith(() => {
    const asyncResource = new AsyncResource('my-als-context')
    req[asyncResourceSymbol] = asyncResource
    asyncResource.runInAsyncScope(done, req.raw)
  }, { user: { id: 'defaultUser' } })
});

fastify.addHook('preValidation', (req, res, done) => {
  const asyncResource = req[asyncResourceSymbol]
  asyncResource.runInAsyncScope(done, req.raw)
})

fastify.addHook('preHandler', (req, reply, done) => {
  // overrides default user value
  als.set('user', { id: 'customUser' });
  done();
});

// Declare a route
fastify.get('/', async (request, reply) => {
  return {
    user: als.get('user')
  }
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
start();
```

### Express

```js
const { als } = require('asynchronous-local-storage')
const express = require('express')

const app = express()
const port = 3000

app.use((req, res, next) => {
  als.runWith(() => {
    next();
    }, { user: { id: 'defaultUser' } }); // sets default values
});

app.use((req, res, next) => {
  // overrides default user value  
  als.set('user', { id: 'customUser' });
  next();
});

app.get('/', (req, res) => res.send({ user: als.get('user') }))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
```

# API

### runWith

Start an asynchronous local storage context. Once this method is called, a new context is created, for which
`get` and `set` calls will operate on a set of entities, unique to this context.

#### Parameters

-   `callback` - function that will be executed first within the newly created context
-   `[defaults]` - an optional record, containing default values for the context

#### Examples

```javascript
const als = require('asynchronous-local-storage');

function firstCallInScope() {
  // override user
  als.set('user', { id: 'overwrittenUser'});
}

function secondCallInScope() {
 // will print the user set in firstCallInScope
 console.log(als.get('user'));
}

als.runWith(() => {
  firstCallInScope();
  secondCallInScope();
}, { user: { id: 'someUser' } });
```

### set

Sets a variable for a given key within running context (started by `runWith`).
If this is called outside of a running context, it will not store the value.

#### Parameters

-   `key` a string key to store the variable by
-   `value` any value to store under the key for the later lookup.

#### Examples

```javascript
const als = require('asynchronous-local-storage');

function callInScope() {
  // override user
  als.set('user', { id: 'overwrittenUser'});
}

als.runWith({ user: { id: 'someUser' } }, () => {
  callInScope();
});
```

```javascript
const als = require('asynchronous-local-storage');

function callOutOfScope() {
  // this never gets set
  als.set('user', { id: 'overwrittenUser'});
}

// calling this won't store the variable under the key
callOutOfScope();
```

### get

Gets a variable previously set within a running context (started by `runWith`).
If this is called outside of a running context, it will not retrieve the value.

#### Parameters

-   `key` a string key to retrieve the stored value for

#### Examples

```javascript
const als = require('asynchronous-local-storage');

function callInScope() {
  // prints default user
  console.log(als.get('user'));
}

als.runWith(() => {
  callInScope();
}, { user: { id: 'someUser' } });
```

```javascript
const als = require('asynchronous-local-storage');

function callInScope() {
  // prints default user
  console.log(als.get('user'));
}

als.runWith(() => {
  callInScope();
}, { user: { id: 'someUser' } });

// calling this will return undefined
callInScope();
```


[npm-image]: https://img.shields.io/npm/v/asynchronous-local-storage.svg
[npm-url]: https://npmjs.org/package/asynchronous-local-storage
[downloads-image]: https://img.shields.io/npm/dm/asynchronous-local-storage.svg
[downloads-url]: https://npmjs.org/package/asynchronous-local-storage
[circleci-image]: https://circleci.com/gh/kibertoad/asynchronous-local-storage.svg?style=svg
[circleci-url]: https://circleci.com/gh/kibertoad/asynchronous-local-storage
