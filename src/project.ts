import './global.css';
import '../fonts/fonts.css';
import {makeProject} from '@motion-canvas/core';

import title from './scenes/00-title?scene';
import jsLibrary from './scenes/01-js-library?scene';
import nodeNpm from './scenes/02-node-npm?scene';
import generators from './scenes/05-generators?scene';
import newProject from './scenes/03-new-project?scene';
import fileStructure from './scenes/04-file-structure?scene';
import shapes from './scenes/06-shapes?scene';
import highlightReel from './scenes/07-highlight-reel?scene';
import thanks from './scenes/08-thanks?scene';

export default makeProject({
  scenes: [
    title,
    jsLibrary,
    nodeNpm,
    newProject,
    fileStructure,
    generators,
    shapes,
    highlightReel,
    thanks,
  ],
  experimentalFeatures: true,
});
