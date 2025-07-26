import { AppBar, Box, Button, Container, NoSsr, Toolbar, Typography } from '@mui/material'
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
 
export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const logout = () => {
    document.cookie = "userid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login")
  };

  return <AppCacheProvider {...pageProps}>
    <Container>
      <NoSsr>
        <Box sx={{flexGrow: 1}}>
          <AppBar>
            <Toolbar>
              <Typography variant='h6' sx={{flexGrow: 1}}>Sommer Sonntage</Typography>
              <Button variant='outlined' sx={{color: 'white'}} onClick={() => logout()}>Abmelden</Button>
            </Toolbar>
          </AppBar>
        </Box>
      </NoSsr>
      <Box mt="80px">
        <Component {...pageProps} />
      </Box>
    </Container>
  </AppCacheProvider>
}