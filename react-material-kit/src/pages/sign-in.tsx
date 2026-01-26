import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { signIn } from 'src/utils/api';

import { CONFIG } from 'src/config-global';

import { useAuth } from 'src/auth/AuthContext';

// ----------------------------------------------------------------------

export default function Page() {
  const router = useRouter();
  const { setToken } = useAuth();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await signIn(emailInput, passwordInput);
      setToken(result.access_token);
      router.replace('/notes');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>{`Sign in - ${CONFIG.appName}`}</title>

      <Card sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5">Sign in</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Don&apos;t have an account?
              <Link component={RouterLink} href="/sign-up" sx={{ ml: 0.5 }}>
                Create one
              </Link>
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={emailInput}
                onChange={(event) => setEmailInput(event.target.value)}
                autoComplete="email"
                required
              />
              <TextField
                label="Password"
                type="password"
                value={passwordInput}
                onChange={(event) => setPasswordInput(event.target.value)}
                autoComplete="current-password"
                required
              />
              {errorMessage && (
                <Typography variant="body2" color="error">
                  {errorMessage}
                </Typography>
              )}
              <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Card>
    </>
  );
}
