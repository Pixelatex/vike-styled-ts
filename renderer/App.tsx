import { ApolloProvider } from '@apollo/client'
import { MultiBrandThemes } from '@travelquest/web-components'
import React from 'react'
import { ThemeProvider } from 'styled-components'

function App({ apolloClient, children }: any) {
  /* Sentry.init({
    dsn: 'https://0747334bb16c4e0c8e34da08c3adc75f@o120610.ingest.sentry.io/5566829',
    autoSessionTracking: true,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  }) */

  const theme = MultiBrandThemes?.summerBash || MultiBrandThemes?.mountainBash
  //theme is made in cms based on basic values => ticket

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}

export default App
