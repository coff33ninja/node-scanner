import { Request, Response } from 'express';
import { supabase } from '../config/supabase.config';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) throw error;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { name, email, avatarUrl } = req.body;
    const { data: user, error } = await supabase
      .from('users')
      .update({ 
        name: name || undefined,
        email: email || undefined,
        avatar_url: avatarUrl || undefined,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user.id)
      .select()
      .single();
    
    if (error) throw error;
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};