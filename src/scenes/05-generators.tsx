import {CODE, Code, Layout, makeScene2D, Txt} from '@motion-canvas/2d';
import {Page} from '../components/Page';
import {Colors, Glow, Scrollable} from '@hhenrichsen/canvas-commons';
import {
  createRef,
  DEFAULT,
  easeInCubic,
  easeOutCubic,
  waitFor,
  waitUntil,
} from '@motion-canvas/core';
import {JavaScript, Window} from '../components/Defaults';
import {Scanlines} from '../components/Scanlines';
import {ChromaticAberration} from '../components/ChromaticAberration';

function* makeNumbers(top: number) {
  let i = 0;
  while (i < top) {
    yield i++;
  }
}

function* groupedNumbers() {
  let i = 0;
  while (true) {
    yield* makeNumbers(i++);
  }
}

export default makeScene2D(function* (view) {
  view.fill(Colors.Catppuccin.Mocha.Crust);
  yield view.add(<Page />);

  yield* waitFor(1);
  const window = createRef<Window>();
  const code = createRef<Code>();
  const output = createRef<Txt>();
  const outputWindow = createRef<Window>();
  yield view.add(
    <>
      <Window title={'Generators'} size={[1200, 800]} ref={window}>
        <Glow amount={5} copyOpacity={0.5}>
          <Scanlines>
            <ChromaticAberration>
              <Layout
                direction={'column'}
                alignItems={'start'}
                size={() => window().size().addY(-80)}
                layout
                padding={20}
              >
                <JavaScript
                  ref={code}
                  size={[1200, 730]}
                  fontSize={64}
                ></JavaScript>
              </Layout>
            </ChromaticAberration>
          </Scanlines>
        </Glow>
      </Window>
      <Window
        title="Output"
        size={[900, 280]}
        position={[250, 350]}
        ref={outputWindow}
        opacity={0}
      >
        <Scrollable activeOpacity={0} inactiveOpacity={0} size={'100%'}>
          <Glow amount={5} copyOpacity={0.5}>
            <Scanlines rowSize={0.075}>
              <ChromaticAberration>
                <Txt
                  ref={output}
                  fontSize={32}
                  fontFamily={code().fontFamily}
                  fill={Colors.Catppuccin.Mocha.Text}
                ></Txt>
              </ChromaticAberration>
            </Scanlines>
          </Glow>
        </Scrollable>
      </Window>
    </>,
  );

  function* swapWindows(duration: number = 2) {
    const p = outputWindow().position();
    yield* outputWindow().position(p.addY(250), duration / 4);
    outputWindow().moveAbove(window());
    yield* outputWindow().position(p, duration / 4);
    yield* waitFor(duration / 2);
  }

  function* resetOutput(duration: number = 1) {
    yield* output().opacity(0, 1);
    output().text('');
    output().opacity(1);
    const p = outputWindow().position();
    yield* outputWindow().position(p.addY(250), duration / 2, easeInCubic);
    outputWindow().moveBelow(window());
    yield* outputWindow().position(p, duration / 2, easeOutCubic);
  }

  yield* window().open(view, 1);
  yield* code().code(
    `\
  function* makeNumbers() {
      yield 0;
      yield 1;
      yield 2;
  }
  `,
    1,
  );
  // Functions return a generator. Generators are special kinds of functions
  // that can pause and resume their execution. They're created by adding an
  // asterisk (*) after the function keyword.
  yield* code().selection(
    [...code().findAllRanges('yield'), code().findFirstRange('function\\*')],
    1,
  );
  // Yield pauses execution and returns a value to the caller. When the
  // generator is resumed, it continues from where it left off.
  yield* waitUntil('iterate makeNumbers');
  yield* code().selection(DEFAULT, 1);

  yield code().fontSize(56, 2);
  yield* code().code.append(
    `
  const numbers = makeNumbers();
  console.log(numbers.next());
  console.log(numbers.next());
  console.log(numbers.next());
  `,
    2,
  );

  yield* waitFor(2);
  yield* waitUntil('output generator');
  outputWindow().opacity(1);
  outputWindow().moveAbove(window());
  yield* outputWindow().open(view, 1);
  yield* output().text('Object { value: 0, done: false }', 1);
  yield* output().text(
    output().text() + '\n' + 'Object { value: 1, done: false }',
    1,
  );
  yield* output().text(
    output().text() + '\n' + 'Object { value: 2, done: true }',
    1,
  );
  yield* waitUntil('loop makeNumbers');

  yield* resetOutput();
  yield code().fontSize(64, 2);
  // Yield also works in loops and other control flow. Any time yield is hit,
  // the generator pauses. We can use the closure property of functions to
  // keep state between calls.
  yield* code().code(
    `\
  function* makeNumbers() {
      let i = 0;
      while (true) {
          yield i++;
      }
  }
  `,
    2,
  );

  yield* waitUntil('iterate makeNumbers loop');

  yield code().fontSize(52, 2);
  yield* code().code.append(
    `
  const numbers = makeNumbers();
  console.log(numbers.next());
  console.log(numbers.next());
  console.log(numbers.next());
  `,
    2,
  );

  yield* waitUntil('output loop');
  yield* swapWindows();
  yield* output().text('Object { value: 0, done: false }', 1);
  yield* output().text(
    output().text() + '\n' + 'Object { value: 1, done: false }',
    1,
  );
  yield* output().text(
    output().text() + '\n' + 'Object { value: 2, done: false }',
    1,
  );
  yield* output().text(output().text() + '\n' + '...', 1);

  yield* waitUntil('intro groupedNumbers');
  yield* resetOutput();
  yield code().fontSize(44, 2);
  // Yield star is a special kind of yield that can yield the values of another
  // generator, fully consuming it, if possible. This is useful for creating
  // generators that yield the values of other generators.
  yield* code().code(
    `\
  function* makeNumbers(top: number) {
      let i = 0;
      while (i < top) {
          yield i++;
      }
  }

  function* groupedNumbers() {
      let i = 0;
      while (true) {
          yield* makeNumbers(i++);
      }
  }`,
    2,
  );

  yield* waitUntil('highlight yieldstar');
  yield* code().selection(code().findFirstRange('yield\\*'), 1);
  yield* waitUntil('iterate groupedNumbers');
  yield* code().selection(
    [
      [0, 0],
      [Infinity, Infinity],
    ],
    1,
  );
  yield code().fontSize(32, 2);
  yield* code().code.append(
    CODE`\

  const numbers = groupedNumbers();
  for (let i = 0; i < 21; i++) {
      console.log(numbers.next());
  }
  `,
    2,
  );

  yield* waitUntil('output yieldstar');
  yield* swapWindows();
  const numbers = groupedNumbers();
  for (let i = 0; i < 21; i++) {
    output().text(
      `i = ${i}; Object ${JSON.stringify(numbers.next()).replace(/"/g, '').replace(/,/, ', ').replace(/{/, '{ ').replace(/}/, ' }').replace(/:/g, ': ')}`,
    );
    yield* waitFor(0.5);
  }

  // yield* waitUntil('intro spread');
  // yield* resetOutput();

  // yield code().fontSize(44, 2);
  // yield* code().code(
  //   `\
  // function* makeNumbers(top: number) {
  //     let i = 0;
  //     while (i < top) {
  //         yield i++;
  //     }
  // }

  // function* groupedNumbers() {
  //     let i = 0;
  //     while (true) {
  //         yield [...makeNumbers(i++)];
  //     }
  // }
  //   `,
  //   2,
  // );
  // yield* waitUntil('highlight spread');
  // yield* code().selection(code().findFirstRange('\\[\\.\\.\\..*\\]'), 1);

  // yield* waitUntil('iterate arrays');
  // yield* code().selection(DEFAULT, 1);
  // yield code().fontSize(32, 2);
  // yield* code().code.append(
  //   `\

  // const numbers = groupedNumbers();
  // for (let i = 0; i < 6; i++) {
  //     console.log(numbers.next().value);
  // }
  // `,
  //   2,
  // );

  // yield* waitUntil('output spread');
  // yield* swapWindows();
  // for (let i = 0; i < 6; i++) {
  //   output().text(`i = ${i}; Array [${[...makeNumbers(i)].join(', ')}]`);
  //   yield* waitFor(1);
  // }

  yield* waitUntil('yield yield');
  yield resetOutput();
  yield code().fontSize(44, 2);
  yield* code().code(
    `\
  function* makeNumbers(top: number) {
      let i = 0;
      while (i < top) {
          yield i++;
      }
  }

  function* groupedNumbers() {
      let i = 0;
      while (true) {
          yield makeNumbers(i++);
      }
  }
    `,
    2,
  );
  // I can just as easily leave the generator as-is and yield it for the
  // consumer to handle.
  yield* code().selection(
    code().findFirstRange('yield makeNumbers\\(i\\+\\+\\);'),
    1,
  );
  yield* waitUntil('consume yield yield');
  yield* code().selection(DEFAULT, 1);
  yield code().fontSize(32, 2);
  yield* code().code.append(
    `\

  const numbers = groupedNumbers()
  for (let i = 0; i < 5; i++) {
      console.log([...numbers.next().value]);
  }
  `,
    2,
  );

  yield* waitUntil('output yield yield');
  yield* swapWindows();
  for (let i = 0; i < 6; i++) {
    output().text(`i = ${i}; Array [${[...makeNumbers(i)].join(', ')}]`);
    yield* waitFor(1);
  }

  yield* waitUntil('end generators');
  yield* waitFor(2);
  yield outputWindow().close(view, 1);
  yield* waitFor(0.5);
  yield* window().close(view, 1);
});
