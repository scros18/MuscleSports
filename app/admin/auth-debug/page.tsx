'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function AuthDebugPage() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      setTokenInfo({
        exists: false,
        message: 'No auth_token found in localStorage'
      });
      return;
    }

    try {
      // Decode JWT (just the payload, we can't verify signature client-side)
      const parts = token.split('.');
      if (parts.length !== 3) {
        setTokenInfo({
          exists: true,
          valid: false,
          message: 'Invalid JWT format'
        });
        return;
      }

      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      const expired = payload.exp && payload.exp < now;

      setTokenInfo({
        exists: true,
        valid: true,
        expired,
        payload,
        tokenPreview: token.substring(0, 30) + '...'
      });
    } catch (error) {
      setTokenInfo({
        exists: true,
        valid: false,
        message: 'Error decoding token: ' + (error as Error).message
      });
    }
  };

  const testAPI = async () => {
    setTesting(true);
    const token = localStorage.getItem('auth_token');

    try {
      const response = await fetch('/api/site-layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          businessId: 'test',
          layout: { test: true }
        })
      });

      const data = await response.json();

      setTestResult({
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        data
      });
    } catch (error) {
      setTestResult({
        error: (error as Error).message
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <AdminLayout title="Authentication Debug" description="Check your admin authentication status">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Token Status</h2>
          
          {tokenInfo ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {tokenInfo.exists ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-semibold">
                  Token {tokenInfo.exists ? 'Found' : 'Not Found'}
                </span>
              </div>

              {tokenInfo.exists && tokenInfo.valid && (
                <>
                  <div className="flex items-center gap-2">
                    {tokenInfo.expired ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <span className="font-semibold">
                      Token {tokenInfo.expired ? 'Expired' : 'Valid'}
                    </span>
                  </div>

                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div><strong>User ID:</strong> {tokenInfo.payload.userId}</div>
                    <div><strong>Email:</strong> {tokenInfo.payload.email}</div>
                    <div><strong>Role:</strong> {tokenInfo.payload.role}</div>
                    {tokenInfo.payload.exp && (
                      <div>
                        <strong>Expires:</strong>{' '}
                        {new Date(tokenInfo.payload.exp * 1000).toLocaleString()}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      <strong>Token Preview:</strong><br />
                      {tokenInfo.tokenPreview}
                    </div>
                  </div>
                </>
              )}

              {tokenInfo.message && (
                <div className="flex items-start gap-2 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <span>{tokenInfo.message}</span>
                </div>
              )}
            </div>
          ) : (
            <div>Loading...</div>
          )}

          <Button onClick={checkToken} variant="outline" className="mt-4">
            Refresh Token Info
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">API Test</h2>
          <p className="text-muted-foreground mb-4">
            Test if your token works with the site-layout API endpoint
          </p>

          <Button onClick={testAPI} disabled={testing || !tokenInfo?.exists}>
            {testing ? 'Testing...' : 'Test API Call'}
          </Button>

          {testResult && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                {testResult.ok ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-semibold">
                  Status: {testResult.status} {testResult.statusText}
                </span>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <strong>Response:</strong>
                <pre className="text-xs mt-2 overflow-auto">
                  {JSON.stringify(testResult.data || testResult.error, null, 2)}
                </pre>
              </div>

              {testResult.status === 401 && (
                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <p className="font-semibold text-red-900 dark:text-red-100">
                    ⚠️ Unauthorized
                  </p>
                  <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                    Your token is not being accepted by the API. Try:
                  </p>
                  <ul className="text-sm text-red-800 dark:text-red-200 mt-2 list-disc list-inside">
                    <li>Log out and log back in</li>
                    <li>Check that your user account has admin role</li>
                    <li>Check server logs for more details</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>

        <Card className="p-6 bg-blue-50 dark:bg-blue-950">
          <h3 className="font-semibold mb-2">Quick Fixes</h3>
          <div className="space-y-2 text-sm">
            <p>1. <strong>Log out and back in:</strong> Go to /login and sign in again</p>
            <p>2. <strong>Check admin role:</strong> Verify your account has role = 'admin' in database</p>
            <p>3. <strong>Clear localStorage:</strong> Open Console (F12) and run: localStorage.clear()</p>
            <p>4. <strong>Check JWT_SECRET:</strong> Verify environment variable is set correctly</p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
