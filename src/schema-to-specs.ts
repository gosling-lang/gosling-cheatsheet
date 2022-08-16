import { Mark, JsonData, SingleView, ChannelDeep, SingleTrack, FieldType } from 'gosling.js/dist/src/core/gosling.schema';
import { CHEATSHEET_MAP___ENCODING_BY_MARK, SelectChannel, SelectChannels, SelectMark, ShortFieldType } from './schema';
import { getUniqueFileNameFromChannelFieldMap } from './utils';
import { TRACK_RESOLUTION, TRACK_HEIGHT, TRACK_WIDTH, JSON_FOLDER } from './constants';
import fs from 'fs';

function getChannelTemplate(mark: SelectMark, c: SelectChannel, stype?: ShortFieldType) {
	// Missing, so use a default value
	if(stype === undefined) {
		switch(c) {
		case 'strokeWidth':
			return mark === 'rule' || mark === 'withinLink' ? { value: 8 } : undefined;
		default:
			return;
		}
	}
	// Mapped to a constant value
	if(stype === 'V') {
		switch(c) {
		case 'size':
			return mark === 'bar' || mark === 'point' ? { value: 12 } : undefined;
		default:
			return;
		}
	}

	// Mapped with a data field, so make this `ChannelDeep`
	const domain = [0, 100];
	const type = { G: 'genomic', Q: 'quantitative', N: 'nominal' }[stype] as FieldType;
	const template: ChannelDeep = { field: c + stype, type };
	if(type === 'genomic') {
		switch(c) {
		case 'x':
		case 'xe':
			return { ...template, axis: 'none' };
		}
	} else if(type === 'nominal') {
		switch(c) {
		case 'y':
		case 'size':
		case 'strokeWidth':
		case 'color':
		case 'stroke':
		case 'opacity':
			return { ...template };
		case 'row':
			return { ...template, legend: false, grid: true };
		}
	} else if(type === 'quantitative') {
		switch(c) {
		case 'y':
			return { ...template, domain, grid: true, axis: 'none' };
		case 'size':
			return { ...template, domain, range: [5, 20] };
		case 'strokeWidth':
		case 'color':
		case 'stroke':
		case 'opacity':
			return { ...template, domain };
		}
	}
}

function schemaToSpecs() {
	const specInfos: {id: string, spec: SingleView}[] = [];
	Object.entries(CHEATSHEET_MAP___ENCODING_BY_MARK).map(([mark, maps]) => {
		maps.forEach(map => {
			const id = getUniqueFileNameFromChannelFieldMap(mark as SelectMark, map);
			const jsonPath = `${JSON_FOLDER}${id}.json`;
			const values = getToyValues(mark as SelectMark);
			const data: JsonData = {
				type: 'json',
				values
			};
			const track: SingleTrack = {
				data,
				mark: mark as Mark,
				width: TRACK_WIDTH * TRACK_RESOLUTION,
				height: TRACK_HEIGHT * TRACK_RESOLUTION,
				style: { linkStyle: 'elliptical', dashed: [6, 6] }
			};
			SelectChannels.forEach(c => track[c as keyof ChannelDeep] = getChannelTemplate(mark as SelectMark, c, map[c]));
			const spec: SingleView = {
				xDomain: { interval: [1, 100] },
				tracks: [track]
			};
			fs.writeFileSync(jsonPath, JSON.stringify(spec));
			specInfos.push({ id, spec });
		});
	});
	return specInfos;
}

export default schemaToSpecs;

function getToyValues(mark: SelectMark) {
	switch(mark) {
	case 'rule':
	case 'withinLink':
		return [
			{ xG: 30, xeG: 40, yQ: 80, rowN: 'a', colorN: 'a', strokeN: 'a' , colorQ: 20, strokeQ: 10},
			{ xG: 60, xeG: 90, yQ: 10, rowN: 'b', colorN: 'b', strokeN: 'b', colorQ: 100, strokeQ: 80 }
		];
	case 'bar':
	case 'point':
	default:
		return [
			{ xG: 30, xeG: 40, yQ: 80, rowN: 'a', colorN: 'a', strokeN: 'a', colorQ: 20, strokeQ: 40, sizeQ: 80, strokeWidthQ: 40 },
			{ xG: 30, xeG: 40, yQ: 40, rowN: 'b', colorN: 'b', strokeN: 'b', colorQ: 20, strokeQ: 100, sizeQ: 40, strokeWidthQ: 100 },
			{ xG: 60, xeG: 90, yQ: 10, rowN: 'a', colorN: 'a', strokeN: 'a', colorQ: 10, strokeQ: 30, sizeQ: 10, strokeWidthQ: 30 },
			{ xG: 60, xeG: 90, yQ: 30, rowN: 'b', colorN: 'b', strokeN: 'b', colorQ: 30, strokeQ: 100, sizeQ: 30, strokeWidthQ: 100 }
		];
	}
}
