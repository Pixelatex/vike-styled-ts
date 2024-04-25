import { ApolloProvider } from "@apollo/client";
import React from "react";

function App({ apolloClient, children }: any) {
  /* Sentry.init({
    dsn: 'https://0747334bb16c4e0c8e34da08c3adc75f@o120610.ingest.sentry.io/5566829',
    autoSessionTracking: true,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  }) */

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}

export default App;
