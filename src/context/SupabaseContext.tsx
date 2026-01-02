import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createClient, SupabaseClient, type Session } from '@supabase/supabase-js';

// Environment variables should be in .env (or .env.local)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface SupabaseContextType {
    supabase: SupabaseClient | null;
    session: Session | null;
    isLoading: boolean;
    isConnected: boolean;
    signInWithPhone: (phone: string) => Promise<{ error: { message: string } | null }>;
    verifyOtp: (phone: string, token: string) => Promise<{ error: { message: string } | null }>;
    signOut: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType>({} as SupabaseContextType);

// Singleton client (to avoid recreation on renders if env vars are stable)
let supabaseClient: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!supabaseClient) {
            setIsLoading(false);
            return;
        }

        // Get initial session
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithPhone = async (phone: string) => {
        if (!supabaseClient) return { error: { message: "Supabase not configured" } };
        return await supabaseClient.auth.signInWithOtp({
            phone,
        });
    };

    const verifyOtp = async (phone: string, token: string) => {
        if (!supabaseClient) return { error: { message: "Supabase not configured" } };
        return await supabaseClient.auth.verifyOtp({
            phone,
            token,
            type: 'sms',
        });
    };

    const signOut = async () => {
        if (!supabaseClient) return;
        await supabaseClient.auth.signOut();
    };

    return (
        <SupabaseContext.Provider value={{
            supabase: supabaseClient,
            session,
            isLoading,
            isConnected: !!supabaseClient,
            signInWithPhone,
            verifyOtp,
            signOut
        }}>
            {children}
        </SupabaseContext.Provider>
    );
};

export const useSupabase = () => useContext(SupabaseContext);
