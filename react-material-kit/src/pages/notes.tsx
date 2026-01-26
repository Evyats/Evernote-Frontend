import type { Note } from 'src/utils/api';

import { useCallback, useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { addNote, deleteNote, getNote, listNotes, updateNote } from 'src/utils/api';

import { DashboardContent } from 'src/layouts/dashboard';

import { useAuth } from 'src/auth/AuthContext';

export default function NotesPage() {
  const { token, user } = useAuth();

  const [mode, setMode] = useState<'view' | 'edit' | 'new'>('view');
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftNote, setDraftNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const userId = user?.id ?? '';
  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) ?? null,
    [notes, selectedNoteId]
  );

  const resetDraft = useCallback(() => {
    setSelectedNoteId(null);
    setDraftName('');
    setDraftNote('');
    setActiveNote(null);
    setMode('view');
  }, []);

  const loadNotes = useCallback(async () => {
    if (!token || !userId) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await listNotes(userId, token);
      setNotes(result);
      if (result.length === 0) {
        resetDraft();
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [resetDraft, token, userId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const fetchAndSelectNote = async (noteId: number, nextMode: 'view' | 'edit') => {
    if (!token || !userId) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const fullNote = await getNote(userId, noteId, token);
      setNotes((prev) => prev.map((note) => (note.id === noteId ? fullNote : note)));
      setSelectedNoteId(noteId);
      setActiveNote(fullNote);
      setDraftName(fullNote.name);
      setDraftNote(fullNote.note);
      setMode(nextMode);
      // console.log(fullNote.name)
      // console.log(fullNote.note)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectNote = (note: Note) => {
    fetchAndSelectNote(note.id, 'view');
  };

  const handleEditNote = (note: Note) => {
    fetchAndSelectNote(note.id, 'edit');
  };

  const handleNewNote = () => {
    setSelectedNoteId(null);
    setActiveNote(null);
    setDraftName('');
    setDraftNote('');
    setMode('new');
  };

  const handleSave = async () => {
    if (!token || !userId) {
      return;
    }

    if (!draftNote.trim()) {
      setErrorMessage('Note content cannot be empty.');
      return;
    }

    if (mode === 'new' && !draftName.trim()) {
      setErrorMessage('Please enter a title for your note.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (mode === 'new') {
        const created = await addNote(userId, token, {
          name: draftName.trim(),
          note: draftNote.trim(),
        });
        await loadNotes();
        const createdId =
          typeof created === 'object' && created !== null
            ? ((created as { id?: number; note_id?: number; noteId?: number }).id ??
                (created as { note_id?: number }).note_id ??
                (created as { noteId?: number }).noteId)
            : null;
        if (createdId) {
          setSelectedNoteId(createdId);
          setMode('view');
        } else {
          resetDraft();
        }
      } else {
        await updateNote(userId, selectedNoteId ?? 0, token, { note: draftNote.trim() });
        setNotes((prev) =>
          prev.map((note) =>
            note.id === selectedNoteId ? { ...note, note: draftNote.trim() } : note
          )
        );
        setMode('view');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !userId || selectedNoteId === null) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    try {
      await deleteNote(userId, selectedNoteId, token);
      setNotes((prev) => prev.filter((note) => note.id !== selectedNoteId));
      resetDraft();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardContent maxWidth="lg">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4">Notes</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Review notes one by one, then jump into edit mode when needed.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
          <Card sx={{ flex: 1, p: 2, minWidth: { lg: 320 } }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={loadNotes} disabled={isLoading}>
                  {isLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
                <Button variant="contained" onClick={handleNewNote}>
                  New note
                </Button>
              </Stack>

              {errorMessage && (
                <Typography variant="body2" color="error">
                  {errorMessage}
                </Typography>
              )}

              <Divider />

              {notes.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No notes yet. Create your first note.
                </Typography>
              ) : (
                <List dense disablePadding>
                  {notes.map((note) => (
                    <ListItem
                      key={note.id}
                      disablePadding
                      secondaryAction={
                        <Button size="small" onClick={() => handleEditNote(note)}>
                          Edit
                        </Button>
                      }
                    >
                      <ListItemButton
                        selected={note.id === selectedNoteId}
                        onClick={() => handleSelectNote(note)}
                        sx={{ pr: 10 }}
                      >
                        <ListItemText
                          primary={note.name}
                          secondary={note.note ? note.note.slice(0, 80) : 'Empty note'}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </Stack>
          </Card>

          {mode === 'view' ? (
            <Card sx={{ flex: 2, p: 3 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6">
                    {activeNote?.name ?? selectedNote?.name ?? 'Select a note'}
                  </Typography>
                  {(activeNote ?? selectedNote) && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleEditNote(activeNote ?? selectedNote!)}
                    >
                      Edit
                    </Button>
                  )}
                </Stack>
                <Divider />
                {activeNote ? (
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {activeNote.note || 'No content yet.'}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Choose a note from the list to view its full content.
                  </Typography>
                )}
              </Stack>
            </Card>
          ) : (
            <Card sx={{ flex: 2, p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">{mode === 'new' ? 'New note' : 'Edit note'}</Typography>
                <TextField
                  label="Title"
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  placeholder="Note title"
                  disabled={mode === 'edit'}
                  helperText={mode === 'edit' ? 'Title is fixed for existing notes.' : undefined}
                />
                <TextField
                  label="Note"
                  value={draftNote}
                  onChange={(event) => setDraftNote(event.target.value)}
                  placeholder="Write your note here..."
                  multiline
                  minRows={8}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button variant="contained" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : mode === 'new' ? 'Create note' : 'Save changes'}
                  </Button>
                  <Button variant="outlined" onClick={() => setMode('view')} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDelete}
                    disabled={isSaving || selectedNoteId === null}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Card>
          )}
        </Stack>
      </Stack>
    </DashboardContent>
  );
}
