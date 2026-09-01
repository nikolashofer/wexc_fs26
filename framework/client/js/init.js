import {PROJECTORS_REGISTRY, PROJECTORS_REGISTRY_ENTRIES} from "./projector/registry.js";
import {dom} from "./util/dom.js";
import {loadProjectorStylesheets, removeStylesheets} from "./util/css.js";

export { init, DEFAULT_OPTS }

const DEFAULT_OPTS = {
    initialProjectors: PROJECTORS_REGISTRY.default,
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

    const changeProjectors = key => {
        const projectors = PROJECTORS_REGISTRY[key];
        siteController.setProjectors(projectors);

        rootEl.innerHTML = "";
        removeStylesheets();

        loadProjectorStylesheets(projectors)
        const siteProjector = siteController.getProjectors().siteProjector(siteController);
        rootEl.append(...siteProjector.projectBodyContent());
    }

    initProjectorsSwitcher(initialProjectors, changeProjectors);
}

const initProjectorsSwitcher = (initialProjectors, onChangeProjectors) => {
    const switcherEl = document.getElementById("projectors-switcher");
    const [selectEl] = dom(`<select></select>`);

    PROJECTORS_REGISTRY_ENTRIES.forEach(([key]) => {
        const [optEl] = dom(`
            <option value="${key}" ${key === initialProjectors.key ? "selected" : ""}>
                ${key.toUpperCase()}
            </option>`);
        selectEl.append(optEl);
    });

    selectEl.onchange = evt => onChangeProjectors(evt.target.value);
    switcherEl.append(selectEl);
}