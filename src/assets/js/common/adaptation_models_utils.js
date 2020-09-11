import { getRelationsToTarget } from "@/assets/js/common/graphutils";

export function createAdaptationModelsFromReferenceArchitecture(app) {
  let adapname =
    "Adaptation - " + app.parentFolder + " - " + app.applicationName + " - 1";
  localStorage[adapname] =
    "<mxGraphModel>" +
    "<root>" +
    '<mxCell id="0"/>' +
    '<mxCell id="feature" parent="0" visible="0"/>' +
    '<mxCell id="component" parent="0" visible="0"/>' +
    '<mxCell id="binding_feature_component" parent="0" visible="0"/>' +
    '<mxCell id="istar" parent="0" visible="0"/>' +
    '<mxCell id="classdiag" parent="0" visible="0"/>' +
    '<mxCell id="adap_architecture" parent="0" visible="0"/>' +
    generateAdaptationArchitectureXml(app) +
    '<mxCell id="adaptation_hardware" parent="0" visible="0"/>' +
    '<mxCell id="adaptation_behavior_hardware" parent="0" visible="0"/>' +
    '<mxCell id="adaptation_state" parent="0" visible="0"/>' +
    '<mxCell id="adaptation_behavior_states" parent="0" visible="0"/>' +
    '<mxCell id="adaptation_behavior_transitions" parent="0" visible="0"/>' +
    '<mxCell id="control" parent="0" visible="0"/>' +
    "</root>" +
    "</mxGraphModel>";
}

function generateAdaptationArchitectureXml(app) {
  let encoder = new mxCodec();
  let result = encoder.encode(app.cell);
  let xml =
    '<mxCell id="adaptation_architecture" parent="0"/>' +
    mxUtils.getXml(result);
  xml = xml.replace("adap_architecture", "adaptation_architecture");

  let relations = getRelationsToTarget(
    app.graph,
    "adap_architecture",
    app.cell,
    "sensor"
  );
  for (let index = 0; index < relations.length; index++) {
    const relation = relations[index];
    let sensor = relation.source;

    result = encoder.encode(sensor);
    let xmlAux = mxUtils.getXml(result);
    xmlAux = xmlAux.replace(
      "adap_architecture",
      "adaptation_architecture"
    ); 
    xml += xmlAux;

    result = encoder.encode(relation);
    xmlAux = mxUtils.getXml(result);
    xmlAux = xmlAux.replace(
      "adap_architecture",
      "adaptation_architecture"
    ); 
    xml += xmlAux;
  } 
  return xml;

  // let ret='<mxCell id="adaptation_architecture" parent="0"/>' +
  // '<computer label="' + app.cell.getAttribute("label") + '" type="computer" computerType="" id="4">' +
  // '<mxCell style="verticalAlign=top;fontSize=9;align=center;fillColor=#CCFFCC;" vertex="1" parent="adaptation_architecture">' +
  // '<mxGeometry x="130" y="160" width="100" height="40" as="geometry"/>' +
  // '</mxCell>' +
  // '</computer>';
  // return ret;
}
