import {Latex, Layout, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {Page} from '../components/Page';
import {
  Colors,
  Glow,
  LinePlot,
  Plot,
  Scrollable,
} from '@hhenrichsen/canvas-commons';
import {Window} from '../components/Defaults';
import {
  all,
  chain,
  createRef,
  createSignal,
  loop,
  range,
  waitFor,
  waitUntil,
} from '@motion-canvas/core';
import {Scanlines} from '../components/Scanlines';
import {ChromaticAberration} from '../components/ChromaticAberration';

export default makeScene2D(function* (view) {
  view.fill(Colors.Catppuccin.Mocha.Crust);
  yield view.add(<Page />);

  const texWindow = createRef<Window>();
  const tex = createRef<Latex>();
  const texScrollable = createRef<Scrollable>();

  view.add(
    <Window
      title="LaTeX"
      icon={'file-icons:latex'}
      size={[500, 300]}
      position={[-200, 100]}
      ref={texWindow}
    >
      <Layout
        size="100%"
        ref={texScrollable}
        layout
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Glow amount={5} copyOpacity={0.5}>
          <ChromaticAberration>
            <Scanlines rowSize={0.1} reflectionOffset={5}>
              <Latex
                ref={tex}
                tex={'y {{=}} m {{x}} + b'}
                fill={Colors.Catppuccin.Mocha.Text}
              ></Latex>
            </Scanlines>
          </ChromaticAberration>
        </Glow>
      </Layout>
    </Window>,
  );
  yield* texWindow().open(view, 1);

  yield loop(() =>
    chain(
      waitFor(2),
      all(
        tex().tex('y {{=}} \\frac{1}{2} {{x}} + 3', 1),
        texScrollable().scale(1, 1),
      ),
      waitFor(2),
      all(
        tex().tex('{{x}} {{=}} \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', 1),
        texScrollable().scale(0.8, 1),
      ),
      waitFor(2),
      tex().tex(
        'f(x) {{=}} \\int_0^{\\pi} \\sin\\left(\\frac{x \\cdot \\pi}{4}\\right)',
        1,
      ),
      waitFor(2),
      tex().tex('f(x) {{=}} \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}', 1),
      waitFor(2),
      tex().tex('y {{=}} m {{x}} + b', 1),
      waitFor(2),
    ),
  );

  yield* waitFor(4);

  const graphingWindow = createRef<Window>();
  const plot = createRef<Plot>();
  const linePlot = createRef<LinePlot>();
  yield* waitUntil('graphing');

  view.add(
    <Window
      title="Graphing"
      icon={'material-symbols:ssid-chart'}
      size={[600, 650]}
      position={[400, -150]}
      ref={graphingWindow}
    >
      <Layout layout={false} y={25}>
        <Glow amount={5} copyOpacity={0.5}>
          <Scanlines rowSize={0.1} reflectionOffset={5}>
            <ChromaticAberration>
              <Plot
                size={500}
                min={[-Math.PI * 2, -2]}
                max={[Math.PI * 2, 2]}
                ticks={[4, 4]}
                labelFormatterX={x => `${Math.round(x / Math.PI)}π`}
                axisColorX={Colors.Catppuccin.Mocha.Text}
                axisColorY={Colors.Catppuccin.Mocha.Text}
                labelSize={0}
                ref={plot}
              >
                <LinePlot
                  size={500}
                  ref={linePlot}
                  stroke={'red'}
                  lineWidth={4}
                  end={0}
                  lineCap={'round'}
                ></LinePlot>
              </Plot>
            </ChromaticAberration>
          </Scanlines>
        </Glow>
      </Layout>
    </Window>,
  );

  linePlot().data(plot().makeGraphData(0.1, x => Math.sin(x)));
  yield* graphingWindow().open(view, 1);

  yield loop(() =>
    chain(
      linePlot().end(1, 2),
      waitFor(2),
      linePlot()
        .start(1, 2)
        .do(() => linePlot().end(0))
        .do(() => linePlot().start(0)),
      waitFor(2),
    ),
  );

  yield* waitUntil('sorting');
  const sortingWindow = createRef<Window>();
  const colors = [
    Colors.Catppuccin.Mocha.Red,
    Colors.Catppuccin.Mocha.Peach,
    Colors.Catppuccin.Mocha.Yellow,
    Colors.Catppuccin.Mocha.Green,
    Colors.Catppuccin.Mocha.Sky,
  ];
  const sortProgress = createSignal(0);
  const sort = createSignal([2, 3, 5, 1, 4]);
  const oldSort = createSignal([1, 2, 3, 4, 5]);

  view.add(
    <Window
      title="Sorting"
      size={[600, 300]}
      position={[-100, -200]}
      icon={'solar:sort-broken'}
      ref={sortingWindow}
    >
      <Glow amount={5} copyOpacity={0.5} layout={false} x={-200} y={-60}>
        <Scanlines rowSize={0.1} reflectionOffset={5}>
          <ChromaticAberration>
            <Layout>
              {() =>
                range(5).map(i => (
                  <Rect
                    layout
                    x={
                      sort().indexOf(i + 1) * 100 * (1 - sortProgress()) +
                      oldSort().indexOf(i + 1) * 100 * sortProgress()
                    }
                    y={100}
                    width={80}
                    height={80}
                    fill={colors[i]}
                    alignContent={'center'}
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    <Txt
                      text={String(i + 1)}
                      fill={Colors.Catppuccin.Mocha.Surface0}
                      fontWeight={600}
                    ></Txt>
                  </Rect>
                ))
              }
            </Layout>
          </ChromaticAberration>
        </Scanlines>
      </Glow>
    </Window>,
  );
  yield* sortingWindow().open(view, 1);

  yield loop(() =>
    chain(waitFor(2), sortProgress(1, 1), waitFor(2), sortProgress(0, 1)),
  );

  // code animation
  //

  // simulation

  yield* waitUntil('end of highlight reel');
  yield* all(
    sortingWindow().close(view, 1),
    graphingWindow().close(view, 1),
    texWindow().close(view, 1),
  );
});
