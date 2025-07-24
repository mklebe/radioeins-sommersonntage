import { Container } from '@mui/material'
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter'
import type { AppProps } from 'next/app'
 
export default function MyApp({ Component, pageProps }: AppProps) {
  return <AppCacheProvider {...pageProps}>
    <Container>
      <Component {...pageProps} />
    </Container>
  </AppCacheProvider>
}