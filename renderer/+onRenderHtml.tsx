// https://vike.dev/onRenderHtml
import { getDataFromTree } from "@apollo/client/react/ssr";
import React from "react";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { escapeInject, dangerouslySkipEscape } from "vike/server";

import App from "./App";
import "./global.css";

async function onRenderHtml(pageContext: any) {
  const { Page, apolloClient } = pageContext;
  const sheet = new ServerStyleSheet();

  const tree = (
    <StyleSheetManager sheet={sheet.instance}>
      <App apolloClient={apolloClient}>
        <Page />
      </App>
    </StyleSheetManager>
  );
  const pageHtml = await getDataFromTree(tree);

  // Get styled tags from html
  const styledTags = sheet.getStyleTags();
  sheet.seal();

  const apolloInitialState = apolloClient.extract();

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <head>
       ${dangerouslySkipEscape(styledTags)}
      </head>
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
