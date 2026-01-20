import Express from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.Model.js";
import { addUser, getUserDetail } from "../controller/authController.js";
import { refreshAccessToken } from "../utils/refreshAccessToken.js"
let router = Express.Router();
const client = new OAuth2Client(process.env.Client_ID);
router.post("/addUser", addUser);
router.get("/user", async (req, res) => {
  let body = req.cookies
  console.log("logging")
  if (body.access_token) {
    console.log("had access token")
    try {
      const info = await client.getTokenInfo(body.access_token)
      console.log(info.email)
      if (info.email) {
        let doc = await User.findOne({ email: info.email });
        console.log(doc)
        res.send(doc);
      }
      else if (body) {
        console.log("had refresh token")
        const token = await refreshAccessToken(body.refresh_token);
        res.cookie('access_token', token.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
          maxAge: 60 * 60 * 1000,
        });
      }
      else {
        console.log("had nothing")
        res.status(400).send("not authzed");
        res.redirect("/home")
      }
    } catch (error) {
      console.log(error)
      return res.status(400).send('Authorization code not found.');
    }

  }
  else {
    console.log("had nothing")
    res.status(400).send("not authzed");
  }
}
)
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  const redirectUri = `${req.protocol}://${req.get("host")}/api/auth/callback`;
  if (!code) {
    return res.status(400).send('Authorization code not found.');
  }
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.Client_ID,
        client_secret: process.env.Client_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });
    const tokens = await response.json();
    console.log('Tokens received:', tokens);
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 60 * 60 * 1000,
    });
    const clientId = "321973348565-t6eh5frql84m4anaq9b3i82afbdguhfg.apps.googleusercontent.com";
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    console.log('User ID:', payload['sub']);

    let result = User.create({
      userName: payload.name,
      photoUrl: payload.picture,
      email: payload.email,
    });
    (await result).save();
    console.log(result)

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const redirectUrl = `/success`
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.status(500).send('Authentication failed.');
  }
});
export default router;
