import React, { useEffect, useState, useRef } from 'react'
import PixelEditor from '../components/PixelEditor.jsx'
import { databases, IDs, ID, Permission, Role } from '../api/appwrite'

function serialize(pixels) {
  // Spłaszczamy tablicę 2D w 1D, aby zmniejszyć rozmiar dokumentu
  const h = pixels.length
  const w = pixels[0].length
  const flat = []
  for (let y=0;y<h;y++) for (let x=0;x<w;x++) flat.push(pixels[y][x])
  return JSON.stringify({w,h,flat})
}

function deserialize(s) {
  const {w,h,flat} = JSON.parse(s)
  const grid = Array.from({length:h}, (_,y)=>Array.from({length:w},(_,x)=>flat[y*w+x]))
  return grid
}

export default function Editor({ user }) {
  const [name, setName] = useState('Mój wzór')
  const [pixels, setPixels] = useState(null)
  const [size, setSize] = useState({w:16,h:16})
  const previewCanvasRef = useRef(null)

  useEffect(()=>{
    // nic
  },[])

  async function savePattern() {
    const body = {
      name,
      width: size.w,
      height: size.h,
      pixels: serialize(pixels)
    }
    const permissions = [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id))
    ]
    await databases.createDocument(IDs.DB, IDs.COLLECTION, ID.unique(), body, permissions)
    alert('Zapisano 🎉')
  }

  function handleChange(newPixels) {
    if (!newPixels) return
    setPixels(newPixels)
    setSize({w:newPixels[0].length, h:newPixels.length})
    // rysujemy miniaturę
    const canvas = previewCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const scale = Math.floor(128 / Math.max(newPixels[0].length, newPixels.length))
    canvas.width = newPixels[0].length * scale
    canvas.height = newPixels.length * scale
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0,0,canvas.width,canvas.height)
    for (let y=0;y<newPixels.length;y++){
      for (let x=0;x<newPixels[0].length;x++){
        const c = newPixels[y][x]
        if (c && c !== '#00000000') {
          ctx.fillStyle = c
          ctx.fillRect(x*scale, y*scale, scale, scale)
        }
      }
    }
  }

  return (
    <div className="grid" style={{gridTemplateColumns:'1fr 280px'}}>
      <div>
        <PixelEditor width={size.w} height={size.h} initialPixels={pixels} onChange={handleChange} />
      </div>
      <aside className="card">
        <h3 style={{marginTop:0}}>Zapis wzoru</h3>
        <label>Nazwa wzoru</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Mój wzór" />
        <div style={{margin:'12px 0'}}>
          <div className="pattern-thumb">
            <canvas ref={previewCanvasRef} style={{width:'100%',height:'100%'}} />
          </div>
          <p style={{marginTop:8, color:'#9ca3af'}}>{size.w} × {size.h}px</p>
        </div>
        <button onClick={savePattern} disabled={!pixels}>Zapisz w Appwrite</button>
      </aside>
    </div>
  )
}
