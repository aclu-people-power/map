## ACLU People Power event map
More info coming soon...

## Dev Environment Setup
Ensure you have node v6.10.2+ and yarn installed on your machine then run
```
yarn
```

## Local development server
Start up a local development server with hot-reloading
```
yarn start
```

## Compile assets for production deployment
Assets will compiled to the dist dir by default.
```
yarn run build
```

To run a simple webserver and verify production output you can use
```
yarn run dist:server
```

## Deployment

First build the app per instructions in the previous step, serve it locally, and make sure things look good.

Then do either:

```
yarn run dev-deploy
```

Or

```
yarn run prod-deploy
```

Depending on the situation.

_Note: you will need `aws` installed and configured with your credentials first._
