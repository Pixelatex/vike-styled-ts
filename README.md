# Example for VIKE + typescript + styled-components + apollo

# Introduction

This example was created by me since we needed an app that combines TS, styled componnets and apollo. I found the existing examples to not be super relevant and this template is mostly 1:1 copy of the internal template used in our company. Hence we will strife to keep this updated regulary and hopefully it can serve as an example for others.

I will mostly document the inclusion of Apollo and Styled since TS is fairly self explanatory.

## Typescript

This mostly requires the correct `tsconfig.json`. See the example included in the repository.

Requires the following packages:

- `npm i typescript`

---

Note: the server is left as plain JS instead of TS. This is a minor issue that is as of yet unsolved.

## Apollo

For data fetching, we use Apollo so I will include how it is setup here.

### 1. Install dependencies

`npm i graphql, @apollo/client`

### 2. Adjust your vite config

We will need to a plugin to prevent client-side code issues on the serverside.
`npm i  vite-plugin-cjs-interop`

And then adjust your `vite.config.ts` as following:

```typescript
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { cjsInterop } from "vite-plugin-cjs-interop";

export default {
  ssr: {
    noExternal: ["@apollo/client"],
  },
  plugins: [
    react(),
    vike(),
    cjsInterop({
      dependencies: ["@apollo/client/*"],
    }),
  ],
};
```

### 3. Client-side logic

in `+onRenderClient`:

Setup an apolloClient to be used for your client-side code, don't forget to consume the apollo initial state from the server (see next part) that will allow your client code to rehydrate and not redo the server-side requests.

```typescript
import { ApolloClient, InMemoryCache } from '@apollo/client'
import React from 'react'
import { hydrateRoot } from 'react-dom/client'

import App from './App'

const makeApolloClient = (apolloInitialState: any) => {
  //@ts-ignore
  const gqlURI = "mygraphqlapi.com"

  return new ApolloClient({
    uri: gqlURI,
    cache: new InMemoryCache().restore(apolloInitialState),
  })
}

async function onRenderClient(pageContext: any) {
  const { Page, ...rest } = pageContext
  const apolloClient = makeApolloClient(pageContext.apolloInitialState)

  hydrateRoot(
    document.getElementById('page-content')!,
    <App apolloClient={apolloClient}>
      <Page />
    </App>
  )
}

export { onRenderClient }

```


### 4. Server-side logic

First we need to add the apolloClient on the server side as well,

Go to `server/index.js` and modify your server like this:


```javascript
import apollo from '@apollo/client'
const { ApolloClient, createHttpLink, InMemoryCache } = apollo

function vike(app) {
  app.get('*', async (req, res, next) => {
    const apolloClient = createApolloClient()

    const pageContextInit = {
      urlOriginal: req.originalUrl,
      apolloClient,
    }

    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext

    if (!httpResponse) {
      return next()
    } else {
      const { statusCode, headers, earlyHints } = httpResponse
      if (res.writeEarlyHints)
        res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
      headers.forEach(([name, value]) => res.setHeader(name, value))
      res.status(statusCode)
      httpResponse.pipe(res)
    }
  })
}

const createApolloClient = () => {
  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: gqlURI,
      fetch,
    }),
    cache: new InMemoryCache(),
  })
  return apolloClient
}
```

Note: this part is shortened, take a look at the example file for the full server file logic.

---

in `+onRenderHtml`, aka the server rendering, we will render the tree of our application first and extract all queries from the tree and populate the `apolloInitialState` with our initial queries so the client doesn't have to run these again.

```typescript
// https://vike.dev/onRenderHtml
import { getDataFromTree } from "@apollo/client/react/ssr";
import React from "react";
import { escapeInject, dangerouslySkipEscape } from "vike/server";

import App from "./App";

async function onRenderHtml(pageContext: any) {
  const { Page, apolloClient } = pageContext;

  const tree = (
      <App apolloClient={apolloClient}>
        <Page />
      </App>
  );
  const pageHtml = await getDataFromTree(tree);

  const apolloInitialState = apolloClient.extract();

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-content">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      apolloInitialState,
    },
  };
}

export { onRenderHtml };

```
---

Don't forget to modify your `+config` so it knows to pass the initial state along

```typescript
export default {
  passToClient: ['apolloInitialState'],
}
```

## Styled components
