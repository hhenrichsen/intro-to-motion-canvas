import {Code, Layout, LezerHighlighter, makeScene2D} from '@motion-canvas/2d';
import {Page} from '../components/Page';
import {
  CatppuccinMochaHighlightStyle,
  CodeLineNumbers,
  Colors,
  FileTree,
  FileType,
  Glow,
  Scrollable,
} from '@hhenrichsen/canvas-commons';
import {createRef, createSignal, waitFor, waitUntil} from '@motion-canvas/core';
import {JavaScript, Window} from '../components/Defaults';
import {Scanlines} from '../components/Scanlines';
import {parser as jsonParser} from '@lezer/json';
import {parser as javascriptParser} from '@lezer/javascript';
import {ChromaticAberration} from '../components/ChromaticAberration';

export default makeScene2D(function* (view) {
  view.fill(Colors.Catppuccin.Mocha.Crust);
  yield view.add(<Page />);

  const foldersWindow = createRef<Window>();
  const contentWindow = createRef<Window>();
  const files = createRef<FileTree>();
  const code = createRef<Code>();
  const contentTitle = createSignal('');
  const scrollable = createRef<Scrollable>();

  yield view.add(
    <>
      <Window
        ref={foldersWindow}
        title={'File Explorer'}
        size={[500, 700]}
        x={-500}
        y={-100}
      >
        <Glow amount={3} copyOpacity={0.3}>
          <Scanlines reflectionOffset={0}>
            <ChromaticAberration>
              <Layout
                layout
                size={() => foldersWindow().size().addY(-80)}
                direction={'column'}
                alignItems={'start'}
              >
                <FileTree
                  width={500}
                  rowSize={44}
                  ref={files}
                  padding={20}
                  labelColor={Colors.Catppuccin.Mocha.Text}
                  folderColor={Colors.Catppuccin.Mocha.Peach}
                  fileColor={Colors.Catppuccin.Mocha.Green}
                  assetColor={Colors.Catppuccin.Mocha.Yellow}
                  structure={{
                    name: 'my-animation',
                    type: FileType.Folder,
                    children: [
                      {
                        name: 'public',
                        type: FileType.Folder,
                      },
                      {
                        name: 'src',
                        type: FileType.Folder,
                        children: [
                          {
                            name: 'scenes',
                            type: FileType.Folder,
                            children: [
                              {
                                id: 'example.tsx',
                                name: 'example.tsx',
                                type: FileType.File,
                              },
                              {
                                id: 'example.meta',
                                name: 'example.meta',
                                type: FileType.File,
                              },
                            ],
                          },
                          {
                            name: 'motion-canvas.d.ts',
                            type: FileType.File,
                          },
                          {
                            id: 'project.ts',
                            name: 'project.ts',
                            type: FileType.File,
                          },
                          {
                            id: 'project.meta',
                            name: 'project.meta',
                            type: FileType.File,
                          },
                        ],
                      },
                      {
                        name: 'tsconfig.json',
                        type: FileType.File,
                      },
                      {
                        name: 'package.json',
                        type: FileType.File,
                      },
                      {
                        id: 'vite.config.ts',
                        name: 'vite.config.ts',
                        type: FileType.File,
                      },
                    ],
                  }}
                />
              </Layout>
            </ChromaticAberration>
          </Scanlines>
        </Glow>
      </Window>
      ,
      <Window
        ref={contentWindow}
        size={[1000, 900]}
        x={300}
        title={contentTitle}
      >
        <Scrollable
          ref={scrollable}
          size={[1000, 850]}
          activeOpacity={0}
          inactiveOpacity={0}
        >
          <Glow amount={5} copyOpacity={0.5}>
            <Scanlines>
              <ChromaticAberration>
                <Layout
                  direction={'column'}
                  layout
                  size={() => contentWindow().size().addY(-80)}
                  padding={20}
                >
                  <Layout layout direction={'row'} gap={20}>
                    <CodeLineNumbers
                      code={code}
                      numberProps={{
                        fill: Colors.Catppuccin.Mocha.Overlay2,
                      }}
                    ></CodeLineNumbers>
                    <JavaScript ref={code} fontSize={24}></JavaScript>
                  </Layout>
                </Layout>
              </ChromaticAberration>
            </Scanlines>
          </Glow>
        </Scrollable>
      </Window>
    </>,
  );

  yield contentWindow().open(view, 1);
  yield* foldersWindow().open(view, 1);

  yield* waitUntil('intro example');
  yield files().emphasize('example.tsx', 1);
  yield* waitFor(0.5);
  contentTitle('src/scenes/example.tsx');
  code().code(`\
import {Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Create your animations here

  const circle = createRef<Circle>();

  view.add(<Circle 
    ref={circle} 
    size={320} 
    fill={'lightseagreen'} 
  />);

  yield* circle().scale(2, 2).to(1, 2);
});`);

  yield* waitFor(2);
  yield* waitUntil('intro meta');
  yield files().reset('example.tsx', 1);
  yield files().emphasize('example.meta', 1);
  yield* waitFor(0.5);
  code().highlighter(
    new LezerHighlighter(jsonParser, CatppuccinMochaHighlightStyle),
  );
  code().code(`\
{
    "version": 0,
}`);
  contentTitle('src/scenes/example.meta');

  yield* waitFor(2);
  yield* waitUntil('intro project');
  yield files().reset('example.meta', 1);
  yield files().emphasize('project.ts', 1);
  yield* waitFor(0.5);
  code().code(`\
import {makeProject} from '@motion-canvas/core';

import example from './scenes/example?scene';

export default makeProject({
  scenes: [example],
});`);
  code().highlighter(
    new LezerHighlighter(
      javascriptParser.configure({
        dialect: 'typescript jsx',
      }),
      CatppuccinMochaHighlightStyle,
    ),
  );
  contentTitle('src/project.ts');

  yield* waitFor(2);
  yield* waitUntil('intro vite config');
  yield files().reset('project.ts', 1);
  yield files().emphasize('vite.config.ts', 1);
  yield* waitFor(0.5);
  code().code(`\
import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';

export default defineConfig({
  plugins: [motionCanvas()],
});`);
  contentTitle('vite.config.ts');

  yield* waitFor(2);
  yield* waitUntil('transition example');
  yield files().reset('vite.config.ts', 1);
  yield* waitFor(0.5);
  yield* files().emphasize('example.tsx', 1);
  contentTitle('src/scenes/example.tsx');
  code().code(`\
import {Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Create your animations here

  const circle = createRef<Circle>();

  view.add(<Circle 
    ref={circle} 
    size={320} 
    fill={'lightseagreen'} 
  />);

  yield* circle().scale(2, 2).to(1, 2);
});`);

  yield* waitUntil('transition yield');
  yield code().selection(code().findFirstRange('yield\\*'), 1);
  yield* waitFor(0.5);
  yield scrollable().scrollOffset([-370, 25], 2);
  yield* scrollable().zoom(5, 2);
  yield* waitFor(2);

  yield* waitUntil('file structure out');
  yield foldersWindow().close(view, 1);
  yield* waitFor(0.5);
  yield* contentWindow().close(view, 1);
});
