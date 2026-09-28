import React from 'react';
import {Composition} from 'remotion';
import {Video,ArtFrame,ArtworkSheet} from './Video';
export const Root=()=> <><Composition id="KK-Codex-30s" component={Video} width={1920} height={1080} fps={30} durationInFrames={900}/><Composition id="Artwork" component={ArtFrame} width={360} height={640} fps={30} durationInFrames={1}/><Composition id="ArtworkSheet" component={ArtworkSheet} width={1600} height={900} fps={30} durationInFrames={1}/></>;
