export { WorkbenchController }

const WorkbenchController = siteController => {

    const selectId = async (entityName,id) => {
        const entity = await siteController.findEntity(entityName, id);
        if(!entity) {
            console.warn("cannot find for selection", entityName, id);
            return;
        }
        siteController.setSelection( {entityName, entity});
    };

    return {
        newEntity:          siteController.newEntity,
        removeEntity:       siteController.removeEntity,
        putEntity:          siteController.putEntity,
        onEntityChanged:    siteController.onEntityChanged,
        findEntity:         siteController.findEntity,
        getMeta:            siteController.getMeta,
        getRelationService: siteController.getRelationService, // well, this breaks symmetry
        getEntityService:   siteController.getEntityService,
        getProjectors:      siteController.getProjectors,
        selectId,
    };
};
