export { loadCss, loadProjectorCss }

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

const loadProjectorCss = (...hrefs) =>
    loadCss(hrefs.map(href => `${PROJECTOR_CSS_HREF_BASE}/${href}`))