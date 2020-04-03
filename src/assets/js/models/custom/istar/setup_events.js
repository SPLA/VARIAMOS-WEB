import istar from '../istar'

//TODO FIX THIS: CALCULAtiONS ARE WRONG
let setup_events = function setup_events(graph) {
  graph.addListener(mxEvent.CELLS_RESIZED, (_sender, evt) => {
    const cells = evt.getProperty('cells');
    if (cells !== null) {
      cells.forEach(cell => {
        const cellType = cell.getAttribute('type', '');
        if ([
          "goal", "goal-dependum", "quality", "quality-dependum",
          "task", "task-dependum", "resource", "resource-dependum"
        ].includes(cellType)) {
          const childCount = cell.getChildCount();
          if (childCount > 0) {
            const stereoContainer = cell.getChildAt(0);
            if (stereoContainer.getAttribute('type') === 'stereotypeContainer') {
              const stereoGeo = stereoContainer.getGeometry();
              const cellGeo = cell.getGeometry();
              const width = cellGeo.width;
              const height = cellGeo.height;
              const r = width/height;
              const labelWidth = 50;
              const xPos = (width - labelWidth) / 2;
              const yPos = (r < 2.5) ? ((12.5*height) - (4*width))/25 : height/10;
              stereoGeo.x = xPos;
              stereoGeo.y = yPos;
            }
          }
        }
      });
    }
  });
}

export default setup_events