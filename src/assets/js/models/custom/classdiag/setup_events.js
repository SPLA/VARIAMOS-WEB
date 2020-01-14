import { setupModal, modalH3, modalComponentInformation, modalButton } from '../../../common/util'

let setup_events = function setup_events(graph){

    const classMap = new Map();//load_parameters(graph);

    //clean previous generated events
    if(graph.eventListeners.length>22){
        graph.eventListeners.pop();graph.eventListeners.pop();
        graph.eventListeners.pop();graph.eventListeners.pop();
        graph.eventListeners.pop();graph.eventListeners.pop();
        graph.eventListeners.pop();graph.eventListeners.pop();
    }
    //redirect to the original model when double click on a clon cell
    graph.addListener(mxEvent.DOUBLE_CLICK, function(_sender, evt){
        let cell = evt.getProperty('cell');
        if (cell !== null){
            const type = cell.getAttribute('type');
            if (['class', 'class_name', 'class_attributes', 'class_methods', 'class_attributes', 'class_methods', 'attribute', 'method','file'].includes(type)){
                //If the event comes from a class/file(note) then keep going,
                //otherwise set it to the appropirate parent.
                if(['class_name', 'class_attributes', 'class_methods'].includes(type)){
                    cell = cell.getParent();
                } else if (['attribute', 'method'].includes(type)){
                    cell = cell.getParent().getParent();
                }
                const classId = cell.getId();
                let structure = {};
                let idx_cat = 0;
                let idx_subcat = 0;
                //If the structure is still in memory, retrieve it instead of
                //recreating it.
                if(classMap.has(classId)){
                    //This point will be hit if the structure is present in the map.
                    const map_element = classMap.get(classId);
                    structure = map_element.structure;
                    //Reset indexes
                    map_element.idx_cat = 0;
                    map_element.idx_subcat = 0;
                    //Save after recalculating:
                    //localStorage.setItem('ClassMap', serialize(classMap));
                } else {
                    //If this point is hit, the structure for this cell
                    //does not yet exist.
                    //TODO: reafactor create_structure call
                    structure = create_structure(type !== 'file', cell);
                    classMap.set(classId, {structure, idx_cat: idx_cat, idx_subcat: idx_subcat})
                }
                //const limits = calculate_limits(classMap.get(classId));
                const c_name = type !== 'file' ? cell.getChildAt(0).getAttribute('label', '') : 'NOTE';
                let c_header = modalH3(c_name !== '' ? c_name : 'No name yet...');
                let c_body = modalComponentInformation(structure, idx_cat, idx_subcat, cell, graph, handleResize);

                let c_footer = [];
                c_footer.push(modalButton(graph.currentVueInstance.$t("modal_save"), function(){save_parameters(cell, structure);}));
                c_footer.push(modalButton("Next", function(){next_index(cell, true);}));
                c_footer.push(modalButton("Back", function(){next_index(cell, false);}));
                setupModal(c_header, c_body, c_footer);
            }
        }
        evt.consume();
    });

    //TODO FIX
    //Control group resizes
    graph.addListener(mxEvent.CELLS_RESIZED, handleResize);

    function handleResize(_sender, evt){
        const cells = evt.getProperty('cells');
        if (cells != null)
        {
            cells.forEach(cell => {
                //Set up handling for classes
                if(cell.getAttribute('type') === 'class'){
                    const model = graph.getModel();
                    const cellGeo = cell.getGeometry().clone();

                    const name_container = cell.getChildAt(0);
                    const name_geo = name_container.getGeometry().clone();

                    const attr_container = cell.getChildAt(1);
                    const attr_geo = attr_container.getGeometry().clone();

                    const method_container = cell.getChildAt(2);
                    const method_geo = method_container.getGeometry().clone();

                    const attr_count = attr_container.getChildCount();
                    const method_count = method_container.getChildCount();

                    const limitWidth = 100;
                    const attribute_height = (20 * (attr_count + 1));
                    const method_height = (20 * (method_count + 1));
                    const limitHeight = 20 + attribute_height + method_height;
                    let extraHeight = cellGeo.height - limitHeight;
                    if (extraHeight < 0){
                        extraHeight = 0;
                    }

                    //Reset the geometry to the limit if under it
                    let resetGeo = false;

                    if (cellGeo.height < limitHeight) {
                        cellGeo.height = limitHeight;
                        resetGeo = true;
                    }

                    if (cellGeo.width < limitWidth) {
                        cellGeo.width = limitWidth;
                        resetGeo = true;
                    }

                    if (resetGeo){
                        model.setGeometry(cell, cellGeo);
                    }

                    //Set geometry for name
                    name_geo.x = 0;
                    name_geo.y = 0;
                    name_geo.width = cellGeo.width;
                    model.setGeometry(name_container, name_geo);

                    //Set geometry for attributes
                    attr_geo.x = 0;
                    attr_geo.y = 20;
                    attr_geo.width = cellGeo.width;
                    attr_geo.height = attribute_height + (extraHeight/2);
                    model.setGeometry(attr_container, attr_geo);

                    //Set geometry for methods
                    method_geo.x = 0;
                    method_geo.y = attr_geo.height + name_geo.height;
                    method_geo.width = cellGeo.width;
                    method_geo.height = method_height + (extraHeight/2);
                    model.setGeometry(method_container, method_geo);
                }
            });
        }
    }

    function load_parameters(){
        const store = JSON.parse(localStorage.getItem('ClassMap'));
        if(store !== null) return new Map(store);
        else return new Map();
    }

    function serialize(map) {
        return JSON.stringify([...map])
    }
    
    function save_parameters(_cell, _structure){
        const main_modal = document.getElementById("main_modal");
        main_modal.style.display = 'none';
        const btn_save = document.getElementById('buttonSAVE').children[0];
        btn_save.click();
        //localStorage.setItem('ClassMap', serialize(classMap));
    }

    function next_index(cell, next){
        let main_modal_header=document.getElementById('main_modal_header');
        let main_modal_body=document.getElementById('main_modal_body');
        //let main_modal_footer=document.getElementById('main_modal_footer');
        main_modal_body.innerHTML="";
        main_modal_header.innerHTML="";

        const cellObj = classMap.get(cell.getId());
        const prevlimits = calculate_limits(cellObj);
        const subcat_limit = cellObj.idx_subcat === prevlimits.subcategory_keys.length - 1;
        const cat_limit = cellObj.idx_cat === prevlimits.category_keys.length - 1;
        if(next){
            if(subcat_limit && cat_limit){
                //Desactiver next
                console.log('Can\'t go further forward');
            } else if(subcat_limit) { 
                //Augmenter cat
                cellObj.idx_subcat = 0;
                cellObj.idx_cat++;
            } else {
                //Augmenter subcat
                cellObj.idx_subcat++;
            }
        } else {
            if(cellObj.idx_cat === 0 && cellObj.idx_subcat === 0){
                //Desactiver Back
                console.log('Can\'t go further back');
            } else if(cellObj.idx_cat !== 0 && cellObj.idx_subcat !== 0){
                //Reduire la subcat
                cellObj.idx_subcat--;
            } else if(cellObj.idx_cat !== 0 && cellObj.idx_subcat === 0){
                cellObj.idx_cat--;
                cellObj.idx_subcat = calculate_limits(cellObj).subcategory_keys.length-1;
            } else {
                cellObj.idx_subcat--;
            }
        }
        console.log('cellObj.idx_cat :', cellObj.idx_cat);
        console.log('cellObj.idx_subcat :', cellObj.idx_subcat);
        const newlimits = calculate_limits(cellObj);
        const c_name = cell.getAttribute('type') !== 'file' ? cell.getChildAt(0).getAttribute('label', '') : 'NOTE';
        let c_header = modalH3(c_name !== '' ? c_name : 'No name yet...');
        let c_body = modalComponentInformation(cellObj.structure, cellObj.idx_cat, cellObj.idx_subcat, cell, graph, handleResize);
        main_modal_header.appendChild(c_header);
        main_modal_body.appendChild(c_body);
    }

    function calculate_limits(cellObj){
        const category_keys = Object.keys(cellObj.structure);
        const subcategory_keys = Object.keys(cellObj.structure[category_keys[cellObj.idx_cat]]);
        return {
            category_keys,
            subcategory_keys        
        };
    }

    function create_structure(isClass, cell){
        if(isClass){
            const cell_attrs = cell.getChildAt(1);
            const cell_attrs_count = cell_attrs.getChildCount();
            const cell_methods = cell.getChildAt(2);
            const cell_methods_count = cell_methods.getChildCount();
            const structure = {
                basic_information: {
                    attributes: [
                        {
                            element_id: 'interface-attributes', 
                            element_type: 'button', 
                            element_prefix: 'attribute', 
                            button1_txt: 'Create new Attribute', 
                            button2_txt: 'Delete the last Attribute'
                        },
                        /* {
                            element_id: 'attribute1-name', 
                            element_type: 'text',
                            element_placeholder_txt: '- attribute : type'
                        },
                        {
                            element_id: 'attribute1-Description', 
                            element_type: 'text'
                        } */
                    ],
                    methods: [
                        {
                            element_id: 'interface-methods', 
                            element_type: 'button', 
                            element_prefix: 'method', 
                            button1_txt: 'Create new Method', 
                            button2_txt: 'Delete the last Method'
                        },
                        /* {
                            element_id: 'method1-name', 
                            element_type: 'text',
                            element_placeholder_txt: '- method()'
                        },
                        {
                            element_id: 'method1-Description', 
                            element_type: 'text'
                        } */
                    ] 
                }
            };
            if(cell_attrs_count > 0){
                for(let i = 0; i < cell_attrs_count; i++){
                    const field = cell_attrs.getChildAt(i);
                    structure.basic_information.attributes.push(
                        {
                            element_id: 'attribute'+`${i+1}-name`, 
                            element_type: 'text',
                            element_instance: field.getId(),
                            element_field_type: 'attr_text',
                            value: field.getAttribute('label', '')
                        },
                        {   element_id: 'attribute'+`${i+1}-Description`, 
                            element_type: 'text',
                            element_instance: field.getId(),
                            element_field_type: 'attr_desc',
                            value: field.getAttribute('description', '')
                        }
                    );
                }
            }
            if(cell_methods_count > 0){
                for(let i = 0; i < cell_methods_count; i++){
                    const field = cell_methods.getChildAt(i);
                    structure.basic_information.methods.push(
                        {
                            element_id: 'method'+`${i+1}-name`, 
                            element_type: 'text',
                            element_instance: field.getId(),
                            element_field_type: 'method_text',
                            value: field.getAttribute('label', '')
                        },
                        {   element_id: 'attribute'+`${i+1}-Description`, 
                            element_type: 'text',
                            element_instance: field.getId(),
                            element_field_type: 'method_desc',
                            value: field.getAttribute('description', '')
                        }
                    );
                }
            }
            Object.keys(structure).forEach(function(key_category,_index) {
                // key_category: the name of the object key
                // _index: the ordinal position of the key within the object
                const subcategory = structure[key_category];
                Object.keys(subcategory).forEach(function(key_subcategory,_index) {
                    // key_subcategory: the name of the object key
                    // _index: the ordinal position of the key within the object
                    subcategory[key_subcategory].forEach(element => {
                        if(element.value === undefined) {
                            element.value = null;
                        }
                    });
                });
            });
            return structure;
        } else {
            const structure = {
                basic_information: {
                    notes: [
                        {
                            element_id: 'information', 
                            element_type: 'textarea', 
                            element_instance: cell.getId(),
                            value: cell.getAttribute('information', '')
                        },
                        /* {
                            element_id: 'attribute1-name', 
                            element_type: 'text',
                            element_placeholder_txt: '- attribute : type'
                        },
                        {
                            element_id: 'attribute1-Description', 
                            element_type: 'text'
                        } */
                    ],
                }
            };
            return structure; 
        }
    }

}

export default setup_events