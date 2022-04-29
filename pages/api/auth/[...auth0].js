import { handleAuth } from '@auth0/nextjs-auth0';

/**
 * Executing handleAuth() creates the following route handlers under the hood that perform the different parts of authentication flow:
 *  - /api/auth/login: Your Next.js application redirects users to your Identity Provider for them to log in (you can optionally pass a returnTo
 *        parameter to return to a custom relative URL after login, eg /api/auth/login?returnTo=/profile).
 *  - /api/auth/callback: Your Identity Provider redirects users to this route after they successfully log in
 *  - /api/auth/logout: Your Next.js application logs out the user.
 *  - /api/auth/me: You can fetch user profile information in JSON format.
 */

export default handleAuth();
