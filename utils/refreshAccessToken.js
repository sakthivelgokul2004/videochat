
export async function refreshAccessToken(refreshToken) {
  console.log("refresh token genrated")
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.Client_ID,
      client_secret: process.env.Client_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json();
  return data; // { access_token, expires_in, token_type }
}
