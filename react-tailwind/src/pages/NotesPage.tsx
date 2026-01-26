import { useEffect, useState } from "react"
import { useAuth } from "../auth/AuthContext"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL


export default function NotesPage() {


  type NoteListEntry = {
    created: string
    id: string
    name: string
  }

  type Note = {
    created: string
    id: string
    name: string
    note: string
  }

  const [notes, setNotes] = useState<null | NoteListEntry[]>(null)
  const [loadingNotes, setLoadingNotes] = useState(false)

  const [note, setNote] = useState<null | Note>(null)
  const [loadingNote, setLoadingNote] = useState(false)
  const [errorNote, setErrorNote] = useState("")

  const [newNoteName, setNewNoteName] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [savingNewNote, setSavingNewNote] = useState(false)
  const [errorNewNote, setErrorNewNote] = useState("")

  const [isEditingNote, setIsEditingNote] = useState(false)
  const [editedNoteContent, setEditedNoteContent] = useState("")
  const [savingNote, setSavingNote] = useState(false)
  const [errorSaveNote, setErrorSaveNote] = useState("")

  const [removingNote, setRemovingNote] = useState(false)
  const [errorRemoveNote, setErrorRemoveNote] = useState("")



  const { token, userId } = useAuth()


  async function fetchNotes() {
    try {
      setLoadingNotes(true)
      setNotes(null)
      const result = await fetch(
        `${API_BASE_URL}/api/users/${userId}/notes`,
        {
          headers: {
            "authorization": `Bearer ${token}`
          }
        }
      )
      console.log("userId:", userId)
      if (!result.ok) {
        console.log("Can't fetch notes, status:", result.status)
        return
      }
      const resultJson = await result.json()
      setNotes(resultJson)
    }
    catch {
      console.log("Can't fetch notes")
    }
    finally {
      setLoadingNotes(false)
    }
  }


  async function fetchNote(noteId: string) {
    try {
      setLoadingNote(true)
      setErrorNote("")
      setNote(null)
      setIsEditingNote(false)
      setErrorSaveNote("")
      setErrorRemoveNote("")
      const result = await fetch(
        `${API_BASE_URL}/api/users/${userId}/notes/${noteId}`,
        {
          headers: {
            "authorization": `Bearer ${token}`
          }
        }
      )
      if (!result.ok) {
        // Try to extract a more specific error message from the response, if available
        let errorMessage = `Can't fetch note (status ${result.status})`
        try {
          const errorBody = await result.json()
          if (errorBody && typeof errorBody.message === "string") {
            errorMessage = errorBody.message
          }
        } catch {
          // Ignore JSON parse errors and use the default message
        }
        setErrorNote(errorMessage)
        throw new Error(errorMessage)
      }
      const resultJson = await result.json()
      setNote(resultJson)
      setEditedNoteContent(resultJson.note ?? "")
    }
    catch {
      console.log("Can't fetch note")
      if (!errorNote) {
        setErrorNote("Can't fetch note")
      }
    }
    finally {
      setLoadingNote(false)
    }
  }



  function handleNoteSelection(noteId: string) {
    // console.log("Selected note id:", noteId)
    fetchNote(noteId)
  }

  async function handleAddNote() {
    if (!newNoteName.trim() || !newNoteContent.trim()) {
      setErrorNewNote("Please enter a name and note text")
      return
    }
    try {
      setSavingNewNote(true)
      setErrorNewNote("")
      const result = await fetch(
        `${API_BASE_URL}/api/users/${userId}/notes`,
        {
          method: "POST",
          headers: {
            "authorization": `Bearer ${token}`,
            "content-type": "application/json"
          },
          body: JSON.stringify({
            name: newNoteName.trim(),
            note: newNoteContent
          })
        }
      )
      if (!result.ok) {
        setErrorNewNote("Can't add note")
        return
      }
      setNewNoteName("")
      setNewNoteContent("")
      await fetchNotes()
    }
    catch {
      setErrorNewNote("Can't add note")
    }
    finally {
      setSavingNewNote(false)
    }
  }

  function handleEditNoteStart() {
    if (!note) {
      return
    }
    setEditedNoteContent(note.note ?? "")
    setIsEditingNote(true)
    setErrorSaveNote("")
  }

  function handleEditNoteCancel() {
    if (!note) {
      return
    }
    setEditedNoteContent(note.note ?? "")
    setIsEditingNote(false)
    setErrorSaveNote("")
  }

  async function handleEditNoteSave() {
    if (!note) {
      return
    }
    if (!editedNoteContent.trim()) {
      setErrorSaveNote("Note content can't be empty")
      return
    }
    try {
      setSavingNote(true)
      setErrorSaveNote("")
      const result = await fetch(
        `${API_BASE_URL}/api/users/${userId}/notes/${note.id}`,
        {
          method: "PUT",
          headers: {
            "authorization": `Bearer ${token}`,
            "content-type": "application/json"
          },
          body: JSON.stringify({
            note: editedNoteContent
          })
        }
      )
      if (!result.ok) {
        setErrorSaveNote("Can't save note")
        return
      }
      await fetchNote(note.id)
      await fetchNotes()
      setIsEditingNote(false)
    }
    catch {
      setErrorSaveNote("Can't save note")
    }
    finally {
      setSavingNote(false)
    }
  }

  async function handleRemoveNote() {
    if (!note) {
      return
    }
    try {
      setRemovingNote(true)
      setErrorRemoveNote("")
      const result = await fetch(
        `${API_BASE_URL}/api/users/${userId}/notes/${note.id}`,
        {
          method: "DELETE",
          headers: {
            "authorization": `Bearer ${token}`
          }
        }
      )
      if (!result.ok) {
        setErrorRemoveNote("Can't remove note")
        return
      }
      setNote(null)
      setIsEditingNote(false)
      await fetchNotes()
    }
    catch {
      setErrorRemoveNote("Can't remove note")
    }
    finally {
      setRemovingNote(false)
    }
  }




  useEffect(() => {
    if (!userId || !token) {
      return
    }
    fetchNotes()
    console.log("Fetching notes...")
    // console.log(notes)
  }, [userId, token])



  return (
    <div className="p-5">
      Notes page

      <div className="flex flex-row border rounded-xl p-3 gap-2">
        <div className="flex-[1] flex flex-col gap-2 rounded p-2">
          <div className=" p-2 flex flex-col gap-2 items-center">
            <input
              className="border rounded px-2 py-1 text-black"
              placeholder="Note title"
              value={newNoteName}
              onChange={(event) => setNewNoteName(event.target.value)}
            />
            <textarea
              className="border rounded px-2 py-1 min-h-[120px] text-black w-full"
              placeholder="Write a new note..."
              value={newNoteContent}
              onChange={(event) => setNewNoteContent(event.target.value)}
            />
            { errorNewNote && (
              <p className="text-red-600">{errorNewNote}</p>
            )}
            <button
              className="border rounded px-2 py-1"
              onClick={handleAddNote}
              disabled={savingNewNote}
            >
              {savingNewNote ? "Adding..." : "+"}
            </button>
          </div>
          { loadingNotes && (
            <p>Loading notes...</p>
          )}
          {
            notes && notes.map((note) => (
              <button key={note.id} className="border rounded" onClick={() => handleNoteSelection(note.id)}>{note.name}</button>
            ))
          }
        </div>

        <div className="border flex-[3] rounded p-2">
          { loadingNote && (
            <p>Loading note...</p>
          )}
          { note && (
            <div>
              <h2 className="font-bold text-lg mb-2">{note.name}</h2>
              <div className="flex flex-row gap-2 mb-2">
                <button
                  className="border rounded px-2 py-1"
                  onClick={handleEditNoteStart}
                  disabled={isEditingNote}
                >
                  Edit
                </button>
                <button
                  className="border rounded px-2 py-1"
                  onClick={handleRemoveNote}
                  disabled={removingNote || savingNote}
                >
                  {removingNote ? "Removing..." : "Remove"}
                </button>
              </div>
              <p>Created at: {new Date(note.created).toLocaleString()}</p>
              <p>Note ID: {note.id}</p>
              { isEditingNote ? (
                <div className="mt-4 flex flex-col gap-2">
                  <textarea
                    className="border rounded px-2 py-1 min-h-[160px] text-black"
                    value={editedNoteContent}
                    onChange={(event) => setEditedNoteContent(event.target.value)}
                  />
                  { errorSaveNote && (
                    <p className="text-red-600">{errorSaveNote}</p>
                  )}
                  { errorRemoveNote && (
                    <p className="text-red-600">{errorRemoveNote}</p>
                  )}
                  <div className="flex flex-row gap-2">
                    <button
                      className="border rounded px-2 py-1"
                      onClick={handleEditNoteSave}
                      disabled={savingNote}
                    >
                      {savingNote ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="border rounded px-2 py-1"
                      onClick={handleEditNoteCancel}
                      disabled={savingNote}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-4 whitespace-pre-wrap">{note.note}</p>
              )}
            </div>
          )}
          { errorNote && (
            <p className="text-red-600">{errorNote}</p>
          )}
        </div>
      </div>

    </div>
  )
}
