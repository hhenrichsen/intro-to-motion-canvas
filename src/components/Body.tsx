import {Colors} from '@hhenrichsen/canvas-commons';
import {Txt, TxtProps} from '@motion-canvas/2d';

export type Body = Txt;
export const Body = (props: TxtProps) => (
  <Txt
    fontFamily={'Montserrat, sans-serif'}
    fill={Colors.Catppuccin.Mocha.Text}
    fontSize={48}
    {...props}
  ></Txt>
);
