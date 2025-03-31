"use client";

import React, { useEffect, useState } from 'react';
import { useSelectionBox } from './SelectionContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

const SelectionBox: React.FC = () => {
  const selectionBox = useSelectionBox();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    // Check if user is authenticated
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  if (!user || !selectionBox.isSelecting || selectionBox.width === 0 || selectionBox.height === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: `${selectionBox.left}px`,
        top: `${selectionBox.top}px`,
        width: `${selectionBox.width}px`,
        height: `${selectionBox.height}px`,
        backgroundColor: 'rgba(16, 185, 129, 0.1)', // emerald-500 with 0.1 opacity
        border: '1px solid #10b981', // emerald-500
        pointerEvents: 'none',
      }}
    />
  );
};

export default SelectionBox; 