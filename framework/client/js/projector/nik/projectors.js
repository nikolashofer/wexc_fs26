import {ExplorerProjector}  from "./explorerProjector.js";
import {WorkbenchProjector} from "./workbenchProjector.js";
import {ConnectorProjector} from "./connectorProjector.js";
import {SiteProjector}      from "./siteProjector.js";

export { nikProjectors }


const siteProjector = (appController) => {
    return SiteProjector(appController);                                // default
};

const explorerProjector = (entityName, appController) => {
    return ExplorerProjector(entityName, appController);                // default
};

const workbenchProjector = (workbenchController) => {
    return WorkbenchProjector(workbenchController);                     // default
};

const connectorProjector = (workbenchController) => {
    return ConnectorProjector(workbenchController);                     // default
};

/**
 * Provide a collection of overridable functions, analogous to the Abstract Factory Design Pattern
 * @typedef ProjectorProviderType
 * @property { * } siteProjector - todo: flesh out the types
 * @property { * } explorerProjector
 * @property { * } workbenchProjector
 * @property { * } connectorProjector
 * @property { Array<String> } stylesheetPaths
 */
/** @type { ProjectorProviderType } */
const nikProjectors = {
    siteProjector,
    explorerProjector,
    workbenchProjector,
    connectorProjector,
    stylesheetPaths: ["nik/main.css"],
};

