var model_load = function model_load(graph,m_code){
    var layers = {}; 
    var models = ["feature","component"]; //represent the available models
    if(m_code!=""){
        //load saved model
        var doc = mxUtils.parseXml(m_code);
        var codec = new mxCodec(doc);
        codec.decode(doc.documentElement, graph.getModel());
        
        var root = graph.getModel().getRoot();

        var maxVal = root.getChildCount();
        for (var i = 0; i < models.length; i++) {
            if(i<maxVal){
                layers[models[i]]=root.getChildAt(i);
            }else{
                layers[models[i]]=root.insert(new mxCell());
            }
        }
    }else{
        //create base model (first child represent feature model, second child component model, etc)
        var root = new mxCell();
        for (var i = 0; i < models.length; i++) {
            layers[models[i]]=root.insert(new mxCell());
        }
        graph.getModel().setRoot(root);
    }
    return layers;
}

export default model_load