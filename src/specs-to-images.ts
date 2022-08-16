import { SingleView } from 'gosling.js/dist/src/core/gosling.schema';
import puppeteer from 'puppeteer';
import fs from 'fs';
import { GOSLING_VERSION, HIGLASS_VERSION, IMG_EXTENSION, IMG_FOLDER } from './constants';

/**
 * @param {string} spec
 * @param {{ reactVersion: string, pixijsVersion: string, higlassVersion: string, goslingVersion: string }} pkgOptions
 * @returns {string}
 */
function html(spec, {
	reactVersion = '17',
	pixijsVersion = '6',
	higlassVersion = HIGLASS_VERSION,
	goslingVersion = GOSLING_VERSION,
} = {}) {
	const baseUrl = 'https://unpkg.com';
	return `\
<!DOCTYPE html>
<html>
	<link rel="stylesheet" href="${baseUrl}/higlass@${higlassVersion}/dist/hglib.css">
	<script src="${baseUrl}/react@${reactVersion}/umd/react.production.min.js"></script>
	<script src="${baseUrl}/react-dom@${reactVersion}/umd/react-dom.production.min.js"></script>
	<script src="${baseUrl}/pixi.js@${pixijsVersion}/dist/browser/pixi.min.js"></script>
	<script src="${baseUrl}/higlass@${higlassVersion}/dist/hglib.js"></script>
	<script src="${baseUrl}/gosling.js@${goslingVersion}/dist/gosling.js"></script>
<body>
	<div id="vis"></div>
	<script>
		gosling.embed(document.getElementById("vis"), JSON.parse(\`${spec}\`), { padding: 0, margin: 0 })
	</script>
</body>
</html>`;
}

/**
 * @param {string} spec
 * @param {import("puppeteer").ScreenshotOptions} opts
 * @returns {Promise<Buffer>}
 */
export async function screenshot(spec, opts) {
	// to use escape characters as pure text (e.g., separator: '\t') in `.setContent()`
	spec = spec.replaceAll('\\', '\\\\');
	
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--use-gl=swiftshader'], // more consistent rendering of transparent elements
	});

	const page = await browser.newPage();
	await page.setContent(html(spec), { waitUntil: 'networkidle0' });
	const component = await page.waitForSelector('.gosling-component');
	const buffer = await component!.screenshot(opts);

	await browser.close();
	return buffer;
}

/**
 * Generates images using specs and a dictionary for all images.
 */
function specsToImages(jsons: { id: string, spec: SingleView}[]) {
	jsons.forEach(({id, spec}) => {
		screenshot(JSON.stringify(spec), { path: `${IMG_FOLDER}${id}.${IMG_EXTENSION}` });
	});
	fs.writeFileSync(`${IMG_FOLDER}index.ts`, `\
${jsons.map(({id}) => `import ${id} from './${id}.${IMG_EXTENSION}'`).join(';\n')}
export default {
	${jsons.map(({id}) => `'${id}': ${id}`).join(',\n\t')}
}`
	);
}

export default specsToImages;