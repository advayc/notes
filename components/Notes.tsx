'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';

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
      <div className="text-center text-emerald-500 py-8">
        <div className="animate-pulse">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-500">Error</h3>
            <p className="text-red-500/80 text-sm">{error}</p>
          </div>
        </div>
      )}

      <Card className="border-emerald-500/20 bg-black/50 backdrop-blur-sm hover:border-emerald-500/40 transition-colors">
        <CardHeader>
          <CardTitle className="text-emerald-500">Create New Note</CardTitle>
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
            <Button 
              type="submit" 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition-colors"
            >
              Add Note
            </Button>
          </form>
        </CardContent>
      </Card>

      {notes.length === 0 ? (
        <div className="text-center text-emerald-500/80 p-8 border border-dashed border-emerald-500/20 rounded-lg">
          No notes yet. Create your first note above!
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id} className="border-emerald-500/20 bg-black/50 backdrop-blur-sm hover:border-emerald-500/40 transition-colors">
              <CardContent className="pt-6">
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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-emerald-500">{note.title}</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingNote(note)}
                          className="border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteNote(note.id)}
                          className="bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-500/20 transition-colors"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-emerald-500/80 whitespace-pre-wrap">{note.content}</p>
                    <p className="text-sm text-emerald-500/60">
                      Created on {format(new Date(note.created_at), 'PPP')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 