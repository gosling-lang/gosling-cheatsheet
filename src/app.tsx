import React from 'react';
import { getUniqueFileNameFromChannelFieldMap } from './utils';
import { CHEATSHEET_MAP___ENCODING_BY_MARK, SelectMark } from './schema';
import { TRACK_HEIGHT, TRACK_WIDTH } from './constants';
import images from './images';

function App() {
	return (
		<div className='p-[10px]'>
			<h1 className='font-bold text-xl'>Encoding</h1>
			{Object.entries(CHEATSHEET_MAP___ENCODING_BY_MARK).map(([mark, maps]) => {
				return (
					<>
						<h1 className='mb-[5px]'><code>{`mark:= ${mark}`}</code></h1>
						<div className='flex flex-wrap gap-6 mb-[40px]'>
							{maps.map(map => {
								const id = getUniqueFileNameFromChannelFieldMap(mark as SelectMark, map);
								return (
									<div key={id} className='flex flex-nowrap gap-2'>
										<img className={`border-[#000] border-[0.5px] w-[${TRACK_WIDTH}px] h-[${TRACK_HEIGHT}px]`} src={images[id]}/>
										<textarea className={`text-xs p-[5px] bg-[#DCDCDC] resize-none w-[${TRACK_WIDTH}px]`}>
											{Object.entries(map).map(([channel, type]) => `${channel}:= ${type}`).join('\n')}
										</textarea>
									</div>
								);
							})}
						</div>
					</>
				);
			})}
		</div>
	);
}

export default App;