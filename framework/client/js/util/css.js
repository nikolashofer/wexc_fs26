export { loadStylesheets, loadProjectorStylesheets, removeStylesheets }

const loadStylesheets = (...hrefs) => {
    const headEl = document.getElementsByTagName("head")[0];
    hrefs.forEach((href) => {
        const linkEl  = document.createElement("link");
        linkEl.rel    = "stylesheet";
        linkEl.href   = href;
        headEl.appendChild(linkEl);
    });
}

const PROJECTOR_STYLESHEET_BASE_PATH = "../../framework/client/css/projector";

const loadProjectorStylesheets = projectors =>
    loadStylesheets(...projectors.stylesheetPaths.map(href => `${PROJECTOR_STYLESHEET_BASE_PATH}/${href}`))

const removeStylesheets = () => {
    const headEl = document.querySelector("head");
    Array.from(headEl.children).forEach(child => {
        if (child.tagName === "LINK" && child.getAttribute("rel") === "stylesheet") {
            child.remove();
        }
    })
}