import { create } from 'zustand';

export type UserProfile = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
};

type UserState = {
  profile: UserProfile;

  updateProfile: (
    data: Partial<UserProfile>,
  ) => void;

  resetProfile: () => void;
};

const defaultProfile: UserProfile = {
  name: 'Ashish Kumar',
  phone: '',
  email: '',
  address: '',
  city: '',
  pincode: '',
};

export const useUserStore =
  create<UserState>((set) => ({
    profile: defaultProfile,

    updateProfile: (data) => {
      set((state) => ({
        profile: {
          ...state.profile,
          ...data,
        },
      }));
    },

    resetProfile: () => {
      set({
        profile: defaultProfile,
      });
    },
  }));