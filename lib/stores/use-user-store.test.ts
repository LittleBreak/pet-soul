import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from './use-user-store';

describe('useUserStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useUserStore.setState({
      userProfile: {
        name: 'Guest User',
        avatar: '',
      },
      myPets: [],
      remainingFreeQuota: 5,
    });
  });

  it('should initialize with default values', () => {
    const state = useUserStore.getState();
    expect(state.userProfile).toEqual({
      name: 'Guest User',
      avatar: '',
    });
    expect(state.myPets).toEqual([]);
    expect(state.remainingFreeQuota).toBe(5);
  });

  it('should decrement quota', () => {
    const state = useUserStore.getState();
    expect(state.remainingFreeQuota).toBe(5);

    state.decrementQuota();
    expect(useUserStore.getState().remainingFreeQuota).toBe(4);
  });

  it('should not decrement quota below 0', () => {
    useUserStore.setState({ remainingFreeQuota: 0 });
    
    useUserStore.getState().decrementQuota();
    expect(useUserStore.getState().remainingFreeQuota).toBe(0);
  });

  it('should update pet profile (add new pet)', () => {
    const newPet = { name: 'Fluffy', type: 'Cat' };
    
    useUserStore.getState().updatePetProfile(newPet);
    
    expect(useUserStore.getState().myPets).toHaveLength(1);
    expect(useUserStore.getState().myPets[0]).toEqual(newPet);

    const anotherPet = { name: 'Rex', type: 'Dog' };
    useUserStore.getState().updatePetProfile(anotherPet);

    expect(useUserStore.getState().myPets).toHaveLength(2);
    expect(useUserStore.getState().myPets[1]).toEqual(anotherPet);
  });
});
