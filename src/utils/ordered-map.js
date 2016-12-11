/**
 * Created by eugene.levenetc on 11/12/2016.
 */
class OrderedMap {

    constructor() {
        this.map = {};
        this.array = [];
    }

    put(key, value) {
        this.map[key] = value;
        this.array.push(key);
    }

    get(key) {
        if (this.map.hasOwnProperty(key)) {
            return this.map[key];
        } else {
            return null;
        }
    }

    remove(key) {
        if (this.map.hasOwnProperty(key)) {
            delete this.map[key];
            let index = this.array.indexOf(key);
            this.array.splice(index, 1);
        }
    }

    indexOfValue(value) {
        for (let i = 0; i < this.array.length; i++) {
            let key = this.array[i];
            if (this.map.hasOwnProperty(key) && this.map[key] === value) {
                return i;
            }
        }
        return -1;
    }

    indexOfKey(checkKey) {
        for (let i = 0; i < this.array.length; i++) {
            let key = this.array[i];
            if (this.map.hasOwnProperty(key) && key === checkKey) {
                return i;
            }
        }
        return -1;
    }

    iterate(handler) {
        for (let i = 0; i < this.array.length; i++) {
            let key = this.array[i];
            handler(key, this.map[key]);
        }
    }

    size() {
        return this.array.length;
    }
}

module.exports = OrderedMap;