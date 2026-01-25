import { useEffect, useState } from "react"
import { useAuth } from "../auth/AuthContext"

const API_BASE_URL = import.meta.env.VITE_API_URL_1


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
  const [errorNotes, setErrorNotes] = useState("")

  const [note, setNote] = useState<null | Note>(null)
  const [loadingNote, setLoadingNote] = useState(false)
  const [errorNote, setErrorNote] = useState("")



  const { token, userId } = useAuth()


  async function fetchNotes() {
    try {
      setLoadingNotes(true)
      setErrorNotes("")
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
        setErrorNotes("Can't fetch notes")
        return
      }
      const resultJson = await result.json()
      setNotes(resultJson)
    }
    catch {
      console.log("Can't fetch notes")
      setErrorNotes("Can't fetch notes")
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
              <p>Created at: {new Date(note.created).toLocaleString()}</p>
              <p>Note ID: {note.id}</p>
              <p className="mt-4 whitespace-pre-wrap">{note.note}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
