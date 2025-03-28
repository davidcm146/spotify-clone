import { create } from 'zustand';

interface AuthModalStore {
  isOpen: boolean;
  mode: "login" | "signup";
  onOpen: (mode?: "login" | "signup") => void;
  onClose: () => void;
}

const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  mode: "login",
  onOpen: (mode = "login") => set({isOpen: true, mode}),
  onClose: () => set({isOpen: false}),
}));

export default useAuthModal;
