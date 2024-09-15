import {
  CatppuccinMochaHighlightStyle,
  Colors,
  Glow,
  Terminal as CommonsTerminal,
  TerminalProps,
  Window as CommonsWindow,
  WindowStyle,
} from '@hhenrichsen/canvas-commons';
import {Code, LezerHighlighter, withDefaults} from '@motion-canvas/2d';
import {Scanlines} from './Scanlines';
import {parser as javascript} from '@lezer/javascript';
import {parser as jsonParser} from '@lezer/json';
import {useScene} from '@motion-canvas/core';
import {ChromaticAberration} from './ChromaticAberration';

export type Window = CommonsWindow;
export const Window = withDefaults(CommonsWindow, {
  windowStyle: WindowStyle.Windows98,
  titleProps: {
    fontFamily: 'Greycliff CF, sans-serif',
    fontWeight: 700,
    fill: Colors.Catppuccin.Mocha.Text,
  },
  bodyColor: Colors.Catppuccin.Mocha.Mantle,
  fill: Colors.Catppuccin.Mocha.Mantle,
  buttonColors: [
    Colors.Catppuccin.Mocha.Overlay2,
    Colors.Catppuccin.Mocha.Overlay2,
    Colors.Catppuccin.Mocha.Overlay2,
  ],
  buttonDarkColor: Colors.Catppuccin.Mocha.Crust,
  buttonLightColor: Colors.Catppuccin.Mocha.Text,
  stroke: Colors.Catppuccin.Mocha.Text,
});

export type Terminal = CommonsTerminal;
export const Terminal = (props: TerminalProps) => {
  return (
    <Glow amount={3} copyOpacity={0.3}>
      <Scanlines
        rowSize={
          0.5 * Math.max(1, useScene().getRealSize().x / useScene().getSize().x)
        }
      >
        <ChromaticAberration>
          <CommonsTerminal
            padding={20}
            defaultTxtProps={{
              fontFamily: 'Ellograph CF, monospace',
              fontSize: 32,
            }}
            {...props}
          />
        </ChromaticAberration>
      </Scanlines>
    </Glow>
  );
};

export type JavaScript = Code;
export const JavaScript = withDefaults(Code, {
  highlighter: new LezerHighlighter(
    javascript.configure({
      dialect: 'typescript jsx',
    }),
    CatppuccinMochaHighlightStyle,
  ),
  fontFamily: 'Ellograph CF, monospace',
  fontSize: 48,
});

export const JsonCode = withDefaults(Code, {
  highlighter: new LezerHighlighter(jsonParser, CatppuccinMochaHighlightStyle),
  fontFamily: 'Ellograph CF, monospace',
  fontSize: 48,
});
