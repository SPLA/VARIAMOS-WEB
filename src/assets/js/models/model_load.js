/*

To check available models go to Public/js/global_info.js

*/
let modelLoad = function modelLoad(graph,models,mCode){
    let layers = {}; 
    if(mCode){
        //load saved model
        let doc = mxUtils.parseXml(mCode);
        let codec = new mxCodec(doc);
        codec.decode(doc.documentElement, graph.getModel());
        
        let root = graph.getModel().getRoot();

        let maxVal = root.getChildCount();
        for (let i = 0; i < models.length; i++) {
            if(i<maxVal){
                let current_cell = root.getChildAt(i);
                let cId = current_cell.getId();
                if(cId==models[i]){
                    layers[models[i]] = current_cell;
                }else{
                    let valid_cell=false;
                    for (let j = 0; j < models.length; j++) {
                        if(cId == models[j]){
                            layers[models[j]] = current_cell;
                            valid_cell=true;
                        }
                    }
                    
                    if(!valid_cell){
                        console.log(global.messages["model_load_invalid_cell"]);
                    }
                }
            }else{
                let cell=new mxCell();
                layers[models[i]] = root.insert(cell);
                cell.setId(models[i]);
            }
        }
    }else{
        //create base model (first child represent feature model, second child component model, etc)
        let root = new mxCell();
        for (let i = 0; i < models.length; i++) {
            let mCell =new mxCell();
            mCell.setId(models[i]);
            layers[models[i]] = root.insert(mCell);
        }
        graph.getModel().setRoot(root);
    }
    return layers;
}

export default modelLoad