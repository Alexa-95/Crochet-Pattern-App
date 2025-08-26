import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { databases, IDs } from '../api/appwrite'

function deserialize(s) {
  const {w,h,flat} = JSON.parse(s)
  const grid = Array.from({length:h}, (_,y)=>Array.from({length:w},(_,x)=>flat[y*w+x]))
  return {w,h,grid}
}

export default function ViewPattern() {
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    databases.getDocument(IDs.DB, IDs.COLLECTION, id).then(setDoc)
  }, [id])

  useEffect(() => {
    if (!doc) return
    const {w,h,grid} = deserialize(doc.pixels)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const scale = Math.floor(512 / Math.max(w,h))
    canvas.width = w*scale; canvas.height = h*scale
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = '#0b0e1a'; ctx.fillRect(0,0,canvas.width,canvas.height)
    for (let y=0;y<h;y++){
      for (let x=0;x<w;x++){
        const c = grid[y][x]
        if (c && c !== '#00000000') {
          ctx.fillStyle = c
          ctx.fillRect(x*scale, y*scale, scale, scale)
        }
      }
    }
  }, [doc])

  if (!doc) return <p>Wczytywanie…</p>

  return (
    <div>
      <h2 style={{marginTop:0}}>{doc.name}</h2>
      <p style={{color:'#9ca3af'}}>{doc.width}×{doc.height}px</p>
      <div className="card" style={{maxWidth: 560}}>
        <canvas ref={canvasRef} style={{width: '100%', height: '100%'}} />
      </div>
    </div>
  )
}
