import {Colors} from '@hhenrichsen/canvas-commons';
import {makeScene2D, Layout, Rect} from '@motion-canvas/2d';
import {
  createRef,
  createSignal,
  linear,
  Vector2,
  waitFor,
  waitUntil,
} from '@motion-canvas/core';
import {Logo} from '../components/Logo';
import {Page} from '../components/Page';
import {Body} from '../components/Body';

export default makeScene2D(function* (view) {
  view.fill(Colors.Catppuccin.Mocha.Crust);
  const page = createRef<Layout>();
  const logo = createRef<Logo>();
  yield view.add(<Page splattersRef={page} logoRef={logo} />);

  yield page().opacity(0, 3);
  yield* waitFor(1);
  yield logo().position([0, -100], 3);
  yield* waitFor(1);
  yield* logo().scale(1, 3);

  const containerRef = createRef<Layout>();

  const txtRef = createRef<Body>();
  const typerRef = createRef<Rect>();
  const padding = createSignal(0);

  view.add(
    <Layout ref={containerRef}>
      <Body
        ref={txtRef}
        fontSize={96}
        text={'Thanks for watching!'}
        textAlign={'center'}
        position={[0, 200]}
      />
      <Rect
        size={() => new Vector2(txtRef().fontSize()).mul([0.1, 1])}
        fill={Colors.Catppuccin.Mocha.Text}
        left={() =>
          txtRef()
            .right()
            .addX(txtRef().fontSize() * padding())
        }
        ref={typerRef}
        opacity={0}
      ></Rect>
    </Layout>,
  );

  const txtContents = txtRef().text();
  txtRef().text('');
  yield* typerRef().opacity(1, 0.5);
  yield padding(0.5, 1);
  yield* txtRef().text(txtContents, 1);
  yield* typerRef().opacity(0, 0.5);

  yield* waitUntil('out');
  yield logo().opacity(0, 2);
  yield view.fill('#000000', 2, linear);
  yield* containerRef().opacity(0, 2);
  yield* waitFor(0.5);
});
