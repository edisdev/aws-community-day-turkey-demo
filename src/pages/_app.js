import React from 'react'
import Amplify from 'aws-amplify'
import awsExports from './../aws-exports'

Amplify.configure(awsExports)

import '../styles/globals.css'

function MyApp ({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
