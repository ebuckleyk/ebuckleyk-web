import { useUser } from '@auth0/nextjs-auth0';
import { useCallback } from 'react';

const role_namespace = 'roles';

const is_in_all_roles = (roles = [], user) => {
  let ret = true;
  for (let i = 0; i < roles.length; i++) {
    const check_role = roles[i];
    if (!user[role_namespace].includes(check_role)) {
      ret = false;
      break;
    }
  }
  return ret;
};
const is_in_role = (user, roles = [], allInclusive = true) => {
  if (!user || !user[role_namespace] || !user[role_namespace].length)
    return false;
  if (allInclusive) return is_in_all_roles(roles, user);

  let ret = false;
  for (let i = 0; i < roles.length; i++) {
    const check_role = roles[i];
    if (user[role_namespace].includes(check_role)) {
      ret = true;
      break;
    }
  }
  return ret;
};

const normalizeProfileImageUrl = (url) => {
  if (!url) return '';

  if (url.includes('googleusercontent')) {
    // enhance google image quality
    return url.replace('s96-', 's300-');
  } else if (url.includes('twimg')) {
    // enhance twitter image quality
    return url.replace('_normal', '');
  }
  return url;
};
export default function useAuth0User() {
  const { user, error, isLoading, checkSession } = useUser();
  const inRoles = useCallback(
    (roles, inAllRoles = true) => {
      const all_roles = Array.isArray(roles) ? roles : roles.split(',');
      return is_in_role(user, all_roles, inAllRoles);
    },
    [user]
  );

  return {
    user,
    error,
    isLoading,
    checkSession,
    inRoles,
    isLoggedIn: !!user,
    profilePicture: normalizeProfileImageUrl(
      user?.user_metadata?.profileImageUrl
        ? `${process.env.NEXT_PUBLIC_CDN}/${user.user_metadata.profileImageUrl}`
        : user?.picture
    )
  };
}
