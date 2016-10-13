/**
 * Created by ummo93 https://github.com/ummo93 Appartika com. on 05.10.2016.
 */
export class LocalStorage {

    constructor() {
        this.storage = [];
    }
    setStatus(id, status) {
        this.get(id, (userObject) => {
            if(userObject){
                userObject.status = status;
            }
        });
    }

    get(id, next) {
        let isUser = this.isExist(this.storage, id);
        if(isUser){
            next(isUser);
        } else {
            next(false);
        }
    }

    save(id, ts, status) {
        this.storage.push({"id": id, "created_at": ts, "status": status})
    }

    all() {
        return this.storage;
    }

    isExist(arr, id){
        for(let i in arr){
            if(arr[i]["id"] == id){
                return arr[i]
            }
        }
        return false
    }
}