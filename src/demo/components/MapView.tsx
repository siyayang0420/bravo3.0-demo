// Real, interactive map for the Home screen — replaces the static Figma crop.
//
// Uses MapLibre GL (the open-source fork of Mapbox GL) with OpenFreeMap's
// free vector tiles: no account, no API key, no usage cap for a demo. The
// "positron" style is the clean, low-contrast light basemap that matches the
// original mock. To switch to Mapbox proper, swap `STYLE` for your Mapbox
// style URL and set maplibregl equivalent — the marker code stays the same.
import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// Free raster basemap, no token and no signup: CARTO's "Voyager" tiles — the
// colourful Google/Apple-style look with green parks, blue water and warm
// road casings. Raster keeps the pipeline dependency-free — no vector worker,
// glyphs or sprites to stall on. (Swap `rastertiles/voyager` for `light_all`
// to go back to the low-contrast Positron look, or point `STYLE` at a vector
// style URL for crisp vector labels.)
const STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    carto: {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution:
        '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [{ id: 'carto', type: 'raster', source: 'carto' }],
}

export type MapPlace = {
  id: string
  name: string
  /** Category + price line under the name, e.g. "Taiwanese & HK Café · $$". */
  meta?: string
  lng: number
  lat: number
  /** Thumbnail shown in the pin. */
  photo?: string
}

export default function MapView({
  center,
  zoom = 13.5,
  places = [],
  showUser = true,
}: {
  /** [lng, lat] the map opens on. */
  center: [number, number]
  zoom?: number
  places?: MapPlace[]
  /** Draw the blue "you are here" dot at the center. */
  showUser?: boolean
}) {
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markers = useRef<maplibregl.Marker[]>([])

  // One-time map setup. Center/zoom changes are handled by the effect below so
  // the map instance survives re-renders (rebuilding it would flash the tiles).
  useEffect(() => {
    if (!container.current) return
    const m = new maplibregl.Map({
      container: container.current,
      style: STYLE,
      center,
      zoom,
      attributionControl: { compact: true },
      // A leaderboard-style demo map: pan and zoom, but no tilt/rotate so it
      // always reads as a flat street map like the original.
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    })
    m.touchZoomRotate.disableRotation()
    map.current = m
    return () => {
      m.remove()
      map.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fly to a new center/zoom when props change (e.g. new restaurant set).
  useEffect(() => {
    map.current?.easeTo({ center, zoom, duration: 600 })
  }, [center, zoom])

  // Rebuild the markers whenever the place list changes.
  useEffect(() => {
    const m = map.current
    if (!m) return
    markers.current.forEach((mk) => mk.remove())
    markers.current = []

    if (showUser) {
      const dot = document.createElement('div')
      dot.className = 'bv-map-user'
      markers.current.push(
        new maplibregl.Marker({ element: dot, anchor: 'center' })
          .setLngLat(center)
          .addTo(m),
      )
    }

    for (const p of places) {
      const el = document.createElement('div')
      el.className = 'bv-map-pin'
      el.innerHTML = `
        <span class="bv-map-pin-photo"${
          p.photo ? ` style="background-image:url('${p.photo}')"` : ''
        }></span>
        <span class="bv-map-pin-text">
          <span class="bv-map-pin-name"></span>
          ${p.meta ? '<span class="bv-map-pin-meta"></span>' : ''}
        </span>`
      // textContent, not innerHTML, so a name can never inject markup.
      el.querySelector('.bv-map-pin-name')!.textContent = p.name
      if (p.meta) el.querySelector('.bv-map-pin-meta')!.textContent = p.meta
      markers.current.push(
        new maplibregl.Marker({ element: el, anchor: 'left' })
          .setLngLat([p.lng, p.lat])
          .addTo(m),
      )
    }
  }, [places, showUser, center])

  return <div ref={container} className="bv-map" />
}
