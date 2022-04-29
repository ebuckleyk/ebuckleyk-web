import { ManagementClient } from 'auth0';

export async function getAuth0ManagementClient(scopes) {
  const client = new ManagementClient({
    domain: process.env.AUTH0_ISSUER_BASE_URL.replace('https://', ''),
    clientId: process.env.AUTH0_SERVERLESS_CLIENTID,
    clientSecret: process.env.AUTH0_SERVERLESS_SECRETID,
    scope: scopes
  });

  return client;
}

export function getCuratedProfile(userProfileResponse) {
  const {
    created_at,
    email_verified,
    identities,
    nickname,
    updated_at,
    last_ip,
    last_login,
    last_password_reset,
    logins_count,
    ...rest
  } = userProfileResponse;
  return rest;
}
