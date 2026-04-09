import fs from 'fs';

const dataPath = 'C:/Users/blair/.gemini/antigravity/brain/39578d82-e6db-46ef-bd93-0601eced7d5f/.system_generated/steps/19/output.txt';
const outDir = './stitch_screens';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function download() {
    for (const screen of data.screens) {
        const url = screen.htmlCode.downloadUrl;
        const title = screen.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const id = screen.name.split('/').pop();
        const outPath = `${outDir}/${title}_${id}.html`;

        try {
            const response = await fetch(url);
            const text = await response.text();
            fs.writeFileSync(outPath, text);
            console.log(`Downloaded ${outPath} size ${text.length}`);
        } catch (err) {
            console.error(`Error downloading ${title}: ${err.message}`);
        }
    }
}
download();
