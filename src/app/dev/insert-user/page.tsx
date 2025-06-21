//This is for testing
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function InsertUserPage() {
    const [status, setStatus] = useState<string>('Pending...');

    useEffect(() => {
        const insertUser = async () => {
            const { data, error } = await supabase.from('users').insert([
                {
                    email: 'compliance@prodetect.com',
                    role: 'analyst',
                },
            ]);

            if (error) {
                console.error('❌ Error inserting user:', error.message);
                setStatus(`❌ Error: ${error.message}`);
            } else {
                console.log('✅ User inserted:', data);
                setStatus('✅ User inserted successfully');
            }
        };

        insertUser();
    }, []);

    return (
        <main className="p-6">
            <h1 className="text-xl font-bold">Insert Test User</h1>
            <p className="mt-2">Status: {status}</p>
        </main>
    );
}
