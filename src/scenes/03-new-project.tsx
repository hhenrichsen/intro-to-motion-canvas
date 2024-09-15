import {Colors, Scrollable, WindowStyle} from '@hhenrichsen/canvas-commons';
import {Layout, makeScene2D} from '@motion-canvas/2d';
import {createRef, linear, waitFor, waitUntil} from '@motion-canvas/core';
import {Page} from '../components/Page';
import {Window, Terminal} from '../components/Defaults';

export default makeScene2D(function* (view) {
  view.fill(Colors.Catppuccin.Mocha.Crust);
  yield view.add(<Page />);

  yield* waitUntil('open terminal');
  const terminal = createRef<Terminal>();
  const terminalWindow = createRef<Window>();
  const scrollable = createRef<Scrollable>();
  yield view.add(
    <Window
      ref={terminalWindow}
      size={[1200, 800]}
      windowStyle={WindowStyle.Windows98}
      title={'Terminal'}
    >
      <Layout alignContent={'start'} justifyContent={'start'} size={''}>
        <Terminal
          ref={terminal}
          size={[1200, 730]}
          fontFamily={'IBM Plex Mono'}
        />
        ,
      </Layout>
    </Window>,
  );
  terminal().lineAppear({text: '❯ ', fill: Colors.Catppuccin.Mocha.Green});

  function wpmDuration(text: string): [string, number] {
    const cpm = 640;
    return [text, (text.length / cpm) * 60];
  }

  yield* terminalWindow().open(view, 1);
  yield* terminal().typeAfterLine(
    ...wpmDuration('npm init @motion-canvas@latest'),
    linear,
  );
  yield terminal().replaceLine([
    {text: '❯ ', fill: Colors.Catppuccin.Mocha.Green},
    {text: 'npm ', fill: Colors.Catppuccin.Mocha.Yellow},
    {text: 'init @motion-canvas@latest'},
  ]);
  yield* waitFor(1);
  terminal().lineAppear('');
  terminal().lineAppear('Need to install the following packages:');
  terminal().lineAppear('  @motion-canvas/create');
  terminal().lineAppear('Ok to proceed? (y)');
  yield* waitFor(1);
  yield* terminal().typeAfterLine(' y', 0.2, linear);
  terminal().lineAppear([
    {text: '? Project name '},
    {text: '» ', fill: Colors.Catppuccin.Mocha.Surface2},
  ]);
  yield* waitFor(1);
  yield* terminal().typeAfterLine(...wpmDuration('my-animation'), linear);
  yield* waitFor(1);
  terminal().replaceLine([
    {text: '√', fill: Colors.Catppuccin.Mocha.Green},
    {text: ' Project name '},
    {text: '...', fill: Colors.Catppuccin.Mocha.Surface2},
    {text: ' my-animation'},
  ]);
  terminal().lineAppear([
    {text: '? Project path '},
    {text: '» ', fill: Colors.Catppuccin.Mocha.Surface2},
  ]);
  yield* waitFor(1);
  yield* terminal().typeAfterLine(...wpmDuration('my-animation'), linear);
  yield* waitFor(1);
  terminal().replaceLine([
    {text: '√', fill: Colors.Catppuccin.Mocha.Green},
    {text: ' Project path '},
    {text: '...', fill: Colors.Catppuccin.Mocha.Surface2},
    {text: ' my-animation'},
  ]);
  terminal().lineAppear('? Language');
  terminal().appearAfterLine({
    text: ' » - Use arrow-keys. Return to submit.',
    fill: Colors.Catppuccin.Mocha.Surface2,
  });
  terminal().lineAppear({
    text: '>   TypeScript (Recommended)',
    fill: Colors.Catppuccin.Mocha.Sky,
  });
  terminal().lineAppear('    JavaScript');
  yield* waitFor(3);

  terminal().deleteLine();
  terminal().deleteLine();
  terminal().replaceLine([
    {text: '√', fill: Colors.Catppuccin.Mocha.Green},
    {text: ' Language '},
    {text: '...', fill: Colors.Catppuccin.Mocha.Surface2},
    {text: ' TypeScript (Recommended)'},
  ]);
  terminal().lineAppear('');

  terminal().lineAppear({
    text: '√ Scaffolding complete. You can now run:',
    fill: Colors.Catppuccin.Mocha.Green,
  });
  terminal().lineAppear({
    text: '    cd my-animation',
  });
  terminal().lineAppear({
    text: '    npm install',
  });
  terminal().lineAppear({
    text: '    npm start',
  });

  terminal().lineAppear('');
  terminal().lineAppear({text: '❯ ', fill: Colors.Catppuccin.Mocha.Green});

  yield* waitFor(2);
  yield* terminalWindow().close(view, 1);
});
