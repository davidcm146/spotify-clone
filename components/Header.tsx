"use client";

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import usePlayer from "@/hooks/usePlayer";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { FaUserAlt } from "react-icons/fa";
import toast from "react-hot-toast";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();
  const authModal = useAuthModal();
  const supabaseClient = useSupabaseClient();
  const player = usePlayer();
  const { user, subscription } = useUser();

  const hanndleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    player.reset();
    router.refresh();
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Logout successfully')
    }
  }
  return (
    <div className={twMerge('h-fit bg-gradient-to-b from-emerald-800 p-6', className)}>
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button onClick={() => router.back()} className="rounded-full bg-black flex items-center justify-center cursor-pointer hover:opacity-75 transition" >
            <RxCaretLeft size={35} className="text-white" />
          </button>
          <button onClick={() => router.forward()} className="rounded-full bg-black flex items-center justify-center cursor-pointer hover:opacity-75 transition" >
            <RxCaretRight size={35} className="text-white" />
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 cursor-pointer transition">
            <HiHome className="text-black" size={20} />
          </button>
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 cursor-pointer transition">
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        <div className="flex justify-between items-center gap-x-4 ">
          {user ? (
            <div className="flex gap-x-4 items-center">
              <Button onClick={hanndleLogout} className="bg-white px-6 py-2">
                Logout
              </Button>
              <Button>
                <FaUserAlt onClick={() => 
                  router.push('/account')} size={20} />
              </Button>
            </div>
          ) : (
            <>
              <div className="">
                <Button onClick={() => authModal.onOpen("signup")} className="bg-transparent text-neutral-300 font-medium">
                  Sign up
                </Button>
              </div>
              <div className="">
                <Button onClick={() => authModal.onOpen("login")} className="bg-white px-6 py-2">
                  Log in
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

export default Header