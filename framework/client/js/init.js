import {defaultProjectors} from "./projector/default/projectors.js";
import {loadProjectorCss, removeCss} from "./util/css.js";

export { init, DEFAULT_OPTS }

const DEFAULT_OPTS = {
    initialProjectors: defaultProjectors,
    onInitialized: () => {} // no-op
};

const init = (siteController, serviceFactory, opts = defaultOpts) => {
    const {initialProjectors, onInitialized} = opts;
    const rootEl = document.getElementById("root");

    siteController.setProjectors(initialProjectors, rootEl);

    siteController.setServiceFactory(serviceFactory)
        .then(meta => {
            loadProjectorCss(initialProjectors)
            const siteProjector = siteController.getProjectors().siteProjector(siteController);
            rootEl.append(...siteProjector.projectBodyContent());
            onInitialized(meta);
        });

    const changeProjectors = projectors => {
        rootEl.innerHTML = "";
        removeCss();
        loadProjectorCss(projectors)
        siteController.setProjectors(projectors);
        const siteProjector = siteController.getProjectors().siteProjector(siteController);
        rootEl.append(...siteProjector.projectBodyContent());
    }

    return changeProjectors;
}