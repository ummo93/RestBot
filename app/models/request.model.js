import request from 'superagent'
import { Attachment } from './atachment.model'

export class RequestZip {
    constructor(zip) {
        this.zip = zip;
    }

    getLocation(next) {
        request
            .post("http://maps.huge.info/zip.pl")
            .send({ZIP: this.zip})
            .set('Content-Type', 'application/x-www-form-urlencoded;')
            .timeout(15000)
            .end((err, res) => {
                if (res.text.length > 155) {
                    let loc = res.text.split("\"");
                    
                    let attachment = new Attachment(loc[7] + " ," + loc[17] + ", " + loc[15]);
                    let structure = attachment.postback(2, ["Confirm", "Back"], ["nextToOrder", "backToZIP"]);
                    
                    next(structure, false);
                } else {
                    next(false, true);
                }
            });
    }
}