import { User } from '../types';

/**
 * Get the display name for a user based on their profile information
 * Priority: firstName > name > email > "Guest"
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) {
    return 'Guest';
  }

  // If user is a guest
  if (user.id === 'guest') {
    return 'Guest';
  }

  // Priority 1: First name
  if (user.firstName && user.firstName.trim()) {
    return user.firstName.trim();
  }

  // Priority 2: Full name
  if (user.name && user.name.trim()) {
    return user.name.trim();
  }

  // Priority 3: Email (extract name part before @)
  if (user.email && user.email.trim()) {
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }

  // Fallback
  return 'User';
};

/**
 * Get the full display name for a user
 * Priority: firstName + lastName > name > email > "Guest User"
 */
export const getUserFullDisplayName = (user: User | null): string => {
  if (!user) {
    return 'Guest User';
  }

  // If user is a guest
  if (user.id === 'guest') {
    return 'Guest User';
  }

  // Priority 1: First name + Last name
  if (user.firstName && user.lastName && user.firstName.trim() && user.lastName.trim()) {
    return `${user.firstName.trim()} ${user.lastName.trim()}`;
  }

  // Priority 2: Full name
  if (user.name && user.name.trim()) {
    return user.name.trim();
  }

  // Priority 3: Email (extract name part before @)
  if (user.email && user.email.trim()) {
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }

  // Fallback
  return 'User';
};
