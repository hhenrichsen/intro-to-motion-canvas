import {Layout, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {
  createRef,
  useScene,
  Vector2,
  waitFor,
  waitUntil,
} from '@motion-canvas/core';
import {Logo} from '../components/Logo';
import {
  Colors,
  Column,
  Glow,
  MotionCanvasLogo,
  Row,
} from '@hhenrichsen/canvas-commons';
import {Page} from '../components/Page';
import {Body} from '../components/Body';

export default makeScene2D(function* (view) {
  const splattersRef = createRef<Layout>();
  yield* view.fill(Colors.Catppuccin.Mocha.Crust, 2);
  yield view.add(<Page includeLogo={false} splattersRef={splattersRef} />);
  yield splattersRef().opacity(1, 2);

  const logoRef = createRef<Logo>();

  view.add(<Logo ref={logoRef} scale={0.8}></Logo>);

  yield* logoRef().animateIn(2);
  yield* logoRef().x(-500, 1);

  const txtRef = createRef<Txt>();
  const typerRef = createRef<Rect>();
  const letsTalkAboutRef = createRef<Layout>();

  yield* waitUntil('start intro');

  view.add(
    <Layout ref={letsTalkAboutRef}>
      <Body
        ref={txtRef}
        fontSize={96}
        text={"Let's Talk About"}
        textAlign={'left'}
        position={() => [txtRef().width() * 0.5 - 100, -100]}
      />
      <Rect
        size={() => new Vector2(txtRef().fontSize()).mul([0.1, 1])}
        fill={Colors.Catppuccin.Mocha.Text}
        left={() =>
          txtRef()
            .right()
            .addX(txtRef().fontSize() * 0.5)
        }
        ref={typerRef}
        opacity={0}
      ></Rect>
    </Layout>,
  );

  const txtContents = txtRef().text();
  txtRef().text('');
  yield* typerRef().opacity(1, 0.5);
  yield* txtRef().text(txtContents, 1);

  const subjectRef = createRef<Layout>();
  const mcLogo = createRef<MotionCanvasLogo>();
  const glowRef = createRef<Glow>();

  view.add(
    <Glow ref={glowRef} amount={0}>
      <Row
        gap={30}
        ref={subjectRef}
        alignItems={'center'}
        opacity={0}
        scale={1.2}
      >
        <MotionCanvasLogo scale={0.5} ref={mcLogo} />
        <Txt
          fontFamily={'JetBrains Mono'}
          text={'Motion Canvas'}
          fill={Colors.Catppuccin.Mocha.Text}
          fontSize={64}
        ></Txt>
      </Row>
    </Glow>,
  );
  subjectRef().position(() => [
    subjectRef().width() * subjectRef().scale().x * 0.5 - 100,
    100,
  ]);
  yield mcLogo().animate();
  yield* subjectRef().opacity(1, 1);
  yield* waitFor(1);

  yield subjectRef().opacity(0, 2);
  yield letsTalkAboutRef().opacity(0, 2);
  yield logoRef().scale(0.5, 2);
  yield* logoRef().position(useScene().getSize().mul([-0.45, 0.4]), 2);

  const partRef = createRef<Layout>();
  const spacer = createRef<Rect>();

  view.add(
    <Column ref={partRef} alignItems={'center'} gap={20} opacity={0}>
      <Body fontSize={96}>Part 1</Body>
      <Rect
        width={0}
        height={5}
        ref={spacer}
        fill={Colors.Catppuccin.Mocha.Text}
      />
      <Body>Installing, Adding Shapes, and Animating</Body>
    </Column>,
  );

  yield partRef().opacity(1, 1);
  yield waitFor(0.5);
  yield* spacer().width('100%', 1);
  yield* waitUntil('end intro');
  yield spacer().width(0, 1);
  yield* waitFor(0.5);
  yield* partRef().opacity(0, 1);
});
