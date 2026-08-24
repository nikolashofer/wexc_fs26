import {dom}                                           from "../../util/dom.js";
import {dragData, registerDraggable, registerDropzone} from "../../util/DragAndDrop.js";
import {RelationController}                            from "../../controller/relationController.js";
import {ONE_TO_MANY}                                   from "../../types.js";

export { ConnectorProjector }

const ConnectorProjector = workbenchController => {

    const connectorController = RelationController(workbenchController); // consider moving this to the call site

    /**
     * UI projection for a connection to many entities.
     * Can arise from the "one" side of a one-to-many relationTable or
     * from either side of a many-to-many relationTable.
     * @param { RelationMetaType } rel_meta
     * @param { EntityNameType }   entityName - "table" name of the entity we are passing
     * @param entity - what is currently in the workbench
     * @return { [HTMLLabelElement, HTMLDivElement] } label and dropzone
     */
    const projectConnection = (rel_meta, entityName, entity) => {

        const relationName = rel_meta.relationId;

        const isOneSide  = rel_meta.oneTable  === entityName;
        const isManySide = rel_meta.manyTable === entityName;

        if (isOneSide && isManySide) {
            console.error("relation from self to self currently not supported");
            return [undefined, undefined];
        }

        const label        = isOneSide ? rel_meta.oneLabel  : rel_meta.manyLabel;
        const entityFK     = isOneSide ? rel_meta.oneFK     : rel_meta.manyFK;          // ourselves
        const relatedFK    = isOneSide ? rel_meta.manyFK    : rel_meta.oneFK;           // the other side
        const relatedTable = isOneSide ? rel_meta.manyTable : rel_meta.oneTable;

        // when the entity is on the many side of a one-to-many relation,
        // we have to enforce, that there is at most one relation in this connector
        const restrictToOneRelation = rel_meta.cardinality === ONE_TO_MANY && isManySide;

        const cssMarkerClass = restrictToOneRelation ? "one" : "many";
        const [labelEl, dropzoneEl] = dom(`
            <div>${label}</div>
            <div class="dropzone ${cssMarkerClass}" title="Drop ${label} here">
                <div class="drophint"><span class="emoji">⬇️</span></div>
                <ul id="${relationName}_connector_list"></ul>
                <div class="remove"><span class="emoji">♻️</span> Remove</div>
            </div>`);
        const relatedListEl = dropzoneEl.querySelector("ul");
        const removeEl      = dropzoneEl.querySelector(".remove");


        // data binding: fill the relationTable view with data from the domain model and
        // make the LI elements draggable for potential deletion via drag on the recycle bin
        // bind clicking the LI elements to selection for display
        const updateRelatedListEl = (relationTable) => {
            relatedListEl.innerHTML = ""; // remove all children
            connectorController.relationsById(relationTable, entityFK, entity.id).forEach(relRow => {
                const [liEl] = dom(`<li
                    data-domain="${relatedTable}"
                    data-id="${relRow[relatedFK]}"></li>`);
                workbenchController.findEntity(relatedTable, relRow[relatedFK]) // async
                    .then(entity => liEl.textContent = entity.displayedAs);
                liEl.onclick = _evt => workbenchController.selectId(relatedTable, relRow[relatedFK]);
                registerDraggable(liEl, dragData );
                relatedListEl.append(liEl);
            });
        };

        // actually filling the relation list is async
        workbenchController.getRelationService(relationName).getAll()
           .then( relationTable => updateRelatedListEl(relationTable) );

        // view binding for the connector dropzone

        const relatedIndex = (relationTable, relatedFkValue) =>
            connectorController.relationIndexByPair(relationTable, entityFK, entity.id, relatedFK, relatedFkValue);

        registerDropzone(relatedListEl, data => {
            if (data.domain !== relatedTable) return;               // do not allow dropping from unsupported sources
            workbenchController.getRelationService(relationName).getAll()
               .then(relationTable => {
                   if (relatedIndex(relationTable, data.id) >= 0) return;      // already there, do not add twice

                   if (restrictToOneRelation) {                                // highlander
                       // remove all that point to us
                       connectorController.removeAllById(relationTable, entityFK, entity.id);
                   }
                   // add to relationTable and update view
                   const rel = {[relatedFK]: data.id, [entityFK]: entity.id};
                   connectorController.addRelation(rel_meta, relationTable, rel);
                   updateRelatedListEl(relationTable);
               });
        });

        registerDropzone(removeEl, data => {
            if (data.domain !== relatedTable) return;               // do not allow dropping from unsupported sources
            workbenchController.getRelationService(relationName).getAll()
               .then( relationTable => {
                   connectorController.removeByIndex(relationTable, relatedIndex(relationTable, data.id));
                   updateRelatedListEl(relationTable );
               } );
        }, "link");

        return [
            /** @type { HTMLLabelElement } */ labelEl,
            /** @type { HTMLDivElement }   */ dropzoneEl
        ];
    };

    return {
        projectConnection,
    }
};
