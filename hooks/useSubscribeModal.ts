import { create } from 'zustand';

interface SubscribeModalStore {
  isOpen: boolean;
  mode: "login" | "signup";
  onOpen: (mode?: "login" | "signup") => void;
  onClose: () => void;
}

const useSubscribeModal = create<SubscribeModalStore>((set) => ({
  isOpen: false,
  mode: "login",
  onOpen: (mode = "login") => set({isOpen: true, mode}),
  onClose: () => set({isOpen: false}),
}));

export default useSubscribeModal;
