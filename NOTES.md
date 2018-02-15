
# move to waves-ui ?

`AbstractAnnotationModule`

- `LabelEditionState`
- `PositionEditionState`
 
`BpfModule`

- `Multiline` shape

`SimpleWaveformModule`

- `SimpleWaveform` shape

`AbstractAnnotationModule`

- edition states


## move to abc-blocks

`CursorModule`

- "dblclick" behavior is very specific and could probably conflict with other module (cf. markers, etc.)
  => define if we create a copy of this module in `abc-blocks` with this specific behavior

## API Update

### `setTrack` (block + module)

```js
- setTrack(trackData, trackBuffer)
+ setTrack(trackData, trackMetadata)
```

=> `trackBuffer` renamed to `trackData` which is more generic

updated modules:
* but BpfModule

### install / uninstall

```js
- install(block)
+ install()

- uninstall(block)
+ uninstall()
```



