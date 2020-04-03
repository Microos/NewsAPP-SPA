import Lockr from 'lockr'

Lockr.prefix = 'lockr_';
let lockrFlush = () => {
    Lockr.flush();
    console.log('Lockr cleared');
    console.log(`Lockr object count: ${Lockr.getAll().length}`);
    console.log(`LocalStorage count: ${localStorage.length}`);
};

let favManager = {

    get() {
        this.init();
        return Lockr.get('fav');
    },
    set(v) {
        Lockr.set('fav', v);
    },
    init(force) {
        if (!force) {
            if (!Lockr.get('fav')) Lockr.set('fav', {});
        } else {
            Lockr.set('fav', {});
        }
    },
    isFavorite(base64ArtId) {
        return this.get()[base64ArtId];
    },
    addFavorite(base64ArtId, data) {
        const map = this.get();
        map[base64ArtId] = data;
        this.set(map);
    },

    removeFavorite(base64ArtId) {
        if (!this.isFavorite(base64ArtId)) {
            console.error(`Remove favorite [${base64ArtId}] => not such an item.`);
            return;
        }
        const map = this.get();
        delete map[base64ArtId];
        this.set(map);
    },
    getKeys() {
        return Object.keys(this.get());
    },
    getDataByKey(key) {
        return this.get()[key];
    }
};
favManager.init();

export {favManager, lockrFlush};