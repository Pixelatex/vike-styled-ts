import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'

export const ErrorPage = () => {
  const pageContext = usePageContext()

  let msg
  let title

  // Fallback error message
  if (!msg) {
    msg = pageContext.is404
      ? "This page doesn't exist."
      : 'Something went wrong. Sincere apologies. Try again (later).'
    title = pageContext.is404 ? "Doesn't exist" : 'Error'
  }

  return (
    <>
      <h1>{title}</h1>
      <p>{msg}</p>
      <p>Error component here</p>
    </>
  )
}

export default ErrorPage
