Response
--------

What is returned by the Route method will be sent to the client as the response.
The [Routing](/route/README.md) section touched this briefly, here we will go over
all the options of respoding to a request.

[Responding to Routes](#responding)

[Errors](#errors)

[Response Factories](#factories)

[Default Error/Response Codes](#defaults)

<a name="responding"></a>
## Responding to Routes

All returned and resolved values that are not `Response` objects will be converted
to `Response` objects at some point. When this happens, if your route does not
specify the type of response, a default will be chosen from the context. The
defaults and their conditions are-

**200** - Is the default for any resolved/returned request with a payload.

**204** - Is the default for any resolved/returned request without a payload.

**400** - Is the default for any request that has missing required `injectables`
          or fails `DTO` validation.

**500** - Is the default for any rejected request, thrown error, failed `rule`,
or failed `resource resolution`.

For more control over the status code, the generically named `Response` object
should be used. When creating a response, you should provide the http status code
as well as the data to be sent to the client.

```typescript
import {Route, Response} from 'expresskit';

export class FooRouter {
  @Route('GET', '/foo')
  public static fooRoute() {
    return 'foo';

    // is the same as

    return new Response(200, 'foo');

    // is the same as

    return Promise.resolve('foo');

    // is the same as

    return Promise.resolve(new Response(200, 'foo'));
  }
}
```

<a name="errors"></a>
## Errors

To respond with an error you can simple return a response with an error code.

```typescript
return new Response(500, 'something bad happened');
```

Under two conditions will an error be **assumed**. Those conditions are if the route
encounters a `Thrown Error` or `Rejected Promise`. In these cases, the status code
will default to a `500 Internal Server Error`. However, a thrown `Error` is not the
same as a thrown `Resposne`.

```typescript
import {Route} from 'expresskit';

export class FooRouter {
  @Route('GET', '/foo')
  public static fooRoute() {
    throw new Error('An error occured')

    // is NOT the same as

    return Promise.reject('An error occured');
  }
}
```

If an error is thrown, it assumed that there is an actual runtime error and the
stacktrace will be returned. You can throw intended errors by throwing a `Response`.

```typescript
import {Route, Response} from 'expresskit';

export class FooRouter {
  @Route('GET', '/foo')
  public static fooRoute() {
    return new Response(500, 'An error occured');

    // is the same as

    throw new Response(500, 'An error occured')

    // is the same as

    return Promise.reject('An error occured');

    // is the same as

    return Promise.reject(new Response(500, 'An error occured'));
  }
}
```

<a name="factories"></a>
## Response Factories

For convenience sake, some response factories are available. Each response
factory defaults the response code as well as the response value if not given.


```typescript
import {Route, Response} from 'expresskit';

export class FooRouter {
  @Route('GET', '/foo')
  public static fooRoute() {
    return Response.NotFound(`Couldn't find Foo`);
  }
}
```

The available factories and their values are-

| Factory Function       | Resposne Code | Default Response Value  |
|------------------------|---------------|-------------------------|
| Ok                     | 200           | Ok                      |
| Created                | 201           | Created                 |
| Accepted               | 202           | Accepted                |
| None                   | 204           |                         |
| BadRequest             | 400           | Bad Request             |
| Unauthorized           | 401           | Unauthorized            |
| PaymentRequired        | 402           | Payment Required        |
| Forbidden              | 403           | Forbidden               |
| NotFound               | 404           | Not Found               |
| MethodNotAllowed       | 405           | Method Not Allowed      |
| NotAcceptable          | 406           | Not Acceptable          |
| Conflict               | 409           | Conflict                |
| Gone                   | 410           | No Long Available       |
| Error                  | 500           | Internal Server Error   |
| NotImplemented         | 501           | Not Implemented         |
| BadGateway             | 502           | Bad Gateway             |
| TemporarilyUnavailable | 503           | Temporarily Unavailable |
| GatewayTimeout         | 504           | GatewayTimeout          |

<a name="defaults"></a>
## Default Error/Response Codes

Returning a `Response` should be used if the route or rule may return different
types of responses. For everything else, use the `ResponseCode` and `ErrorCode`
decorators if you don't intended to use the defaults. These decorators override
the default response codes for success and error responses. Only one default
response code and error code can be used for a particular `Route`, `Rule`, or
`Resolver`.

```typescript
import {Route, Param, Resolver, ResponseCode, ErrorCode} from 'expresskit';

export class WidgetRouter {

  @Resolver('Widget')
  @Route('GET', '/widget/:id')
  @ResponseCode(200) // Redundant but you get the point
  @ErrorCode(404)
  public static getWidget(@Param('id') id: string): Promise<Widget> {
    let widget = /* get widget from database*/;

    if(widget) {
      return Promise.resolve(widget);
    } else {
      return Promise.reject(`Widget by id '${id}' not found.`);
    }
  }
}
```

In the above example, the `getWidget` method is both a `Route` and a `Resource
Resolver`. If another route wants to resolve the `Widget` resource for that route
using this resolver, a `404` error will be returned that the resolution fails.

```typescript
import {Route, Param, Resolver, ResponseCode, ErrorCode} from 'expresskit';

export class WidgetRouter {

  @Resolver('Widget')
  @Route('GET', '/widget/:id')
  @ResponseCode(200) // Redundant but you get the point
  @ErrorCode(404)
  public static getWidget(@Param('id') id: string): Promise<Widget> {
    let widget = /* get widget from database*/;

    if(widget) {
      return Promise.resolve(widget);
    } else {
      return Promise.reject(`Widget by id '${id}' not found.`);
    }
  }

  // If `Widget` cannot be resolved, a 404 error will be returned
  @Route('PUT', '/widget/:id')
  public static updateWidget(@Resource('Widget') widget: Widget) {
    // update widget
  }
```

## Keep Reading

[Routing](/route/README.md)

[Response](/response/README.md)

[Middleware](/middleware/README.md)

[Resource Resolutions](/resource/README.md)

[Rules](/rule/README.md)

[DTOs](/dto/README.md)

## More Links

[Expresskit Seed Project](https://github.com/iamchairs/expresskit-seed)

[Github](https://github.com/iamchairs/restkit)

[Issues](https://github.com/iamchairs/restkit/issues)

[NPM](https://www.npmjs.com/package/restkit)

[Twitter](https://twitter.com/micahwllmsn)