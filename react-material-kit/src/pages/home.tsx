import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { API_BASE_URL, fetchHealth } from 'src/utils/api';

import { DashboardContent } from 'src/layouts/dashboard';

import { useAuth } from 'src/auth/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleHealthCheck = async () => {
    console.log('Health check target:', `${API_BASE_URL}/health`);
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await fetchHealth();
      setHealthStatus(result.status);
    } catch (error) {
      setHealthStatus(null);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardContent maxWidth="md">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4">Evernote Workspace</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
            Keep your notes organized and synced with your backend service.
          </Typography>
        </Box>

        <Stack direction="column" spacing={3}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Account status</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isAuthenticated
                  ? `Signed in as ${user?.email ?? 'your account'}`
                  : 'Sign in to view and manage your notes.'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push(isAuthenticated ? '/notes' : '/sign-in')}
              >
                {isAuthenticated ? 'Go to notes' : 'Sign in'}
              </Button>
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Backend health</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {healthStatus ? `Status: ${healthStatus}` : 'Check if the API is reachable.'}
              </Typography>
              {errorMessage && (
                <Typography variant="body2" color="error">
                  {errorMessage}
                </Typography>
              )}
              <Button variant="outlined" onClick={handleHealthCheck} disabled={isLoading}>
                {isLoading ? 'Checking...' : 'Check health'}
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </DashboardContent>
  );
}
