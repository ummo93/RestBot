export class Attachment {
    
    constructor(title = "", subtitle = "", imageUrl = "") {
        this.title = title;
        this.subtitle = subtitle;
        this.imageUrl = imageUrl;
    }

    /**
     * Return the attachment template for Messenger
     * @param buttonsNum {number} - count of buttons
     * @param titles {Array} - array of buttons titles
     * @param payloads {Array} - array of payloads of button titles
     * */
    postback(buttonsNum, titles, payloads) {

        let buttons = [];
        for (let i = 0; i < (Math.min(buttonsNum, 3)); i++) {
            buttons.push({
                'type': 'postback',
                'title': titles[i],
                'payload': payloads[i]
            })
        }

        let structure = {
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': this.title,
                            'image_url': this.imageUrl,
                            'subtitle': this.subtitle,
                            'buttons': buttons
                        }
                    ]
                }
            }
        };

        return structure;
    }

    /**
     * Return the attachment template for Messenger
     * @param elementsNum {number} - count of slides
     * @param buttonsNum {number} - count of buttons
     * @param titles {Array} - array of elements titles
     * @param subtitles {Array} - array of elements subtitles
     * @param payloads {Array} - array of payloads of button titles
     * @param images {Array} - url array of slides images
     * @param butTitles {Array} - array of buttons titles
     * */

    slider(elementsNum, buttonsNum, titles, subtitles, payloads, images, butTitles) {

        let buttons = [];
        let elements = [];

        for (let j = 0; j < (Math.min(buttonsNum, 3)); j++) {

            buttons.push({
                'type': 'postback',
                'title': butTitles[j],
                'payload': payloads[j]
            });
        }

        for (let i = 0; i < (Math.min(elementsNum, 5)); i++) {

            elements.push({
                'title': titles[i],
                'image_url': images[i],
                'subtitle': subtitles[i],
                'buttons': buttons
            })

        }

        let structure = {
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': elements
                }
            }
        };

        return structure;
    }
}