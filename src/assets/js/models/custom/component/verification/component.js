let componentVerification = function componentVerification() {
    //custom verification menu options and functions
    let data = [];
    data[0] = {
        "label": "Hide all fragment alter relations",
        "func": hideFragmentRel
    };
    data[1] = {
        "label": "Show all fragment alter relations",
        "func": showFragmentRel
    };
    data[2] = {
        "label": "Show alter relations for current fragment",
        "func": showFragmentRelSelected
    };

    return data;

    function hideFragmentRel(graph, cErrors, cOverlays) {
        let componentRoot = graph.getModel().getCell("component");
        let childs = graph.getModel().getChildEdges(componentRoot);

        for (let i = 0; i < childs.length; i++) {
            if (childs[i].getValue().nodeName == "rel_fragment_file") {
                childs[i].setVisible(false);
            }
        }
        graph.refresh();
    }

    function showFragmentRel(graph, cErrors, cOverlays) {
        let componentRoot = graph.getModel().getCell("component");
        let childs = graph.getModel().getChildEdges(componentRoot);

        for (let i = 0; i < childs.length; i++) {
            if (childs[i].getValue().nodeName == "rel_fragment_file") {
                childs[i].setVisible(true);
            }
        }
        graph.refresh();
    }

    function showFragmentRelSelected(graph, cErrors, cOverlays) {

        let cell = graph.getSelectionCell();
        if (cell == null) {
            alert("Please select a valid fragment");
        } else {
            if (!cell.getAttribute("type") == "fragment") {
                alert("Please select a valid fragment");
            } else {
                let componentRoot = graph.getModel().getCell("component");
                let childs = graph.getModel().getChildEdges(componentRoot);

                for (let i = 0; i < childs.length; i++) {
                    if (childs[i].getValue().nodeName == "rel_fragment_file") {
                        childs[i].setVisible(false);
                    }
                }

                let childsCurrent = graph.getModel().getOutgoingEdges(cell);
                for (let i = 0; i < childsCurrent.length; i++) {
                    if (childsCurrent[i].getValue().nodeName == "rel_fragment_file") {
                        childsCurrent[i].setVisible(true);
                    }
                }

                graph.refresh();
            }

        }
    }
}

export default componentVerification