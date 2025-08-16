import styled from '@emotion/styled';
import { AppBar, Box, Button, Container, NoSsr, Toolbar, Typography } from '@mui/material'
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter'
import { deleteCookie } from 'cookies-next';
import type { AppProps } from 'next/app'
import Link from 'next/link';
import { useRouter } from 'next/router';

const StyledLink = styled(Link)`
  color: inherit;
  underline: none;
`
 
export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const logout = () => {
    deleteCookie("userid");
    router.push("/login")
  };

  return <AppCacheProvider options={{ key: 'css' }} {...pageProps}>
    <Container>
      <NoSsr>
        <Box sx={{flexGrow: 1}}>
          <AppBar>
            <Toolbar>
              <Typography variant='h6' sx={{flexGrow: 1}}><StyledLink color="inherit" href="/sonntag">Sommer Sonntage</StyledLink></Typography>
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