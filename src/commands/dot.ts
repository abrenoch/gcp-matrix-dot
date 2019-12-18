import fetch from 'node-fetch';
import { MatrixClient, MessageEvent, MessageEventContent } from 'matrix-bot-sdk';
import { createCanvas } from 'canvas';

const IMAGE_EXTENSION = 'png';
const IMAGE_MIME_TYPE = `image/${IMAGE_EXTENSION}`;
const DOT_URL = 'http://gcpdot.com/gcpindex.php?small=1';

export async function runCurrentDotCommand(roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: MatrixClient) {
    const dotResponse = await fetch(DOT_URL);
    
    let body = null;
    try {
        body = await dotResponse.text();
    } catch (error) {
        console.error(error);
    }

    if (dotResponse.status === 200 && typeof body === 'string') {
        const colorHex = parseColor(body);
        const data = makeDotImage(colorHex);
        const filename = `GCP.${colorHex}.${IMAGE_EXTENSION}`;

        try {
            const uploadResponse = await client.uploadContent(data, IMAGE_MIME_TYPE, filename);
            if (uploadResponse) {
                return client.sendMessage(roomId, {
                    body: filename,
                    msgtype: 'm.image',
                    mimetype: IMAGE_MIME_TYPE,
                    url: uploadResponse
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Now send that message as a notice
    return client.sendMessage(roomId, {
        body: 'There was a problem getting the dot',
        msgtype: 'm.notice',
        format: 'org.matrix.custom.html',
        formatted_body: '<i>There was a problem getting the dot</i>',
    });
}

function parseColor (body) {
    let high = 0;
    body.match(/(0\.\d+)/g).forEach(function (gcp) {
        const gcpf = parseFloat(gcp);
        if (gcpf > high) high = gcpf;
    });
    let color = 'CDCDCD';
    if (high >= 0.01) color = 'FFA8C0';
    if (high >= 0.05) color = 'FF1E1E';
    if (high >= 0.08) color = 'FFB82E';
    if (high >= 0.15) color = 'FFD517';
    if (high >= 0.23) color = 'FFFA40';
    if (high >= 0.30) color = 'F9FA00';
    if (high >= 0.40) color = 'AEFA00';
    if (high >= 0.90) color = '64FA64';
    if (high >= 0.9125) color = '64FAAB';
    if (high >= 0.93) color = 'ACF2FF';
    if (high >= 0.95) color = '0EEEFF';
    if (high >= 1) color = '24CBFD';
    return color;
}

function makeDotImage (color) {
    const canvas = createCanvas(50, 50);
    const context = canvas.getContext('2d');
    const stroke = 1;
    const radius = 25;
    context.beginPath();
    context.arc(25, 25, radius, 0, 2 * Math.PI, false);
    context.fillStyle = `#${color}`;
    context.fill();
    // context.lineWidth = stroke;
    // context.strokeStyle = `#${color}`;
    // context.stroke();
    return canvas.toBuffer('image/png');

}