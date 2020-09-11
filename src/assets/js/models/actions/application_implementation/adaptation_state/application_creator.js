import { createElement } from '@/assets/js/common/graphutils';
import { getElementsByType } from '@/assets/js/common/graphutils';
import { getBoard } from "@/assets/js/models/custom/adaptation_hardware/boards.js";
import { getDevice } from "@/assets/js/models/custom/adaptation_hardware/devices.js";

var application_creator = function application_creator(graph) {
    this.graph = graph;
}

application_creator.prototype.createFromReferenceArchitecture = function (graph, cell) {
    // this.createLocalModel(graph, cell);
    let newApplication= {
        graph: graph,
        cell: cell
    };
    //graph.currentVueInstance.$store.dispatch('createapplication', newApplication);
    graph.currentVueInstance.$store.dispatch('createapplication', newApplication);
};   

application_creator.prototype.createLocalModel = function (graph, cell) {
    let project="Test2";
    let nid=4; 
    let content="<mxGraphModel><root></root></mxGraphModel>"; 
    localStorage["Application - Test5 - " + nid]=content;
    let str=localStorage["Filetree|User1"];
    let filetree=JSON.parse(str);
    let p1=-1;
    let p2=-1;
    let itemProject=null;
    for (let i = 0; i < filetree.length; i++) {
        let item=filetree[i];
        if (item.data.nodeName==project) {
            p1=i;
            itemProject=item;
        }else if(p1>-1){
            if (item.data.level==1) {
                p2=i;
                break;
            }
        }
    }
    var newApp={
        data:{
            contextmenuIndex: "application_folder",
            isSelected: false,
            level: 2,
            modeltype: 1,
            nodeId: 330,
            nodeName: "Application - Test2 - 3",
            nodeType: 1,
            open: false,
            parentId: itemProject.data.projectId,
            projectId: itemProject.data.projectId,
            numberOfChildren: 7
        }
    }; 

    if (p2==-1) {
        filetree.push(newApp);
    }else{
        filetree.splice(p2, 0, newApp)
    }


    var k=0;
};  


export default application_creator;