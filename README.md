[<img src="https://s32.postimg.org/d2rrmqnqt/expresskit.png"/>](https://github.com/iamchairs/restkit)

This is an experimental node rest server library using decorators.
Developers using Java and C# frameworks are familiar with annotations when writing restful services.
`restkit` is an attempt to bring some of those useful annotations to node rest servers.

**Getting Started**

[Prerequisites](#prerequisites)

[Get Restkit](#getrestkit)

[tsconfig](#tsconfig)

[Server Support](#serversupport)

[Express Support](#express)

[Koa Support](#koa)

[Hapi Support](#hapi)

[Hello World Demo](#helloworld)

**Restkit**

[Startup Options](#startupoptions)

[Static Content](#staticcontent)

[Middleware](#middleware)

**Routing**

[The Basics](route/README.md#thebasics)

[Asynchronous Requests](route/README.md#async)

[Restkit Response](route/README.md#response)

[Injectables](route/README.md#injectables)

**Middleware**

[Route](middleware/README.md#route)

[Router](middleware/README.md#router)

**Auth** (In the future: Resolutions)

[Authentication not Authorization](auth/README.md#authentication)

[Auth and AuthHandler](auth/README.md#authhandler)

**Rules**

[Validate and Authorize](rule/README.md#validateandauthorize)

[Rule and RuleHandler](rule/README.md#use)

[Combining Rules](rule/README.md#combine)

**DTOs**

[Property Validation](dto/README.md#validation)

[Data Scrubbing](dto/README.md#scrubbing)

<a name="prerequisites"></a>
## Prerequisites

[NPM >3.8.0](https://nodejs.org/en/download/current/)

[Node >6.2.0](https://nodejs.org/en/download/current/)

[Typescript >1.8.0](https://www.npmjs.com/package/typescript)

[ntypescript](https://www.npmjs.com/package/ntypescript)

<a name="getrestkit"></a>
## Get Restkit

Using npm to install restkit in the root of your server application.

```
npm install --save restkit
```

<a name="tsconfig"></a>
## tsconfig

Because we are using Typescript, you will need a tsconfig.
This should point to your `index.ts` file. `experimentalDecorators`
should be set to **true**. From this point you should model your build
configuration to your working process.

If you don't have a process yet or are indifferent, at `module` to "none"
and `outDir` to "bld". You can build your application by running `ntsc` in
the root directory of your server, and run the generated `index.js` file
in the `bld` directory.

```
ntsc
cd build
node index.js
```

```json
{
    "compilerOptions": {
        "target": "es6",
        "module": "none",
        "moduleResolution": "node",
        "declaration": false,
        "noImplicitAny": true,
        "removeComments": true,
        "noLib": false,
        "outDir": "bld",
        "experimentalDecorators": true
    },
    "files": [
        "index.ts"
    ]
}
```

<a name="serversupport">Server Support</a>

Restkit does not supply an http server. It adds annotations to your existing server.
A server support module should be installed along-side Restkit. These support modules
provide the specific implementation of that frameworks request/response model. The
support module will also provide additional injectables that require a specific
implementation of that server framework. Examples of those would be `Param`, `Query`,
`Header`, and `Body`.

Throughout this readme, `Expresskit` will be the assumed support module. The differences
between the support modules are only in their source, so if you are following along with
a different support module, the only difference is import name.

e.g. `import {Param} from 'expresskit' -> import {Param} from 'koakit'`

Below are the support modules-

<a name="express"></a>

[<img src="https://s32.postimg.org/4yopf47n9/restkitexpress.png" height="100"/>](https://github.com/iamchairs/expresskit)

---

Restkit does not supply an http server. It adds annotations to your existing server.
Express is one of the supported servers. To use Restkit with Express, you need to install
Expresskit alongside Restkit.

```
npm install --save expresskit
```

Once Expresskit is installed, you can tell Restkit to tie into the request/response of
the server by provided an instance of the `ExpressServer` to the Restkit `start` method.

```typescript
import {Restkit} from 'restkit';
import {ExpressServer} from 'expresskit';

Restkit.start({
  server: new ExpressServer()
});
```

<a name="koa"></a>

[<img src="https://s32.postimg.org/4n792cr79/restkitkoa.png" height="100"/>](https://github.com/iamchairs/koakit)

---

Restkit does not supply an http server. It adds annotations to your existing server.
Koa is one of the supported servers. To use Restkit with Koa, you need to install
Koakit alongside Restkit. (Don't confuse `koakit` with `koa-kit`).

```
npm install --save koakit
```

Once Koakit is installed, you can tell Restkit to tie into the request/response of
the server by provided an instance of the `KoaServer` to the Restkit `start` method.

```typescript
import {Restkit} from 'restkit';
import {KoaServer} from 'koakit';

Restkit.start({
  server: new KoaServer()
});
```

<a name="hapi"></a>

[<img src="https://s32.postimg.org/ydpbr05v9/expresskithapi.png" height="100"/>](https://github.com/iamchairs/hapikit)

---

Restkit does not supply an http server. It adds annotations to your existing server.
Koa is one of the supported servers. To use Restkit with Hapi, you need to install
Hapikit alongside Restkit.

```
npm install --save hapikit
```

Once Hapikit is installed, you can tell Restkit to tie into the request/response of
the server by provided an instance of the `HapiServer` to the Restkit `start` method.

```typescript
import {Restkit} from 'restkit';
import {HapiServer} from 'hapikit';

Restkit.start({
  server: new HapiServer()
});
```

<a name="helloworld"></a>
## Hello World Demo (with ExpressServer)

Restkit does not have an http server on it's own.

The index of your restkit server will need to import the routers you will be using as well as providing the basic configuration of the server.
In this hello world example, we will have a hello component and router in a `/hello` directory.

```
/
  index.ts
  /hello
    router.ts
```

In our `index.ts` we just need to start the Restkit and tell it to import the
HelloWorldRouter.

```typescript
import {Restkit} from 'restkit';
import {ExpressServer} from 'expresskit';
import 'hello/router';

Restkit.start({
  server: new ExpressServer() 
});
```

When an Restkit server is started, it will default to port `8000`. This can
be changed by adding **Start Options** to the `start` method. This is enough to
start a server, but no routes are defined yet. So we'l create a route that returns
"Hello World". In our `hello/router.ts` we can define a router like any class.

```typescript
export class HelloWorldRouter {}
```

To create a **Route** on the HelloWorldRouter, we need to import `Route` from
`restkit/route`. This is a decorator we can use to create a route on the express
server.

```typescript
import {Route} from 'restkit';

export class HelloWorldRouter {

  @Route('GET', '/hello')
  public static sayHelloWorld() {
    return 'Hello World';
  }

}
```

Now if we build the server, start it, and go to
`http://localhost:8000/hello`, we will get the response "Hello World".

Want more examples? See the [Expresskit Seed Project](https://github.com/iamchairs/expresskit-seed). Want to learn more about
Restkit and it's many features? Keep reading!

<a name="startupoptions"></a>
## Startup Options

There are a few configurable properties when you start the server. These options
are application wide properties. To add startup options, just pass a json object
to the `Restkit.start` method.

```typescript
import Restkit from 'restkit';

Restkit.start({
  ... options go here
});
```

Possible options are-

| Option      | Description                                                                                                                                  | Default    |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------|------------|
| server      | An instance of the server from the server support module. **Required**                                                                       | null       |
| port        | The port the server listens to for incoming requests.                                                                                        | 8000       |
| timezone    | The default timezone of the application. Sets `process.env.TZ` to this property for convenience.                                             | TZ (GMT 0) |
| staticFiles | An array of files and their URIs to serve statically when requested.                                                                         | []         |
| staticPaths | An array of paths and their URIs to serve statically when requested. All files and child directories of this path will be served statically. | []         |
| middleware  | An array of application-wide middleware functions. (This is where your body parsers will go.)                                                | []         |

<a name="staticcontent"></a>
## Static Content

There may be cases (i.e. if your client is bundled with your server) where you'l
want to serve files statically. That is, when a file like `localhost:8000/index.html`
is requested, no route is used to handle that request but the file itself will be sent.
You can set entire directories as static where the files in them and their
child directories can be access directly, or you can set specific files as static.

Both `staticFiles` and `staticPaths` are defined in the same format. Each staticFile
and staticPath entry must have a path as well as the uri used to access that path.
Paths can be relative, so the server can access files/paths in non-child directories.
Paths should be relative to the server's index file.

Take this directory structure example-

```
/
  client/
    assets/
      images/
        fooimage.jpg
    index.html

  server/
    index.ts <-- You Are Here
```

We can use staticFiles to point `/` and `/index.html` to the client index file.
And we can use staticPaths to point `/images` to the client's image assets directory.

```typescript
Restkit.start({
  server: new ExpressServer(),
  staticFiles: [
    {uri: '/', path: '../client/index.html'},
    {uri: '/index.html', path: '../client/index.html'}
  ],
  staticPaths: [
    {uri: '/images', path: '../client/assets/images'}
  ]
});
```

Notice that because the server directory is a sibling of the client directory we need
to move up a directory in our path. With this configuration of static
files and paths, we can request the following urls: 

```
http://localhost:8000/
http://localhost:8000/index.html
http://localhost:8000/images/fooimage.jpg
```

<a name="middleware"></a>
## Middleware

In the middleware section of the README you can provide middleware for specific routes
and routers. To add middleware to the entire application, use the `middleware` option.

An example of when you'd want to use this is for body parsers.

```typescript
declare var require: any;

import {Restkit} from 'restkit';
import {ExpressServer} from 'expresskit';

let bodyParser = require('body-parser');
 
Restkit.start({
  server: new ExpressServer(),
  middleware: [
    bodyParser() 
  ]
});
```

## Keep Reading

[Routing](route/README.md)

[Middleware](middleware/README.md)

[Auth](auth/README.md)

[Rules](rule/README.md)

[DTOs](dto/README.md)

## More Links

[Restkit Seed Project](https://github.com/iamchairs/restkit-seed)

[Github](https://github.com/iamchairs/restkit)

[Issues](https://github.com/iamchairs/restkit/issues)

[NPM](https://www.npmjs.com/package/restkit)

[Twitter](https://twitter.com/micahwllmsn)