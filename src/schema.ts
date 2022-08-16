/* -------------------------------------------------- Encoding -------------------------------------------------- */
export type SelectMark = 'point' | 'line' | 'area' | 'bar' | 'rect' | 'text' | 'withinLink' | 'betweenLink' | 'rule';
export type SelectChannel = 'x' | 'xe' | 'y' | 'color' | 'size' | 'stroke' | 'strokeWidth' | 'row' | 'opacity';
export const SelectChannels: SelectChannel[] = ['x', 'xe', 'y', 'color', 'size', 'stroke', 'strokeWidth', 'row', 'opacity'];
export type ShortFieldType = 'G' | 'Q' | 'N' | 'V';
export type ChannelFieldMap = Partial<Record<SelectChannel, ShortFieldType>>;
type CheatSheetEncodingSchema = Partial<Record<SelectMark, ChannelFieldMap[]>>;
export const CHEATSHEET_MAP___ENCODING_BY_MARK: CheatSheetEncodingSchema = {
	rule : [
		{ x: 'G' },
		{ x: 'G', y: 'Q' },
		{ x: 'G', xe: 'G' },
		{ x: 'G', xe: 'G', y: 'Q' },
		{ x: 'G', xe: 'G', row: 'N' },
		{ x: 'G', xe: 'G', color: 'N', row: 'N' },
		{ x: 'G', xe: 'G', y: 'Q', color: 'N', row: 'N' }
	],
	withinLink : [
		{ x: 'G', xe: 'G' },
		{ x: 'G', xe: 'G', y: 'Q' },
		{ x: 'G', xe: 'G', stroke: 'N' },
		{ x: 'G', xe: 'G', stroke: 'Q' },
		{ x: 'G', xe: 'G', stroke: 'N', row: 'N' },
	],
	bar : [
		{ x: 'G', y: 'Q' },
		{ x: 'G', y: 'Q', size: 'V' },
		{ x: 'G', xe: 'G', y: 'Q' },
		{ x: 'G', xe: 'G', y: 'Q', color: 'N' },
		{ x: 'G', xe: 'G', y: 'Q', color: 'Q' },
		{ x: 'G', xe: 'G', y: 'Q', row: 'N' },
	],
	point : [
		{ x: 'G', y: 'Q' },
		{ x: 'G', y: 'Q', size: 'V' },
		{ x: 'G', xe: 'G', y: 'Q', size: 'V' },
		{ x: 'G', xe: 'G', y: 'Q', color: 'N', size: 'V' },
		{ x: 'G', xe: 'G', y: 'Q', color: 'Q', size: 'Q' },
		{ x: 'G', xe: 'G', y: 'Q', color: 'Q', size: 'Q', stroke: 'Q' },
	],
};