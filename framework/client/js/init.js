import {defaultProjectors} from "./projector/default/projectors.js";
import {loadProjectorStylesheets, removeStylesheets} from "./util/css.js";

export { init, DEFAULT_OPTS }

const DEFAULT_OPTS = {
    initialProjectors: defaultProjectors,
    onInitialized: () => {} // no-op
};

const init = (siteController, serviceFactory, opts) => {
    const {initialProjectors, onInitialized} = {...DEFAULT_OPTS, ...opts};
    const rootEl = document.getElementById("root");

    siteController.setProjectors(initialProjectors, rootEl);

    siteController.setServiceFactory(serviceFactory)
        .then(meta => {
            loadProjectorStylesheets(initialProjectors)
            const siteProjector = siteController.getProjectors().siteProjector(siteController);
            rootEl.append(...siteProjector.projectBodyContent());
            onInitialized(meta);
        });

    const changeProjectors = projectors => {
        rootEl.innerHTML = "";
        removeStylesheets();
        loadProjectorStylesheets(projectors)
        siteController.setProjectors(projectors);
        const siteProjector = siteController.getProjectors().siteProjector(siteController);
        rootEl.append(...siteProjector.projectBodyContent());
    }

    return changeProjectors;
}