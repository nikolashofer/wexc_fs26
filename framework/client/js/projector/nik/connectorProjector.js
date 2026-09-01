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
        const shouldClearOtherRels = rel_meta.cardinality === ONE_TO_MANY && isOneSide;

        const cssMarkerClass = restrictToOneRelation ? "one" : "many";
        const [labelEl, manageEl] = dom(`
            <div>${label}</div>
            <div class="manage-rel ${cssMarkerClass}">
                <select></select>
            </div>`);
        const selectEl = manageEl.querySelector("select");
        selectEl.multiple = !restrictToOneRelation;

        const loadRelationData = () => 
            Promise.all([
                workbenchController.getEntityService(relatedTable).getAll(),
                workbenchController.getRelationService(relationName).getAll()
            ]);

        const buildOpts = (foreignEntities, relationTable) => {
            selectEl.innerHTML = buildOptsInitialHTML();
            const ourRels = connectorController.relationsById(relationTable, entityFK, entity.id);
            foreignEntities.forEach(foreignEntity => {
                const isRelated  = ourRels.some(re => re[relatedFK] === foreignEntity.id);
                const [optEl] = dom(`
                    <option value="${foreignEntity.id}" ${isRelated ? "selected" : ""}>
                        <div>
                            ${!!foreignEntity.pictureUrl ? `<img src="${foreignEntity.pictureUrl}" />` : ''}
                            ${foreignEntity.displayedAs}
                        </div>
                        <button class="open">➚</button>
                    </option>`);

                const openEl = optEl.querySelector(".open");
                openEl.onclick = _evt => workbenchController.selectId(relatedTable, foreignEntity.id);
                selectEl.append(optEl);
            })
        }

        const buildOptsInitialHTML = () => {
            let base = "<button><selectedcontent></selectedcontent></button>";
            return restrictToOneRelation ? `${base}<option value="">No selection...</option>` : base;
        }

        loadRelationData().then(([foreignEntities, relationTable]) => 
            buildOpts(foreignEntities, relationTable));

        selectEl.onchange = _evt => {
            const selectedIds = Array.from(selectEl.selectedOptions).map(optEl => optEl.value);
            loadRelationData().then(([foreignEntities, relationTable]) => {
                const ourRels = connectorController.relationsById(relationTable, entityFK, entity.id);
                const relsToAdd = selectedIds.filter(id => !ourRels.some(re => re[relatedFK] === id));
                const relsToRemove = ourRels.filter(re => !selectedIds.includes(re[relatedFK]));

                relsToAdd.forEach(relId => {
                    if (shouldClearOtherRels) {
                       connectorController.removeAllById(relationTable, relatedFK, relId);
                    }
                    const newRel = {[entityFK]: entity.id, [relatedFK]: relId};
                    connectorController.addRelation(rel_meta, relationTable, newRel);
                });
                relsToRemove.forEach(rel => {
                    console.log("rel", rel);
                    console.log("idx", connectorController.relationIndexByPair(relationTable, entityFK, entity.id, relatedFK, rel[relatedFK]));
                    connectorController.removeByIndex(relationTable, relatedIndex(relationTable, rel[relatedFK]));
                });

                buildOpts(foreignEntities, relationTable);
            });
        }

        const relatedIndex = (relationTable, relatedFkValue) =>
            connectorController.relationIndexByPair(relationTable, entityFK, entity.id, relatedFK, relatedFkValue);




        /*const ourRelations = relationTable =>
            connectorController.relationsById(relationTable, entityFK, entity.id);

        const otherRelationsToRelated = (relationTable, relatedId) =>
            connectorController.relationsById(relationTable, relatedFK, relatedId);

        const buildOpts2 = (allEntities, relationTable) => {
            const ourRels = ourRelations(relationTable);
            selectEl.innerHTML = buildOptsInitialHTML();
            // selectEl.size = allEntities.length;
            allEntities.forEach(relatedEntity => {
                const isRelated  = ourRels.some(re => re[relatedFK] === relatedEntity.id);
                const hasPicture = !!relatedEntity.pictureUrl;
                const [optEl] = dom(`
                    <option value="${relatedEntity.id}" ${isRelated ? "selected" : ""}>
                        <div>
                            ${hasPicture ? `<img src="${relatedEntity.pictureUrl}" />` : ''}
                            ${relatedEntity.displayedAs}
                        </div>
                        <button class="open">➚</button>
                    </option>`);

                const openEl = optEl.querySelector(".open");
                openEl.onclick = _evt => workbenchController.selectId(relatedTable, relatedEntity.id);

                selectEl.append(optEl);
            })
        }

        const registerChangeHandler = (allEntities, relationTable) => {
            selectEl.addEventListener("change", _evt => {
                const selectedIds = Array.from(selectEl.selectedOptions).map(optEl => optEl.value);
                const ourRels = ourRelations(relationTable);

                ourRels.filter(re => !selectedIds.includes(re[relatedFK])).forEach(rel => {
                    workbenchController.getRelationService(relationName).removeById(rel.id);
                });
                selectedIds.filter(id => !ourRels.some(re => re[relatedFK] === id)).forEach(relatedId => {
                    if (rel_meta.cardinality === ONE_TO_MANY && isOneSide) {
                        const otherRels = otherRelationsToRelated(relationTable, relatedId);
                        otherRels.forEach(otherRel => {
                            workbenchController.getRelationService(relationName).removeById(otherRel.id);
                        })
                    }
                    workbenchController.getRelationService(relationName).add({[entityFK]: entity.id, [relatedFK]: relatedId});
                });

                buildOpts(allEntities, relationTable);
            });
        }

        Promise.all([
            workbenchController.getEntityService(relatedTable).getAll(),
            workbenchController.getRelationService(relationName).getAll()
        ]).then(([allEntities, relationTable]) => {
            // buildOpts2(allEntities, relationTable);
            // registerChangeHandler(allEntities, relationTable);
        });*/

        /*const registerChangeHandler = (allEntities, relationTable) => {
            selectEl.addEventListener("change", _evt => {
                const selectedIds = Array.from(selectEl.selectedOptions).map(optEl => optEl.value);
                const ourRels = ourRelations(relationTable);

                // if (restrictToOneRelation) connectorController.removeAllById(relationTable, entityFK, entity.id);
                // if (restrictToOneRelation) connectorController.removeAllById(relationTable, entityFK, entity.id);
                // console.log(relatedFK)
                // console.log(relationTable);

                ourRels.filter(re => !selectedIds.includes(re[relatedFK])).forEach(rel => {
                    // if (isOneSide) console.log("removed")
                    workbenchController.getRelationService(relationName).removeById(rel.id);
                });
                selectedIds.filter(id => !ourRels.some(re => re[relatedFK] === id)).forEach(relatedId => {
                    // if (restrictToOneRelation) connectorController.removeAllById(relationTable, relatedFK, relatedId);
                    // if (restrictToOneRelation) {
                    //     console.log(relatedFK);
                    //     console.log(relatedId);
                    //     connectorController.removeAllById(relationTable, relatedFK, relatedId);
                    // }
                    // if (restrictToOneRelation) {
                    //     const otherRels = otherRelationsToRelated(relationTable, relatedId);
                    //     otherRels.forEach(otherRel => {
                    //         workbenchController.getRelationService(relationName).removeById(otherRel.id);
                    //     })
                    // }
                    if (rel_meta.cardinality === ONE_TO_MANY && isOneSide) {

                    }
                    workbenchController.getRelationService(relationName).add({[entityFK]: entity.id, [relatedFK]: relatedId});
                });

                buildOpts(allEntities, relationTable);
                // Promise.all([
                //     workbenchController.getEntityService(relatedTable).getAll(),
                //     workbenchController.getRelationService(relationName).getAll()
                // ]).then(([allEntities, relationTable]) => {
                //     buildOpts(allEntities, relationTable);
                // });
            });
        }*/

        // workbenchController.getEntityService(relatedTable).getAll()
        //    .then( entity => console.log("entity", entity) );

        // workbenchController.getRelationService(relationName).getAll()
        //    .then( relationTable => console.log("relationTable", relationTable) );

        // appController.getEntityService(relatedTable).getAll()
        //     .then ( newEntities => {
        //         newEntities.forEach( entity => {
        //             console.log(entity)
        //             //appController.entityAdded({entityName: meta.table, entity})
        //         });
        //     })
        // console.log(workbenchController.getProjectors())
        // console.log(connectorController.relationsById(relationTable, entityFK, entity.id))

        // console.log(workbenchController.getMeta().getEntityMeta("artist"))
        // console.log(connectorController)
        // const relatedListEl = dropzoneEl.querySelector("ul");
        // const removeEl      = dropzoneEl.querySelector(".remove");


        /*
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
        }, "link");*/

        return [
            /** @type { HTMLLabelElement } */ labelEl,
            /** @type { HTMLDivElement }   */ manageEl
        ];
    };

    return {
        projectConnection,
    }
};
