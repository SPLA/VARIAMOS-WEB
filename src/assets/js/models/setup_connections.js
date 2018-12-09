var setup_connections = function setup_connections(graph){

    var connections_fun = function(sender, evt){
        var edge = evt.getProperty('cell');
        var source = graph.getModel().getTerminal(edge, true);
        var target = graph.getModel().getTerminal(edge, false);
        //console.log(target);
        //missing implementation for custom edges
    };

    graph.connectionHandler.addListener(mxEvent.CONNECT, connections_fun); //cellConnected
    graph.connectionHandler.connections_fun=connections_fun;
}

export default setup_connections