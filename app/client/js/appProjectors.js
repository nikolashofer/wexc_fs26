import {ConnectorProjector} from "../../../framework/client/js/projector/default/connectorProjector.js";
import {defaultProjectors}       from "../../../framework/client/js/projector/default/projectors.js";
import {ARTWORK, ARTWORK_RATING} from "./appTypes.js";
import {dom}                     from "../../../framework/client/js/util/dom.js";

export { appProjectors }

const connectorProjector = (workbenchController) => {

    const SpecialProjector = (workbenchController) => {
        const projectConnection = (rel_meta, entityName, entity) => {
            if (rel_meta.relationId !== ARTWORK_RATING || entityName !== ARTWORK) {
                return ConnectorProjector(workbenchController).projectConnection(rel_meta, entityName, entity);
            }
            const [labelEl, divEl] = dom(`
                <div>Rating</div>
                <div class="starredRating">
                    <div>average rating: <span class="average">n/a</span> (random) </div>
                    <div class="stars"> 
                        <label for="star1">★</label><input type="radio" id="star1" name="stars" value="1"/>
                        <label for="star2">★</label><input type="radio" id="star2" name="stars" value="2"/>
                        <label for="star3">★</label><input type="radio" id="star3" name="stars" value="3"/>
                        <label for="star4">★</label><input type="radio" id="star4" name="stars" value="4"/>
                        <label for="star5">★</label><input type="radio" id="star5" name="stars" value="5"/>
                    </div>
                </div>
            `);
            const avgEl        = divEl.querySelector(".average");
            const starInputEls = divEl.querySelectorAll("input");
            // data binding (set average, set rating of this artwork for this user)
            avgEl.textContent = String(1 + Math.random()*5 | 0);    // todo: let controller calculate

            // pretend current user's rating for this artwork is "3"
            starInputEls.forEach( starInputEl => {
                starInputEl.checked = false;
                if (starInputEl.value === "3") {
                    starInputEl.checked = true;
                }
            });

            // view binding: what to do on star selection
            const currentUserId = "0";
            const currentArtworkId = "0";
            const selectedRating = "3";
            // if there is a rating, we have to update
                // find rating by artworkId and userId
            // otherwise create a new rating and the respective relations (might need transaction support)
            starInputEls.forEach( starInputEl => {
                starInputEl.onchange = _evt => {
                    if (!starInputEl.checked) { return; }
                    const starsId = starInputEl.value; // luckily we have set the values that this holds
                    console.log("set or update rating", {currentUserId, currentArtworkId, starsId});
                    // todo: call service, re-render
                };
            });

            return [labelEl, divEl];
        };
        return { projectConnection }
    };

    console.info("specialized connector projector in use");
    return SpecialProjector(workbenchController);
};


/** @type { ProjectorProviderType } */
const appProjectors = {
    ...defaultProjectors, // default - we only want to specialize the connectors
    connectorProjector,
};

