'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { AlertCircle, PlusCircle, Trash2, Edit2, Clock, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      setIsLoading(true);
      setError(null);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // First, check if the notes table exists
      const { error: tableError } = await supabase
        .from('notes')
        .select('id')
        .limit(1)
        .single();

      if (tableError && tableError.code === 'PGRST116') {
        // Table doesn't exist, we'll create it later when adding a note
        setNotes([]);
        return;
      }

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      console.error('Error fetching notes:', error);
      setError(error.message || 'Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    try {
      setError(null);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            title: newNote.title,
            content: newNote.content,
            user_id: session.user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        // If the error is because the table doesn't exist, we need to create it
        if (error.code === 'PGRST116') {
          const createTableQuery = `
            CREATE TABLE IF NOT EXISTS notes (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              user_id UUID REFERENCES auth.users(id) NOT NULL,
              title TEXT NOT NULL,
              content TEXT NOT NULL,
              created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
            );
            
            ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY "Users can create their own notes" ON notes
              FOR INSERT WITH CHECK (auth.uid() = user_id);
              
            CREATE POLICY "Users can view their own notes" ON notes
              FOR SELECT USING (auth.uid() = user_id);
              
            CREATE POLICY "Users can update their own notes" ON notes
              FOR UPDATE USING (auth.uid() = user_id);
              
            CREATE POLICY "Users can delete their own notes" ON notes
              FOR DELETE USING (auth.uid() = user_id);
          `;
          
          // We can't run raw SQL from the client, so we'll show a helpful error
          setError("Notes table doesn't exist yet. Please create a table in your Supabase dashboard or contact the administrator.");
          return;
        }
        throw error;
      }

      setNotes([data, ...notes]);
      setNewNote({ title: '', content: '' });
      setIsCreating(false);
    } catch (error: any) {
      console.error('Error adding note:', error);
      setError(error.message || 'Failed to add note');
    }
  }

  async function updateNote(e: React.FormEvent) {
    e.preventDefault();
    if (!editingNote) return;

    try {
      setError(null);
      const { error } = await supabase
        .from('notes')
        .update({ 
          title: editingNote.title,
          content: editingNote.content
        })
        .eq('id', editingNote.id);

      if (error) throw error;
      setNotes(notes.map(note => 
        note.id === editingNote.id ? editingNote : note
      ));
      setEditingNote(null);
    } catch (error: any) {
      console.error('Error updating note:', error);
      setError(error.message || 'Failed to update note');
    }
  }

  async function deleteNote(id: string) {
    try {
      setError(null);
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error: any) {
      console.error('Error deleting note:', error);
      setError(error.message || 'Failed to delete note');
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="relative flex flex-col items-center gap-2">
          <div className="h-16 w-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
          <p className="text-emerald-500 mt-2 animate-pulse">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-500">Error</h3>
            <p className="text-red-500/80 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {!isCreating ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-emerald-500">My Notes</h2>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
            onClick={() => setIsCreating(true)}
          >
            <PlusCircle className="h-4 w-4" />
            New Note
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-emerald-500/20 bg-black/50 backdrop-blur-sm hover:border-emerald-500/40 transition-colors">
              <CardHeader>
                <CardTitle className="text-emerald-500 flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Create New Note
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={addNote} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Note title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="bg-black/50 border-emerald-500/20 text-emerald-500 placeholder:text-emerald-500/50"
                    required
                  />
                  <Textarea
                    placeholder="Note content"
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    className="min-h-[100px] bg-black/50 border-emerald-500/20 text-emerald-500 placeholder:text-emerald-500/50"
                    required
                  />
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Note
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsCreating(false)}
                      className="flex-1 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {notes.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden rounded-lg border border-dashed border-emerald-500/20 p-8 text-center">
          <div className="absolute inset-0 bg-grid-emerald/5" />
          <div className="relative">
            <PlusCircle className="h-12 w-12 text-emerald-500/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-emerald-500 mb-1">No notes yet</h3>
            <p className="text-emerald-500/70 mb-4">Create your first note to get started</p>
            {!isCreating && (
              <Button 
                onClick={() => setIsCreating(true)} 
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
              >
                Create Your First Note
              </Button>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div layout className="grid gap-4 md:grid-cols-2">
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-emerald-500/20 bg-black/50 backdrop-blur-sm hover:border-emerald-500/40 transition-colors h-full flex flex-col">
                  <CardContent className="pt-6 flex-grow">
                    {editingNote?.id === note.id ? (
                      <form onSubmit={updateNote} className="space-y-4">
                        <Input
                          type="text"
                          value={editingNote.title}
                          onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                          className="bg-black/50 border-emerald-500/20 text-emerald-500 placeholder:text-emerald-500/50"
                          required
                        />
                        <Textarea
                          value={editingNote.content}
                          onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                          className="min-h-[100px] bg-black/50 border-emerald-500/20 text-emerald-500 placeholder:text-emerald-500/50"
                          required
                        />
                        <div className="flex gap-2">
                          <Button 
                            type="submit" 
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition-colors"
                          >
                            Save
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex-1 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
                            onClick={() => setEditingNote(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-emerald-500">{note.title}</h3>
                        <p className="text-emerald-500/80 whitespace-pre-wrap">{note.content}</p>
                      </div>
                    )}
                  </CardContent>
                  
                  {!editingNote?.id && (
                    <CardFooter className="flex justify-between border-t border-emerald-500/10 pt-4">
                      <div className="flex items-center text-emerald-500/60 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(note.created_at), 'PPP')}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingNote(note)}
                          className="h-8 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteNote(note.id)}
                          className="h-8 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
} 