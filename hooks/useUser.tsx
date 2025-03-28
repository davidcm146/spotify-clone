import { UserDetails, Subscription } from "@/types";
import { User } from "@supabase/auth-helpers-nextjs";
// Get current user and session from supabase
import { useSessionContext, useUser as useSupabaseUser } from "@supabase/auth-helpers-react";
import { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

// Signature in Typescript, trick: can retrieve any props dynamically without defining them
export interface Props {
  [ propName: string ]: any;
};

export const MyUserContextProvider = (props: Props) => {
  // Check process session and user
  const { session, isLoading: isLoadingUser, supabaseClient: supabase } = useSessionContext();
  const user = useSupabaseUser();
  const accessToken = session?.access_token ?? null;
  // Check process of getting data from user and subscription
  const [ isLoadingData, setIsLoadingData ] = useState(false);
  const [ userDetails, setUserDetails ] = useState<UserDetails | null>(null);
  const [ subscription, setSubscription ] = useState<Subscription | null>(null);

  const getUserDetails = () => supabase.from('users').select('*').single();
  const getSubscription = () => supabase.from('subscriptions').select('*, prices(*, products(*))').in('status', ['trialing', 'active']).single();

  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription){
      setIsLoadingData(true);
      Promise.allSettled([getUserDetails(), getSubscription()]).then((res) => {
        const userDetailsPromise = res[0];
        const subscriptionPromise = res[1];

        if (userDetailsPromise.status === 'fulfilled'){
          setUserDetails(userDetailsPromise.value.data as UserDetails);
        }

        if (subscriptionPromise.status === 'fulfilled') {
            setSubscription(subscriptionPromise.value.data as Subscription);
        }

        setIsLoadingData(false);
      })
    } else if (!user && !isLoadingUser && !isLoadingData) {
        setUserDetails(null);
        setSubscription(null);
    }
  }, [user, isLoadingUser]);

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription
  };

  return <UserContext.Provider value={value} {...props} />
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error ('useUser must be used within MyUserContextProvider');
  }
  return context;
}
