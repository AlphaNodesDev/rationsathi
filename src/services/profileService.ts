import { ref, get, set, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/store/authStore';

export const saveProfile = async (uid: string, profile: UserProfile) => {
  try {
    await set(ref(db, `users/${uid}/profile`), profile);
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    return false;
  }
};

export const getProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const snapshot = await get(ref(db, `users/${uid}/profile`));
    return snapshot.val();
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};

export const updateProfile = async (uid: string, data: Partial<UserProfile>) => {
  try {
    await update(ref(db, `users/${uid}/profile`), data);
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
};
