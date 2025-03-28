"use client";
import { Database } from "@/types_db";
// Create supabase client
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// Create session context allow application to access current user
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";

interface SupabaseProviderProps {
    children: React.ReactNode;
}

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
    const [supabaseClient] = useState(() =>
        // Create supabase client with schema Database
        createClientComponentClient<Database>()
    );

    return (
        <SessionContextProvider supabaseClient={supabaseClient}>
            {children}
        </SessionContextProvider>
    )
}

export default SupabaseProvider;
