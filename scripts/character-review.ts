import fs from 'node:fs';
import {getSceneState} from '../src/story';
const frames=[73,74,75,76,77,78,79,80,81,143,197,201,274,330,450,478,491,542,587,623,711,739,899];
fs.writeFileSync('out/character-review-state.json',JSON.stringify(frames.map(frame=>({frame,...getSceneState(frame)}))));
