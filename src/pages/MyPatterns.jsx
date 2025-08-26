import React, { useEffect, useState } from 'react'
import { databases, IDs, Query } from '../api/appwrite'
import { Link } from 'react-router-dom'

export default function MyPatterns({ user }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const res = await databases.listDocuments(IDs.DB, IDs.COlLECTION, [
        Query.equal('$createdBy', user.$id)
      ]).catch(async () => {
        // Fallback kiedy Query.equal('$createdBy') nie jest wspierane:
        const all = await databases.listDocuments(IDs.DB, IDs.COLLECTION, [Query.limit(100)])
        return { documents: all.documents.filter(d => d.$permissions?.some(p => p.includes(user.$id))) }
      })
      // poprawka literówki w IDs.COlLECTION vs COLLECTION
      if (!res || !res.documents) {
        const all = await databases.listDocuments(IDs.DB, IDs.COLLECTION, [Query.limit(100)])
        setItems(all.documents)
      } else {
        setItems(res.documents)
      }
      setLoading(false)
    }
    load()
  }, [user.$id])

  return (
    <div>
      <h2>Moje wzory</h2>
      {loading && <p>Wczytywanie…</p>}
      {!loading && items.length === 0 && <p>Brak zapisanych wzorów.</p>}
      <div className="patterns-grid">
        {items.map(doc => (
          <Link key={doc.$id} to={`/pattern/${doc.$id}`} className="card">
            <strong style={{display:'block', marginBottom:8}}>{doc.name}</strong>
            <small style={{color:'#9ca3af'}}>{doc.width}×{doc.height}px</small>
          </Link>
        ))}
      </div>
    </div>
  )
}
