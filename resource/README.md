Resolution
----------

Custom injectable resolutions can be created by defining a named `Resolver`.
Resolutions can be used to reduce the amount of redundant queries/fetches for
resources.

```typescript
import {Route, Param, Body, Resolver, Resolution} from 'expresskit';

public UserService {
  @Resolver('User')
  public static getUser(@Param('userId') userId: string) {
    // ... query the database and return the user
  }
}



```

[Resolver](#resolver)

[Resolution](#resolution)

[Multiple Resolutions](#multipleresolutions)

[Mapping Syntax](#mapping)

<a name="resolver"></a>
## Resolver

To create a resolution you need a method that will act as the resolver of that
resource. This can be any method decoratorated with the `Resolver` decorator.
Resolvers must be registered with the name of the resource they are resolving,
and must be unique to the application. In other words, you can't have multiple
`User` Resolvers.

The Resolver method is a standard injectable method in Restkit so it can inject
properties from the request. This is necessary to pull the correct resources
given the context of the request.

```typescript
import {Route, Param, Body, Resolver, Resolution} from 'expresskit';

public UserService {
  @Resolver('User')
  public static getUser(@Param('userId') userId: string) {
    // ... query the database and return the user
  }
}
```

<a name="resolution"></a>
## Resolution

Once a `Resolver` is defined, it can be used as a `Resolution` in your request.
The caveat being the required injectables of the Resolver must exist in the
request.

```typescript
import {Route, Param, Body, Resolver, Resolution} from 'expresskit';

public UserService {
  @Resolver('User')
  public static getUser(@Param('userId') userId: string) {
    // ... query the database and return the user
  }
}

public UserRouter {
  @Route('PUT', '/user/:userId')
  public static updateUser(@Resolution('User') user: User, @Body(User) update: User) {
    // ... You now have access to the actual user resource and the update resource
  }
}
```

<a name="multipleresolutions"></a>
## Multiple Resolution

There may be actions where two different resources of the same type should
be resolved. For example, if we have a route that should resolve multiple
users, we can `Map` the different user id params in the request to the expected
`userId` param in the resolution.

> Experimental Mapping Syntax
> This section uses an arbitrary mapping syntax. The current format is used
> for simplicity and may change if a *more* standard syntax is found/suggested.

```typescript
import {Route, Param, Body, Resolver, Resolution} from 'expresskit';

public UserService {
  @Resolver('User')
  public static getUser(@Param('userId') userId: string) {
    // ... query the database and return the user
  }
}

public UserRouter {
  @Route('POST', '/friends/:srcUser/:dstUser')
  public static updateUser(@Resolution('User', {map:'Param[srcUser] -> Param[userId]'}) srcUser: User,
                           @Resolution('User' {map:'Param[dstUser] -> Param[userId]'}) dstUser: User) {
    // ... You now have access to the src user and dst user
  }
}
```

<a name="mapping"></a>
## Mapping Syntax

The mapping syntax is simple. It provides a one-to-one map for an injectable of one
type to an injectable of another. In the example above, the `srcUser` Param is mapped
to the `userId` Param when resolving the `Resolution` injectable. Maps only
apply for the subsequent injection resolution, meaning if the `User Resolver` has
a Resolution of it's own, it will not apply the same mapping at that level.

```typescript
public ResolutionService {
  @Resolver('A')
  public static getA(@Param('a') a: string) {
    return a;
  }

  @Resolver('B')
  public static getB(@Resolution('A') a: string) {
    return a + 'b';
  }
}

public ResolutionRouter {
  @Route('GET', '/resolveA/:a')
  public static getA(@Resolution('A') a: string) {
    return a;
  }

  @Route('GET', '/resolveA2/:b')
  public static getA2(@Resolution('A', {map: 'Param[b] -> Param[a]'}) a: string) {
    return a;
  }

  @Route('GET', '/resolveB/:a')
  public static getB(@Resolution('B') b: string) {
    return b;
  }

  @Route('GET', '/resolveB/:b')
  public static getB(@Resolution('B') b: string) {
    // 400 error: `Required parameter a doesn't exist` 
    return b;
  }

  @Route('GET', '/resolveB/:b')
  public static getB(@Resolution('B', {map: 'Param[b] -> Param[a]'}) b: string) {
    // 400 error: `Required parameter a doesn't exist` 
    return b;
  }

  @Route('GET', '/resolveB/:b')
  public static getB(@Resolution('B', {map: 'Param[b] => Param[a]'}) b: string) {
    return b;
  }
}
```

<a name="authhandler"></a>
## Auth and AuthHandler

The `Auth` decorator is used to resolve the authentication resource for a request.
We will need to write a method that provides that resolution, so that's where we'l
begin.

An `AuthHandler` decorator can be used to define a method used to resolve the `Auth`
resource. Our handler method is an `injectable` method that can inject contextual
properties from the route. Because of this, we can use decorators like `Header` to
get the Authorization header of the request.

```typescript
import {AuthHandler, Header} from 'expresskit';

export class AuthService {
  @AuthHandler('User')
  public static resolveAuth(@Header('Authorization') auth: string) {
    // Do some sort of authenticating here and return the resource
    return {userId: 1, token: auth};
  }
}
```

This handler will (ideally) use the Authorization header to authenticate the request,
and return some information about *who* is making the request. With this we can now
use the `Auth` decorator to authenticate our routes.

```typescript
import {Auth, Route} from 'expresskit';

// Make sure the compiler knows to include this at some point since we don't
// directly call any methods on AuthService
import './auth.service.ts';

export class UserRouter {

  @Route('PUT', '/user')
  public static updateUser(@Auth('User') auth: any, @Body() update: any) {
    if(auth.userId === update.userId) {
      // Do update
    }
  }

}

```

## Keep Reading

[Routing](/route/README.md)

[Middleware](/middleware/README.md)

[Auth](/auth/README.md)

[Rules](/rule/README.md)

[DTOs](/dto/README.md)

## More Links

[Restkit Seed Project](https://github.com/iamchairs/restkit-seed)

[Github](https://github.com/iamchairs/restkit)

[Issues](https://github.com/iamchairs/restkit/issues)

[NPM](https://www.npmjs.com/package/restkit)

[Twitter](https://twitter.com/micahwllmsn)