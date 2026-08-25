export { loadCss, loadProjectorCss, removeCss }

const loadCss = (...hrefs) => {
    const headEl = document.getElementsByTagName("head")[0];
    hrefs.forEach((href) => {
        const link  = document.createElement("link");
        link.rel    = "stylesheet";
        link.href   = href;
        headEl.appendChild(link);
    });
}

const PROJECTOR_CSS_HREF_BASE = "../../framework/client/css/projector";

// TODO: maybe rename to loadProjectorStylesheets loadStylesheets respectively
const loadProjectorCss = (projectors) =>
    loadCss(projectors.cssHrefs.map(href => `${PROJECTOR_CSS_HREF_BASE}/${href}`))

const removeCss = () => {
    const headEl = document.querySelector("head");
    Array.from(headEl.children).forEach(child => {
        if (child.tagName === "LINK" && child.getAttribute("rel") === "stylesheet") {
            child.remove();
        }
    })
}