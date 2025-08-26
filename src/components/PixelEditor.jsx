import React, { useEffect, useRef, useState } from 'react'

const DEFAULT_COLORS = [
  '#000000','#222222','#444444','#666666','#888888','#aaaaaa','#cccccc','#ffffff',
  '#ff0000','#ffa500','#ffff00','#7fff00','#00ff00','#00ffff','#0000ff','#8a2be2',
  '#ff1493','#ff69b4','#ffd700','#ff7f50','#1e90ff','#00bfff','#7fffd4','#98fb98',
  '#8b4513','#a0522d','#cd853f','#deb887','#f0e68c','#bdb76b','#808000','#556b2f'
]

function createGrid(w,h, fill='#00000000') {
  return Array.from({length: h}, () => Array.from({length: w}, () => fill))
}

export default function PixelEditor({
  width=16,
  height=16,
  initialPixels=null,
  onChange,
  onExportPng
}) {
  const [w, setW] = useState(width)
  const [h, setH] = useState(height)
  const [pixels, setPixels] = useState(initialPixels || createGrid(width, height))
  const [color, setColor] = useState('#ff00aa')
  const [tool, setTool] = useState('pencil') // pencil | eraser | picker
  const canvasRef = useRef(null)
  const drawing = useRef(false)

  useEffect(() => {
    draw()
  }, [pixels, w, h])

  function setSize(nw, nh) {
    const newGrid = createGrid(nw, nh, '#00000000')
    for (let y=0; y<Math.min(nh, pixels.length); y++) {
      for (let x=0; x<Math.min(nw, pixels[0].length); x++) {
        newGrid[y][x] = pixels[y][x]
      }
    }
    setW(nw); setH(nh); setPixels(newGrid); onChange?.(newGrid)
  }

  function draw() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const scale = Math.floor(512 / Math.max(w,h))
    canvas.width = w * scale
    canvas.height = h * scale
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = '#0b0e1a'
    ctx.fillRect(0,0,canvas.width,canvas.height)

    for (let y=0; y<h; y++) {
      for (let x=0; x<w; x++) {
        const c = pixels[y][x]
        if (c && c !== '#00000000') {
          ctx.fillStyle = c
          ctx.fillRect(x*scale, y*scale, scale, scale)
        }
        // grid line
        ctx.strokeStyle = 'rgba(255,255,255,0.03)'
        ctx.strokeRect(x*scale, y*scale, scale, scale)
      }
    }
  }

  function canvasPosToCell(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top
    const scale = Math.floor(512 / Math.max(w,h))
    const x = Math.floor(sx / scale), y = Math.floor(sy / scale)
    return {x, y}
  }

  function applyAt(e, isDrag=false) {
    const {x,y} = canvasPosToCell(e)
    if (x<0 || y<0 || x>=w || y>=h) return
    setPixels(prev => {
      const next = prev.map(row => row.slice())
      if (tool === 'pencil') next[y][x] = color
      else if (tool === 'eraser') next[y][x] = '#00000000'
      else if (tool === 'picker') setColor(prev[y][x] || '#00000000')
      onChange?.(next)
      return next
    })
  }

  function handleMouseDown(e) { drawing.current = true; applyAt(e) }
  function handleMouseMove(e) { if (drawing.current) applyAt(e, true) }
  function handleMouseUp() { drawing.current = false }
  function handleLeave() { drawing.current = false }

  function clearAll() {
    setPixels(createGrid(w,h)); onChange?.(createGrid(w,h))
  }

  function exportPng() {
    const dataUrl = canvasRef.current.toDataURL('image/png')
    onExportPng?.(dataUrl)
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'pixel-art.png'
    a.click()
  }

  return (
    <div className="grid" style={{gridTemplateColumns:'1fr', gap:16}}>
      <div className="card">
        <div className="editor-toolbar">
          <label>Narzędzie</label>
          <select value={tool} onChange={e=>setTool(e.target.value)}>
            <option value="pencil">✏️ Ołówek</option>
            <option value="eraser">🧽 Gumka</option>
            <option value="picker">🧪 Pipeta</option>
          </select>
          <label>Kolor</label>
          <input type="color" value={color} onChange={e=>setColor(e.target.value)} />
          <div className="palette">
            {DEFAULT_COLORS.map(c => (
              <div key={c} className="color-swatch" title={c} onClick={()=>setColor(c)} style={{background:c}} />
            ))}
          </div>
          <label>Szerokość</label>
          <input type="number" min={8} max={64} value={w} onChange={e=>setSize(Math.max(8, Math.min(64, parseInt(e.target.value)||8)), h)} />
          <label>Wysokość</label>
          <input type="number" min={8} max={64} value={h} onChange={e=>setSize(w, Math.max(8, Math.min(64, parseInt(e.target.value)||8)))} />
          <button className="secondary" onClick={clearAll}>Wyczyść</button>
          <button onClick={exportPng}>Eksportuj PNG</button>
        </div>
        <div className="editor-wrap">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleLeave}
            style={{width:512, height:512}}
          />
          <div className="card">
            <p>Porady:</p>
            <ul>
              <li>Rysuj myszką (przytrzymaj, aby ciągnąć).</li>
              <li>Użyj <b>Pipety</b>, aby pobrać kolor z płótna.</li>
              <li>Eksportuj PNG, aby zapisać obraz na komputerze.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
