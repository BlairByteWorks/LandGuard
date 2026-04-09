import fs from 'fs';
import https from 'https';

const dataPath = 'C:/Users/blair/.gemini/antigravity/brain/39578d82-e6db-46ef-bd93-0601eced7d5f/.system_generated/steps/19/output.txt';
const outDir = './stitch_screens';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

data.screens.forEach((screen, i) => {
    const url = screen.htmlCode.downloadUrl;
    const title = screen.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const id = screen.name.split('/').pop();
    const outPath = `${outDir}/${title}_${id}.html`;

    https.get(url, (res) => {
        const file = fs.createWriteStream(outPath);
        res.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${outPath}`);
        });
    }).on('error', (err) => {
        console.error(`Error downloading ${title}: ${err.message}`);
    });
});
