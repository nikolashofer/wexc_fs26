import {Observable} from "../observable/observable.js";
import {defaultProjectors} from "../projector/default/projectors.js";
import { loadCss } from "../util/loadCss.js";

export {SiteController, NO_SELECTION};

/** @typedef EntitySelectionType
 * @property { EntityNameType } entityName
 * @property { Object } entity
 */

const NO_SELECTION = /** @type { EntitySelectionType } */ {};

const SiteController = () => {

    // the app controller aggregates the presentation model

    const currentUserId    = Observable("0");

    const selectionObs     = Observable(NO_SELECTION);

    const entityAddedObs   = Observable(NO_SELECTION);
    const entityRemovedObs = Observable(NO_SELECTION);
    const entityChangedObs = Observable(NO_SELECTION);

    /** @type { ServiceFactoryType } */
    let serviceFactory = undefined;

    /** @type { MetaInfoType } */
    let meta = undefined;

    // might be overridden by app on startup. Not to be changed during runtime (for now)
    let projectors = defaultProjectors;

    const getProjectors = () => projectors;
    const setProjectors = newProjectors => {
        projectors = newProjectors;
        loadCss(newProjectors.cssHrefs);
    };

    /**
     * Central management that keeps the currently used service factory in a singleton.
     * Immediately loads the meta information from the service and keeps it locally cached.
     * Starter can proceed when factory is set and meta is successfully loaded.
     * @param { ServiceFactoryType } newFactory
     * @return Promise<void> - to allow proceeding when all is loaded
     */
    const setServiceFactory = newFactory => {
        serviceFactory = newFactory;
        return serviceFactory.getMetaService().getMeta()
            .then(m => meta = m)
    };

    const getRelationService = relationName => serviceFactory.getRelationService(relationName);
    const getEntityService   = entityName   => serviceFactory.getEntityService(entityName);

    // all below might go into EntityController
    const findEntity = (tableName, id) => {
        return getEntityService(tableName).getById(id);
    };

    const newEntity = metaInf => {
        const createdEntity = {};
        for (const prop of metaInf.properties) {
            createdEntity[prop.name] = prop.init;
        }
        getEntityService(metaInf.table)
            .add(createdEntity)
            .then(newEntity => {
                // make sure the explorers are updated as well
                const data = {entityName: metaInf.table, entity: newEntity};
                entityAddedObs.setValue(data);
                selectionObs.setValue(data);
            })
            .catch(error => console.error("cannot add empty entity for " + metaInf.table, error));
    };

    const removeEntity = (metaInf, entity) => {
        getEntityService(metaInf.table)
            .removeById(entity.id)
            .then(success => {
                if (success) {
                    entityRemovedObs.setValue({entityName: metaInf.table, entity});
                    selectionObs.setValue(NO_SELECTION); // todo: better selection handling
                    // todo: toast
                } else {
                    // :-( message
                }
            })
            .catch(error => console.error("cannot remove entity for " + metaInf.table, entity, error));
    };

    const putEntity = (metaInf, entity) => {
        getEntityService(metaInf.table)
            .put(entity)
            .then(updatedEntity => {
                entityChangedObs.setValue({entityName: metaInf.table, entity: updatedEntity}); // this will fire too much because === on obj
            })
            .catch(error => console.error("cannot update entity for " + metaInf.table, entity, error));
    };

    return {
        getCurrentUserId:       currentUserId.getValue,
        setCurrentUserId:       currentUserId.setValue,
        onCurrentUserIdChanged: currentUserId.onChange,
        setSelection:     selectionObs.setValue,
        getSelection:     selectionObs.getValue,
        onSelection:      selectionObs.onChange,
        entityAdded:      entityAddedObs.setValue,
        entityRemoved:    entityRemovedObs.setValue,
        entityChanged:    entityChangedObs.setValue,
        onEntityAdded:    entityAddedObs.onChange,
        onEntityRemoved:  entityRemovedObs.onChange,
        onEntityChanged:  entityChangedObs.onChange,
        getProjectors,
        setProjectors,
        setServiceFactory,
        getEntityService,
        getRelationService,
        findEntity,
        newEntity,
        removeEntity,
        putEntity,
        getMeta:          () => meta,
    };
};
