declare module '@mapbox/mapbox-gl-draw' {
  import { IControl, Map } from 'mapbox-gl'

  interface DrawOptions {
    displayControlsDefault?: boolean
    controls?: {
      point?: boolean
      line_string?: boolean
      polygon?: boolean
      trash?: boolean
      combine_features?: boolean
      uncombine_features?: boolean
    }
    styles?: object[]
    defaultMode?: string
    modes?: object
  }

  interface DrawFeatureCollection {
    type: 'FeatureCollection'
    features: any[]
  }

  class MapboxDraw implements IControl {
    constructor(options?: DrawOptions)
    onAdd(map: Map): HTMLElement
    onRemove(map: Map): void
    getDefaultPosition(): string
    add(geojson: object): string[]
    get(featureId: string): object | undefined
    getFeatureIdsAt(point: { x: number; y: number }): string[]
    getSelectedIds(): string[]
    getSelected(): DrawFeatureCollection
    getSelectedPoints(): DrawFeatureCollection
    getAll(): DrawFeatureCollection
    delete(ids: string | string[]): this
    deleteAll(): this
    set(featureCollection: object): string[]
    trash(): this
    combineFeatures(): this
    uncombineFeatures(): this
    getMode(): string
    changeMode(mode: string, options?: object): this
    setFeatureProperty(featureId: string, property: string, value: any): this
  }

  export default MapboxDraw
}

declare module 'mapbox-gl/dist/mapbox-gl.css'
declare module '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
