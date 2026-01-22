import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * Tracks the current Supabase session and user.
 * - On first load: reads existing session from local storage
 * - Subscribes to auth state changes (login/logout)
 */
export function useAuth() {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function init() {
            const { data, error } = await supabase.auth.getSession();
            if (!mounted) return;

            if (error) {
                console.error("getSession error:", error);
            }

            setSession(data.session ?? null);
            setUser(data.session?.user ?? null);
            setAuthLoading(false);
        }

        init();

        const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession ?? null);
            setUser(newSession?.user ?? null);
            setAuthLoading(false);
        });

        return () => {
            mounted = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    return { session, user, authLoading, isAuthed: !!user };
}
