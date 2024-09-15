import {makeScene2D} from '@motion-canvas/2d';
import {Page} from '../components/Page';
import {Colors} from '@hhenrichsen/canvas-commons';

export default makeScene2D(function* (view) {
  view.fill(Colors.Catppuccin.Mocha.Crust);
  yield view.add(<Page />);
});
