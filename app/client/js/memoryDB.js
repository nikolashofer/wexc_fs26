import {ROLE_ADMIN, ROLE_AUTH, ROLE_GUEST}                                                               from "./Constants.js";
import {
    ARTIST,
    ARTIST_ARTWORK,
    ARTWORK,
    EPOCH,
    EPOCH_ARTIST,
    PROVENANCE, PROVENANCE_ARTWORK,
    RATING,
    STARS,
    ROLE,
    ROLE_USER,
    USER, ARTWORK_RATING, STARS_RATING, USER_RATING
} from "./appTypes.js";

export { memoryDB };



const artist_entity = [
    {
        id:          "0",
        displayedAs: "Botticelli",
        fullName:    "Sandro di Mariano di Vanni Filipepi, gen. Botticelli",
        birthDate:   "1445-03-01",
        deathDate:   "1510-05-17",
        pictureUrl:  "https://www.van-ham.com/fileadmin/kdb/Sandro_Botticelli/Vanham-20111-Artist-Portrait-Sandro-Botticelli_01.jpg",
        bioUrl:      "https://de.wikipedia.org/wiki/Sandro_Botticelli",
    },
    {
        id:          "1",
        displayedAs: "Leonardo",
        fullName:    "Leonardo da Vinci",
        birthDate:   "1452-04-15",
        deathDate:   "1519-05-02",
        pictureUrl:  "https://img2.rtve.es/imagenes/francia-italia-recuerdan-leonardo-davinci-quinto-centenario-su-muerte/1556808387309.jpg",
        bioUrl:      "https://de.wikipedia.org/wiki/Leonardo_da_Vinci",
    },
    {
        id: "2",
        displayedAs: "Velázquez",
        fullName:    "Diego Rodríguez de Silva y Velázquez",
        birthDate:   "1599-06-06",
        deathDate:   "1660-08-06",
        pictureUrl:  "https://www.elsiglodetorreon.com.mx/m/i/2018/06/1066918.jpeg",
        bioUrl:      "https://de.wikipedia.org/wiki/Diego_Velázquez",
    },
    {
        id: "3",
        displayedAs: "Rembrandt",
        fullName:    "Rembrandt Harmenszoon van Rijn",
        birthDate:   "1606-07-15",
        deathDate:   "1669-10-04",
        pictureUrl:  "https://upload.wikimedia.org/wikipedia/commons/9/9f/Rembrandt_van_Rijn_-_Self-Portrait_(1659)_detail.jpg",
        bioUrl:      "https://de.wikipedia.org/wiki/Rembrandt_van_Rijn",
    },
    {
        id: "4",
        displayedAs: "Caravaggio",
        fullName:    "Michelangelo Merisi da Caravaggio",
        birthDate:   "1571-09-29",
        deathDate:   "1610-07-18",
        pictureUrl:  "https://assets.isu.pub/document-structure/230211172609-44436e8273fd240089434bcc242781aa/v1/a195a7cffc7c7297c7297fe2f2290404.jpeg",
        bioUrl:      "https://de.wikipedia.org/wiki/Michelangelo_Merisi_da_Caravaggio",
    },
];

const artwork_entity = [
    {id: "0", displayedAs: "Primavera",         material:"Oil on Canvas", pictureUrl:"https://i.etsystatic.com/24975039/r/il/767364/2658209699/il_1140xN.2658209699_4ton.jpg"},
    {id: "1", displayedAs: "Birth of Venus",    material:"Oil on Canvas", pictureUrl:"http://www.abm-enterprises.net/artgall2/botticelli_birth_venus_2.jpg"},
    {id: "2", displayedAs: "Mona Lisa",         material:"Oil on Canvas", pictureUrl:"https://cdn.britannica.com/24/189624-050-F3C5BAA9/Mona-Lisa-oil-wood-panel-Leonardo-da.jpg"},
    {id: "3", displayedAs: "Las Meninas",       material:"Oil on Canvas", pictureUrl:"https://cdn.thecollector.com/wp-content/uploads/2023/12/velazquez-las-meninas-painting.jpg?width=1176&quality=100&dpr=2"},
    {id: "4", displayedAs: "The Night's Watch", material:"Oil on Canvas", pictureUrl:"https://cdn4.dogonews.com/images/d7117b2c-f95d-461a-8508-4eb063e7cbca/night_watch.jpeg"},
    {id: "5", displayedAs: "Mary Magdalene",    material:"Oil on Canvas", pictureUrl:"https://rukminim1.flixcart.com/image/416/416/poster/y/f/n/the-museum-outlet-marie-s-coronation-by-rubens-a3-poster-a3-original-imadzwhb3xf25gyz.jpeg?q=70"},
];
const provenance_entity = [
    {id: "0", displayedAs: "Louvre",},
    {id: "1", displayedAs: "Musèe D'Orsay",},
    {id: "2", displayedAs: "Landesmuseum CH",},
    {id: "3", displayedAs: "Albertina",},
];
const epoch_entity = [
    {id: "0", displayedAs: "Classic",},
    {id: "1", displayedAs: "Gothic",},
    {id: "2", displayedAs: "Renaissance",},
    {id: "3", displayedAs: "Baroque",},
    {id: "4", displayedAs: "Impressionism",},
];
const rating_entity = [
    {id: "0", displayedAs: "first rating",},
];
const stars_entity = [
    {id: "0", displayedAs: "none",},
    {id: "1", displayedAs: "*",},
    {id: "2", displayedAs: "* *",},
    {id: "3", displayedAs: "* * *",},
    {id: "4", displayedAs: "* * * *",},
    {id: "5", displayedAs: "* * * * *",},
];
const user_entity = [
    {id: "0", displayedAs: "Freddy Mercury"},
    {id: "1", displayedAs: "Udo Lindenberg"},
    {id: "2", displayedAs: "Alexander Frege"},
];
const role_entity = [
    {id: "0", displayedAs: ROLE_GUEST,},
    {id: "1", displayedAs: ROLE_AUTH,},
    {id: "2", displayedAs: ROLE_ADMIN,},
];
const role_user_relation = [
    {id: "0", roleId: "0", userId: "0"},
    {id: "1", roleId: "1", userId: "1"},
    {id: "2", roleId: "2", userId: "2"},
];
const artist_artwork_relation = [
    {id: "0", artistId: "0", artworkId:"0"},
    {id: "1", artistId: "0", artworkId:"1"},
    {id: "2", artistId: "1", artworkId:"2"},
];
const provenance_artwork_relation = [
    {id: "0", provenanceId: "0", artworkId:"2"},
];
const epoch_artist_relation = [
    {id: "0", epochId: "1", artistId:"0"},
    {id: "1", epochId: "2", artistId:"0"},
    {id: "2", epochId: "2", artistId:"1"},
    {id: "3", epochId: "2", artistId:"4"},
    {id: "4", epochId: "3", artistId:"4"},
];

const artwork_rating_relation = [
    {id: "0", ratingId: "0", artworkId:"1"},
];

const stars_rating_relation = [
    {id: "0", ratingId: "0", starsId:"5"},
];

const user_rating_relation = [
    {id: "0", ratingId: "0", userId:"1"},
];

const memoryDB = {
    [ARTIST]:             artist_entity,
    [ARTWORK]:            artwork_entity,
    [PROVENANCE]:         provenance_entity,
    [EPOCH]:              epoch_entity,
    [RATING]:             rating_entity,
    [STARS]:              stars_entity,
    [USER]:               user_entity,
    [ROLE]:               role_entity,
    [ROLE_USER]:          role_user_relation,
    [ARTIST_ARTWORK]:     artist_artwork_relation,
    [PROVENANCE_ARTWORK]: provenance_artwork_relation,
    [EPOCH_ARTIST]:       epoch_artist_relation,
    [ARTWORK_RATING]:     artwork_rating_relation,
    [STARS_RATING]:       stars_rating_relation,
    [USER_RATING]:        user_rating_relation,
};
