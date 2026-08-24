import {NO_SELECTION} from "../../controller/siteController.js";
import {dom}          from "../../util/dom.js";
import {AVATAR_URL, PSEUDO_URL} from "../../../../../app/client/js/Constants.js";

export { WorkbenchProjector }

const WorkbenchProjector = (workbenchController) => {

    const connectorProjector = workbenchController.getProjectors().connectorProjector(workbenchController);

    const updateWorkbench = (metaInf, entity) => {

        const workbenchEls = dom(`
            <div class="actions">
                <button type="button" id="workbenchCreate">Create New ${metaInf.label}</button>
                <button type="button" id="workbenchDelete">Delete ${entity.displayedAs}</button>
            </div>
            <h2>${metaInf.label} ${entity.displayedAs}</h2>
        
            <form id="${metaInf.table}_edit_form">
                ${ formRowsHtml(metaInf, entity)}
                <div></div> <div><button type="submit">Submit</button></div>
            </form>
            <div class="preview">
                <img alt="preview" src="${
                        entity.pictureUrl == null || entity.pictureUrl === PSEUDO_URL 
                        ? AVATAR_URL
                        : entity.pictureUrl
                    }">
            </div>`
        );

        const [actions, heading, form, _preview ] = workbenchEls;

        // from the meta information, find all relations, where current table is related
        const relationMetaInfos = workbenchController.getMeta().allRelationNames
            .map( relationName => workbenchController.getMeta().getRelationMeta(relationName))
            .filter( relMetaInf =>    relMetaInf.oneTable  === metaInf.table
                                   || relMetaInf.manyTable === metaInf.table);

        relationMetaInfos.forEach( relMetaInf => {
            form.append(
                    ...connectorProjector.projectConnection(relMetaInf, metaInf.table, entity )
            );
        } );

        // view binding: button interactions
        actions.querySelector("#workbenchCreate").onclick = _evt => workbenchController.newEntity(metaInf);
        actions.querySelector("#workbenchDelete").onclick = _evt => workbenchController.removeEntity(metaInf, entity);

        // view binding: form interactions
        form.onsubmit = evt => {
            evt.preventDefault();
            if(evt.submitter.type !== "submit") {
                // return; // happens when pushing <return> in a form - uncomment to disallow
            }
            // fill form inputs into artist
            for(const prop of metaInf.properties) {
                entity[prop.name] = form.querySelector(`input[name="${prop.name}"]`).value;
            }
            workbenchController.putEntity(metaInf, entity);
        };

        // data binding
        workbenchController.onEntityChanged( change => {
            if (change.entityName !== metaInf.table) return;
            if (change.entity.id !== entity.id) return;
            actions.querySelector("#workbenchDelete").textContent = "Delete "+ change.entity.displayedAs;
            heading.textContent = `${metaInf.label} ${change.entity.displayedAs}`;
            // todo we might need more and smarter change detection for the input fields
        });

        return workbenchEls;

    };


    // general utility, might go into util
    const formRowsHtml = (metaInf, entity) => {
       let result = "";
       let counter = 0;
       for(const property of metaInf.properties ) {
           const rowId = metaInf.table + '_edit_form-' + (counter++);
           if (property.type==="hidden") {
               result += `
                   <div class="readonly">${property.label}</div>
                   <div class="readonly">${entity[property.name]} </div>`;
           } else {
               result += `
                   <label for="${rowId}">${property.label}</label>`;
           }
           result += `
               <input type="${property.type}"
                      name="${property.name}"
                      id="${rowId}"
                      value="${entity[property.name]}"
                      ${property.extra ?? ''}
                      >`;
       }
       return result;
    };

    /** @param { EntitySelectionType } selection */
    const projectWorkbench = selection => {
        if (NO_SELECTION === selection) {
            const noSelection = dom(`<div class="noSelection">Please make a selection</div>`);
            return noSelection;
        }
        return updateWorkbench(workbenchController.getMeta().getEntityMeta(selection.entityName), selection.entity);
    };
   return { projectWorkbench }
} ;
