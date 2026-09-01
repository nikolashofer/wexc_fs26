import {defaultProjectors} from "./default/projectors.js";
import {nikProjectors} from "./nik/projectors.js";

export { PROJECTORS_REGISTRY, PROJECTORS_REGISTRY_ENTRIES };

const PROJECTORS_REGISTRY = {
  default: defaultProjectors,
  nik: nikProjectors,
}

const PROJECTORS_REGISTRY_ENTRIES = Object.entries(PROJECTORS_REGISTRY);