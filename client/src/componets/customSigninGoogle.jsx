import React, { useEffect } from 'react'
import { useGoogleLogin } from '@react-oauth/google';

const CustomSigninGoogle = () => {
  const redirectUri = `${window.location.origin}/api/auth/callback`;

  const login = useGoogleLogin({
    onSuccess: tokenResponse => console.log(tokenResponse),
    ux_mode: "redirect",
    redirect_uri: redirectUri,
    flow: 'auth-code',
    state: "login"
  });

  return (
    <div>
      <button onClick={() => { login() }} className="btn my-3 btn-primary text-lg"  >
        Login via Google
      </button>
    </div>
  )

}
const customButtonStyle = {
  backgroundColor: '#4285F4',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  padding: '10px 20px',
  cursor: 'pointer',
  fontSize: '16px',
};
export default CustomSigninGoogle
