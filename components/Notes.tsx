'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return;
    }

    setNotes(data || []);
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notes')
      .insert([{ 
        title: newNote.title,
        content: newNote.content,
        user_id: user.id
      }])
      .select();

    if (error) {
      console.error('Error adding note:', error);
      return;
    }

    setNotes([data[0], ...notes]);
    setNewNote({ title: '', content: '' });
  }

  async function updateNote(e: React.FormEvent) {
    e.preventDefault();
    if (!editingNote) return;

    const { data, error } = await supabase
      .from('notes')
      .update({ 
        title: editingNote.title,
        content: editingNote.content
      })
      .eq('id', editingNote.id)
      .select();

    if (error) {
      console.error('Error updating note:', error);
      return;
    }

    setNotes(notes.map(note => 
      note.id === editingNote.id ? data[0] : note
    ));
    setEditingNote(null);
  }

  async function deleteNote(id: number) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
      return;
    }

    setNotes(notes.filter(note => note.id !== id));
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>My Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addNote} className="space-y-4 mb-8">
            <Input
              type="text"
              value={newNote.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewNote({ ...newNote, title: e.target.value })}
              placeholder="Note title..."
              className="w-full"
            />
            <textarea
              value={newNote.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="Note content..."
              className="min-h-[100px]"
            />
            <Button type="submit" className="w-full">Add Note</Button>
          </form>

          <div className="space-y-4">
            {notes.map((note) => (
              <Card key={note.id}>
                <CardContent className="pt-6">
                  {editingNote?.id === note.id ? (
                    <form onSubmit={updateNote} className="space-y-4">
                      <Input
                        type="text"
                        value={editingNote.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingNote({ ...editingNote, title: e.target.value })}
                        className="w-full"
                      />
                      <textarea
                        value={editingNote.content}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingNote({ ...editingNote, content: e.target.value })}
                        className="min-h-[100px]"
                      />
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">Save</Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setEditingNote(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">{note.title}</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingNote(note)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteNote(note.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{note.content}</p>
                      <p className="text-sm text-muted-foreground">
                        Created on {format(new Date(note.created_at), 'PPP')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 