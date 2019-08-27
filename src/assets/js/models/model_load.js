/*

To check available models go to Public/js/global_info.js

*/
let model_load = function model_load(graph,models,m_code){
    let layers = {}; 
    if(m_code){
        //load saved model
        let doc = mxUtils.parseXml(m_code);
        let codec = new mxCodec(doc);
        codec.decode(doc.documentElement, graph.getModel());
        
        let root = graph.getModel().getRoot();

        let maxVal = root.getChildCount();
        for (let i = 0; i < models.length; i++) {
            if(i<maxVal){
                let current_cell = root.getChildAt(i);
                let c_id = current_cell.getId();
                if(c_id==models[i]){
                    layers[models[i]]=current_cell;
                }else{
                    let valid_cell=false;
                    for (let j = 0; j < models.length; j++) {
                        if(c_id==models[j]){
                            layers[models[j]]=current_cell;
                            valid_cell=true;
                        }
                    }
                    
                    if(!valid_cell){
                        console.log(global.messages["model_load_invalid_cell"]);
                    }
                }
            }else{
                let cell=new mxCell();
                layers[models[i]]=root.insert(cell);
                cell.setId(models[i]);
            }
        }
    }else{
        //create base model (first child represent feature model, second child component model, etc)
        let root = new mxCell();
        for (let i = 0; i < models.length; i++) {
            let m_cell =new mxCell();
            m_cell.setId(models[i]);
            layers[models[i]]=root.insert(m_cell);
        }
        graph.getModel().setRoot(root);
    }
    return layers;
}

export default model_load