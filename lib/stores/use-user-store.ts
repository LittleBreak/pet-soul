import { create } from 'zustand';

// Placeholder type for Phase 2
type PetProfile = Record<string, unknown>;

interface UserState {
  userProfile: {
    name: string;
    avatar: string;
  } | null;
  myPets: PetProfile[]; 
  remainingFreeQuota: number;
}

interface UserActions {
  decrementQuota: () => void;
  updatePetProfile: (pet: PetProfile) => void;
}

export const useUserStore = create<UserState & UserActions>((set) => ({
  userProfile: {
    name: 'Guest User',
    avatar: '',
  },
  myPets: [],
  remainingFreeQuota: 5, // Default 5 free tries

  decrementQuota: () => set((state) => ({
    remainingFreeQuota: Math.max(0, state.remainingFreeQuota - 1)
  })),

  updatePetProfile: (pet) => set((state) => ({
    myPets: [...state.myPets, pet] 
  })),
}));