import {dom}                         from "../../util/dom.js";
import {CSS_CLASSNAME_SELECTED}      from "../../../../../app/client/js/Constants.js";
import {dragData, registerDraggable} from "../../util/DragAndDrop.js";

export { ExplorerProjector }

const ExplorerProjector = (entityName, appController) => {

    const meta = appController.getMeta().getEntityMeta(entityName);

    const projectListItem = (entity) => {
        const [li] = dom(`<li
             data-domain="${meta.table}"
             data-id="${entity.id}"
             >${entity.displayedAs}</li>`);
        // view binding per item
        li.onclick = _evt => {
            appController.setSelection({entityName: meta.table, entity});
        };
        // data binding:
        const didWe = change =>
            change.entityName === meta.table &&
            change.entity.id === entity.id;

        appController.onSelection( change =>
            didWe(change)
            ? li.classList.add(CSS_CLASSNAME_SELECTED)
            : li.classList.remove(CSS_CLASSNAME_SELECTED)
        );
        appController.onEntityChanged( change =>
            didWe(change)
            ? li.textContent = change.entity.displayedAs
            : undefined
        );
        appController.onEntityRemoved( change =>
            didWe(change)
            ? li.remove()
            : undefined
        );
        registerDraggable(li, dragData);

        return [li];
    };

    const projectExplorer = () => {
        const explorerSection = dom(`
        <details>
           <summary>${meta.label}</summary>
           <ul id="${meta.label}_explorer_list"></ul>
       </details>
       `); // todo dk: we do not need the id on the ul
        const [details] = explorerSection;
        const ul = details.querySelector("ul");

        // data binding
        appController.onEntityAdded( ({entityName, entity}) => {
            if(entityName !== meta.table) { return; }
            ul.append(...projectListItem(entity));
        });

        // data binding : open view when any included item is selected (programmatically)
        appController.onSelection( ({entityName, entity}) => {
            if(entityName !== meta.table) { return; }
            details.setAttribute("open","open");
        });

        appController.getEntityService(meta.table).getAll()
                     .then ( newEntities => {
                newEntities.forEach( entity => {
                    appController.entityAdded({entityName: meta.table, entity})
                });
            })
                     .catch( err => console.error(err)); // todo error visualization

        return explorerSection;
    };
    return { projectExplorer };
};

