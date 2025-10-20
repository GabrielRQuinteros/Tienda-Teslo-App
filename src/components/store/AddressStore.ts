import { Address } from '@/helpers';
import { create } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware';

interface State {
    address?: Address
}

interface Actions {
  setAddressFromStore: ( address: Address|undefined ) => void,
  getAddressFromStore: () => Address | undefined
}

type AddressStore = State & Actions;


export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      address: undefined,
      setAddressFromStore: (address: Address|undefined) => {
        set({ address });
      },
      getAddressFromStore: () => {
        return get().address;
      } 
    }),
    {
      name: 'address-storage',
    } as PersistOptions<AddressStore>
  )
);
