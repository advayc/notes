'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

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
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    try {
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

      if (error) throw error;
      setNotes([data, ...notes]);
      setNewNote({ title: '', content: '' });
    } catch (error) {
      console.error('Error adding note:', error);
    }
  }

  async function updateNote(e: React.FormEvent) {
    e.preventDefault();
    if (!editingNote) return;

    try {
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
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }

  async function deleteNote(id: string) {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
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
            />
            <Textarea
              placeholder="Note content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="min-h-[100px] bg-black/50 border-emerald-500/20 text-emerald-500 placeholder:text-emerald-500/50"
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
                    />
                    <Textarea
                      value={editingNote.content}
                      onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                      className="min-h-[100px] bg-black/50 border-emerald-500/20 text-emerald-500 placeholder:text-emerald-500/50"
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