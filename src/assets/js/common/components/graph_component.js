export function GraphComponent(type, label, icon, style, width, height, attributes, ports) {
  this.type = type;
  this.label = label;
  this.icon = icon;
  this.style = style;
  this.width = width;
  this.height = height;
  this.attributes = attributes;
  this.ports = ports;
}

GraphComponent.prototype.getPrototype = function () {
  var type = this.type;
  let doc = mxUtils.createXmlDocument();
  let node = doc.createElement(type);
  node.setAttribute("type", type);
  node.setAttribute("label", this.label);
  if (this.attributes) {
    for (let z = 0; z < this.attributes.length; z++) {
      node.setAttribute(
        this.attributes[z]["name"],
        this.attributes[z]["def_value"]
      );
    }
  }
  let vertex = new mxCell(node, new mxGeometry(0, 0, this.width, this.height), this.style);
  vertex.setConnectable(true);
  vertex.setVertex(true);
  if (this.ports) {
    for (let index = 0; index < this.ports.length; index++) {
      this.createPort(vertex, this.ports[index]);
    }
  }
  return vertex;
};

GraphComponent.prototype.createPort = function (parent, port) { 
  let doc = mxUtils.createXmlDocument();
  let node = doc.createElement(port.type);
  node.setAttribute('type', port.type);
  node.setAttribute('label', port.label); 
  let geometry = new mxGeometry(port.x, port.y, port.width, port.height);
  geometry.offset = new mxPoint(0, 0);
  geometry.relative = false;

  let connector = new mxCell(node, geometry, port.style);
  // graph.setCellStyles(mxConstants.STYLE_MOVABLE, '0', [connector]);
  // graph.setCellStyles(mxConstants.STYLE_RESIZABLE, '0', [connector]);
  connector.setConnectable(true);
  connector.setVertex(true);

  parent.insert(connector);
};