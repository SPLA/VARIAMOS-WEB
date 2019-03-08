/*

Layers:
layer0 (root child with id="feature") belongs to "Feature model"
layer1 (root child with id="component") belongs to "Component model"
layer2 (root child with id="binding_feature_component") belongs to "Binding Feature Component model"

*/
var model_load = function model_load(graph,models,m_code,layertype,data,index){
    var layers = {}; 
    if(m_code){
        //load saved model
        var doc = mxUtils.parseXml(m_code);
        var codec = new mxCodec(doc);
        codec.decode(doc.documentElement, graph.getModel());
        var root = graph.getModel().getRoot();
        var maxVal = root.getChildCount();
        
        if(layertype ===1)
        {
            for (var i = 0; i < models.length; i++)
            {
                var valid_cell=false;
                for (var j = 0; j < maxVal; j++)
                {
                    var current_cell = root.getChildAt(j);
                    var c_id = current_cell.getId();
                    if(c_id===models[i]+getmodeltype(data,index,models[i]))
                    {
                        valid_cell=true;
                        layers[models[i]+getmodeltype(data,index,models[i])]=current_cell;
                    }
                }
                if(!valid_cell)
                {
                    var m_cell =new mxCell();
                    m_cell.setId(models[i]+getmodeltype(data,index,models[i]));
                    layers[models[i]+getmodeltype(data,index,models[i])]=root.insert(m_cell);
                }
            }
        }
        else if(layertype === 2)
        {
            for (let i = 0; i < maxVal; i++)
            {
                var current_cell = root.getChildAt(i);
                var c_id = current_cell.getId();
                layers[c_id]=current_cell;
            }
        }
        // for (var i = 0; i < models.length; i++) {
        //     if(i<maxVal){
        //         var current_cell = root.getChildAt(i);
        //         var c_id = current_cell.getId();
        //         if(c_id==models[i]){
        //             layers[models[i]]=current_cell;
        //         }else{
        //             var valid_cell=false;
        //             for (var j = 0; j < models.length; j++) {
        //                 if(c_id==models[j]){
        //                     layers[models[j]]=current_cell;
        //                     valid_cell=true;
        //                 }
        //             }
                    
        //             if(!valid_cell){
        //                 console.log(messages["model_load_invalid_cell"]);
        //             }
        //         }
        //     }else{
        //         var cell=new mxCell();
        //         layers[models[i]]=root.insert(cell);
        //         cell.setId(models[i]);
        //     }
        // }
    }else{
        //create base model (first child represent feature model, second child component model, etc)
        root = new mxCell();
        for (var i = 0; i < models.length; i++) {
            var m_cell =new mxCell();
            m_cell.setId(models[i]+getmodeltype(data,index,models[i]));
            layers[models[i]+getmodeltype(data,index,models[i])]=root.insert(m_cell);
        }
        graph.getModel().setRoot(root);
    }
    return layers;
}

function getmodeltype(data,index,item){
    for(let i = 0; i < data.length; i++)
    {
        if(data[i].data.parentId === data[index].data.nodeId && data[i].data.nodeName === item)
        {
            if(data[i].data.modeltype === 1)
                return '|feature';
            else if(data[i].data.modeltype === 2)
                return '|component';
        }
    }
    return '';
}

export default model_load