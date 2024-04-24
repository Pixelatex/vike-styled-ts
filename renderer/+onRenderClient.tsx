// https://vike.dev/onRenderClient
import { ApolloClient, InMemoryCache } from '@apollo/client'
import React from 'react'
import { hydrateRoot } from 'react-dom/client'

import App from './App'

const makeApolloClient = (apolloInitialState: any) => {
  //@ts-ignore
  const gqlURI = import.meta.env.PUBLIC_ENV__GQL_ENDPOINT

  return new ApolloClient({
    uri: gqlURI,
    cache: new InMemoryCache().restore(apolloInitialState),
  })
}

async function onRenderClient(pageContext: any) {
  const { Page, ...rest } = pageContext
  console.log('rest', rest)
  const apolloClient = makeApolloClient(pageContext.apolloInitialState)

  hydrateRoot(
    document.getElementById('page-content')!,
    <App apolloClient={apolloClient}>
      <Page />
    </App>
  )
}

export { onRenderClient }
