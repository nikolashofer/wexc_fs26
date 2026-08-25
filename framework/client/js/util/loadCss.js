export { loadCss }

const PROJECTOR_CSS_HREF_BASE = "../../framework/client/css/projector";

const loadCss = (...hrefs) => {
    const headEl = document.getElementsByTagName("head")[0];
    hrefs.forEach((href) => {
        const link  = document.createElement("link");
        link.rel    = "stylesheet";
        link.href   = `${PROJECTOR_CSS_HREF_BASE}/${href}`;
        headEl.appendChild(link);
    });
}