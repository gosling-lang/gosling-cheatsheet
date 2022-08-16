import { SelectMark, ChannelFieldMap } from './schema';

/**
 * Generates an unique ID for this example (e.g., 'rule_xG_xeG_rowN')
 */
export function getUniqueFileNameFromChannelFieldMap(mark: SelectMark, map: ChannelFieldMap) {
	return `${mark}_${Object.keys(map).map(k => `${k}${map[k]}`).join('_')}`;
}