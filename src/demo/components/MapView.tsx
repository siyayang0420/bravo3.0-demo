// Real, interactive map for the Home screen — replaces the static Figma crop.
//
// Uses MapLibre GL (the open-source fork of Mapbox GL) with VersaTiles' free
// vector tiles: no account, no API key, no usage cap for a demo. To switch to
// Mapbox proper, swap `VECTOR_STYLE` for your Mapbox style URL — the marker
// code stays the same.
import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// ---------------------------------------------------------------------------
// The basemap, and why it is no longer CARTO.
//
// This used to draw CARTO's "Voyager" tiles, which were keyless for years.
// CARTO has since put its basemaps behind an account: keyless requests are
// still SERVED, but every tile now comes back with "API KEY REQUIRED —
// carto.com/basemaps/apikey" painted into the PNG by their server. Nothing
// changed in this file — their terms changed underneath it — which is why the
// watermark reappeared on its own and why no amount of CSS could hide it. The
// only two ways out are a CARTO key on every request, or another provider.
//
// So: VersaTiles' "colorful". Free, no account, no key, no cap, OSM data, and
// chosen off a side-by-side of nine keyless styles rendered at this demo's own
// centre. Warm off-white land, soft blue water, orange roads. Crisp at any
// zoom and pixel density, since vectors are drawn rather than stretched.
//
// NOTE FOR ANYONE SWAPPING THIS AGAIN: VersaTiles is a different schema from
// OpenFreeMap/MapTiler, not just a different palette. It is built on
// Shortbread, with ~324 layers named `water-*` / `land-*` / `site-*` — so an
// OpenFreeMap style URL is a drop-in for the map, but NOT for anything that
// addresses layers by id (see the note where the palette override used to be).
const VECTOR_STYLE = 'https://tiles.versatiles.org/assets/styles/colorful/style.json'

// There is deliberately no palette override here any more.
//
// Under Positron there was one, because Positron is grey all the way through
// — water rgb(194,200,202), parks rgb(230,233,229), i.e. two more shades of
// the land — and the reference wants those two features to carry colour. It
// hand-painted water #bcdcef and parks #dcecd4 by layer id.
//
// Colorful ships that colour itself: its water is rgb(190,221,243), which is
// the same blue as #bcdcef to within 3/255. Re-pointing the override would be
// repainting a colour with itself.
//
// It would ALSO have been silently dead code: the override addressed `water`,
// `waterway`, `park` and `landcover_wood`, and Shortbread has none of those
// ids — the `if (m.getLayer(...))` guard would have skipped all four and left
// no trace that the tinting had stopped working.
//
// The one real difference from the old look is parks. Colorful draws
// `land-park` / `land-garden` / `land-vegetation` as olive rgb(217,217,165)
// rather than the soft green #dcecd4 (its `land-grass`, rgb(216,232,200), is
// close to the old green). To put the design's green back, set a fill-color on
// those three ids on 'style.load' — guarded, since the raster fallback has
// none of them either.

// The safety net: OpenStreetMap's own raster tiles (keyless, unstamped,
// heavier-looking but honest) stand in whenever the vector style fails to come
// up. See the timeout in the setup effect below.
//
// This was originally blamed on software WebGL. It was not. The real cause was
// that Vite pre-bundled maplibre-gl into .vite/deps, which broke the URL the
// library uses to spawn its tile-parsing Web Worker: the worker started,
// accepted messages and answered none, so every vector tile sat in state
// "loading" forever and the map painted only its background colour — with no
// error, a "loaded" source, and nothing in the network panel, because the
// worker is what does the fetching. `optimizeDeps.exclude` in vite.config.ts
// is the fix; until it went in, this fallback was what the demo actually
// showed, since raster decodes on the main thread and needs no worker.
//
// The fallback is kept anyway — it still covers a genuinely failed style URL
// or an offline reviewer — but it should now be the exception, not the norm.
// If you ever see the map go raster again, suspect the worker first.
const RASTER_FALLBACK: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution:
        '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
}

/**
 * How long the vector style gets to paint before the raster stands in.
 * Generous on purpose: falling back on a slow connection would swap a map
 * that was about to arrive for a worse-looking one.
 */
const VECTOR_TIMEOUT_MS = 8000

export type MapPlace = {
  id: string
  name: string
  /** Category + price line under the name, e.g. "Taiwanese & HK Café · $$". */
  meta?: string
  lng: number
  lat: number
  /** Thumbnail shown in the pin. */
  photo?: string
  /** Everything the card that opens on tap needs — see MapVenueCard. */
  venue?: MapVenue
}

/** The detail card a pin opens (Figma 19868:16231). */
export type MapVenue = {
  /** Display name on the card, which can differ from the pin's label. */
  title: string
  /** Small rounded logo beside the title. */
  logo: string
  /** Exactly two photos in the design — cashback burns onto the first. */
  photos: [string, string]
  cashback: string
  /** Faces of people who saved it, plus the "14+" overflow label. */
  savers: string[]
  savedLabel: string
  meta: string
  distance: string
  /**
   * A friend's note about this place. Optional on purpose: a place none of
   * your friends has written about simply shows the card, which is the
   * difference between the two pins on Home.
   */
  friendComment?: { avatar: string; text: string }
}

export default function MapView({
  center,
  zoom = 13.5,
  places = [],
  showUser = true,
  onSelectPlace,
  onDeselect,
}: {
  /** [lng, lat] the map opens on. */
  center: [number, number]
  zoom?: number
  places?: MapPlace[]
  /** Draw the blue "you are here" dot at the center. */
  showUser?: boolean
  /** Tapping a pin. */
  onSelectPlace?: (place: MapPlace) => void
  /** Tapping the map itself — dismisses whatever a pin opened. */
  onDeselect?: () => void
}) {
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markers = useRef<maplibregl.Marker[]>([])
  // The marker effect rebuilds on every `places` change; reading the handlers
  // through a ref keeps a new callback identity from tearing down and
  // recreating every marker (which would flicker the pins).
  const handlers = useRef({ onSelectPlace, onDeselect })
  handlers.current = { onSelectPlace, onDeselect }

  // One-time map setup. Center/zoom changes are handled by the effect below so
  // the map instance survives re-renders (rebuilding it would flash the tiles).
  useEffect(() => {
    if (!container.current) return
    const m = new maplibregl.Map({
      container: container.current,
      style: VECTOR_STYLE,
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
    m.on('click', () => handlers.current.onDeselect?.())

    // Vector or nothing is not a choice worth offering in a demo: if the style
    // has not finished coming up by now, it never will here, so swap in the
    // raster one. `isStyleLoaded` is the test rather than an error handler —
    // the failure mode is silence, not an exception. Cleared the moment the
    // map goes idle, i.e. the vector style did paint.
    let fallback: number | undefined = window.setTimeout(() => {
      // "Has anything actually been drawn", not "does the style say it is
      // loaded". The failure this catches renders nothing while reporting no
      // error, and `isStyleLoaded` can read false on a perfectly good map that
      // is merely still fetching — the wrong question in both directions.
      if (m.queryRenderedFeatures().length > 0) return
      m.setStyle(RASTER_FALLBACK)
      // OSM's own tiles are a much louder map than Positron — pink motorways,
      // beige land, a label on everything. The class pales them back down
      // (see .bv-map.is-raster in the CSS) so the fallback still reads as the
      // quiet basemap the design asks for rather than a different product.
      container.current?.classList.add('is-raster')
    }, VECTOR_TIMEOUT_MS)
    const settle = () => {
      window.clearTimeout(fallback)
      fallback = undefined
    }
    m.once('idle', settle)
    // Deliberately no 'error' handler driving this: a vector style emits
    // errors for things it recovers from (a sprite icon it cannot find, one
    // tile that 404s), and treating those as fatal would throw away a map
    // that was about to draw perfectly well. The timeout catches every real
    // failure anyway — including the ones that raise nothing at all.

    map.current = m
    return () => {
      window.clearTimeout(fallback)
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
      // stopPropagation, or the map's own click fires straight after and
      // deselects the place this tap just chose.
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        handlers.current.onSelectPlace?.(p)
      })
      markers.current.push(
        new maplibregl.Marker({ element: el, anchor: 'left' })
          .setLngLat([p.lng, p.lat])
          .addTo(m),
      )
    }
  }, [places, showUser, center])

  return <div ref={container} className="bv-map" />
}
