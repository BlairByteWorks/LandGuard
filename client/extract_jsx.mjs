import fs from 'fs';
import path from 'path';

const htmls = [
    { file: 'landguard_landing___search_page_1dfaf64d7cc143a7ab94c24fb02243d1.html', name: 'LandingPage' },
    { file: 'landguard_forgot_password_recovery_cd94bb9df60b4316af2d878956362552.html', name: 'ForgotPasswordPage' },
    { file: 'property_trust_report_dashboard_a9450da4a60e44318c8b001437ad0c4d.html', name: 'PropertyTrustReportPage' },
    { file: 'registrar_verification_dashboard_4ca81f4e8c484570a8bc06c98155d296.html', name: 'RegistrarVerificationPage' },
    { file: 'seller_upload_deed_dashboard_fd9728fe434946c39f0f7e5f7ce47783.html', name: 'SellerUploadDeedPage' }
];

const inDir = './stitch_screens';
const outDir = './src/pages';

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

htmls.forEach(({ file, name }) => {
    const content = fs.readFileSync(path.join(inDir, file), 'utf8');

    // Extract <main> content
    const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/);
    if (!mainMatch) {
        console.error(`Could not find <main> in ${file}`);
        return;
    }

    let innerHtml = mainMatch[1];

    // Convert HTML attributes to JSX
    innerHtml = innerHtml.replace(/class="/g, 'className="');
    innerHtml = innerHtml.replace(/for="/g, 'htmlFor="');
    innerHtml = innerHtml.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

    // Close unclosed tags (img, input, hr, br)
    innerHtml = innerHtml.replace(/<(input|img|hr|br)([^>]*?)>/g, (match, tag, attrs) => {
        // If it already closes with />, leave it alone
        if (attrs.trim().endsWith('/')) {
            return match;
        }
        return `<${tag}${attrs} />`;
    });

    // Fix inline styles to be objects (Very basic handling)
    innerHtml = innerHtml.replace(/style="([^"]*)"/g, (match, styleString) => {
        const props = styleString.split(';').filter(Boolean).map(s => {
            const [key, value] = s.split(':');
            if (!key || !value) return '';
            const camelKey = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            return `${camelKey}: '${value.trim().replace(/'/g, "\\'")}'`;
        }).filter(Boolean).join(', ');
        return `style={{ ${props} }}`;
    });

    const componentCode = `import { Link } from 'react-router-dom';

export default function ${name}() {
  return (
    <>
      ${innerHtml}
    </>
  );
}
`;

    fs.writeFileSync(path.join(outDir, `${name}.jsx`), componentCode);
    console.log(`Generated ${name}.jsx`);
});
