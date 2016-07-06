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

[Resolving Resources](#resolver)

[Injecting Resources](#resolution)

[Redundant Resolutions](#redundant)

<a name="resolver"></a>
## Resolving Resources

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
## Injecting Resources

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

<a name="redundant"></a>
## Redundant Resolutions

As of the current version, resolutions or resolved redundantly. In a future update
resolution caching will be implemented.

## Keep Reading

[Routing](/route/README.md)

[Response](/response/README.md)

[Middleware](/middleware/README.md)

[Resources](/resource/README.md)

[Rules](/rule/README.md)

[DTOs](/dto/README.md)

## More Links

[Restkit Seed Project](https://github.com/iamchairs/restkit-seed)

[Github](https://github.com/iamchairs/restkit)

[Issues](https://github.com/iamchairs/restkit/issues)

[NPM](https://www.npmjs.com/package/restkit)

[Twitter](https://twitter.com/micahwllmsn)