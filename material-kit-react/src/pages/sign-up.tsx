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

import { signUp } from 'src/utils/api';

import { CONFIG } from 'src/config-global';

export default function SignUpPage() {
  const router = useRouter();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await signUp(emailInput, passwordInput);
      setSuccessMessage('Account created. Please sign in.');
      setTimeout(() => router.replace('/sign-in'), 800);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>{`Sign up - ${CONFIG.appName}`}</title>

      <Card sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5">Create your account</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Already have an account?
              <Link component={RouterLink} href="/sign-in" sx={{ ml: 0.5 }}>
                Sign in
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
                autoComplete="new-password"
                required
              />
              {errorMessage && (
                <Typography variant="body2" color="error">
                  {errorMessage}
                </Typography>
              )}
              {successMessage && (
                <Typography variant="body2" color="success.main">
                  {successMessage}
                </Typography>
              )}
              <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create account'}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Card>
    </>
  );
}
