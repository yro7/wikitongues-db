/**
 * Static normalized Wikitongues dataset.
 */

import rawData from '../../data/processed/wikitongues_normalized.json';
import { VideoData } from './types';

export const dataset: VideoData[] = rawData as VideoData[];
export default dataset;
