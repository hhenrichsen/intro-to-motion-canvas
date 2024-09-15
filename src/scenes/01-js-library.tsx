import {Colors, Glow, MotionCanvasLogo} from '@hhenrichsen/canvas-commons';
import {Icon, makeScene2D} from '@motion-canvas/2d';
import {
  cancel,
  chain,
  createRef,
  loop,
  waitFor,
  waitUntil,
} from '@motion-canvas/core';
import {Page} from '../components/Page';
import {Logo} from '../components/Logo';

export default makeScene2D(function* (view) {
  view.fill(Colors.Catppuccin.Mocha.Crust);
  const logoRef = createRef<Logo>();
  yield view.add(<Page logoRef={logoRef} />);

  yield* waitUntil('js library');
  const mcLogoRef = createRef<MotionCanvasLogo>();
  const heartRef = createRef<Icon>();
  const jsRef = createRef<Icon>();
  const glowRef = createRef<Glow>();
  yield view.add(
    <>
      <MotionCanvasLogo
        position={[-(view.size().x / 2 + 400), 0]}
        ref={mcLogoRef}
      />
      <Glow amount={20} ref={glowRef}>
        <Icon
          ref={heartRef}
          icon="material-symbols:favorite"
          color={Colors.Catppuccin.Mocha.Red}
          size={0}
        ></Icon>
      </Glow>
      ,
      <Icon
        ref={jsRef}
        icon="mdi:language-javascript"
        color={Colors.Catppuccin.Mocha.Yellow}
        position={[view.size().x / 2 + 400, 0]}
        size={300}
      ></Icon>
      ,
    </>,
  );
  yield mcLogoRef().animate();

  yield mcLogoRef().position([-400, 0], 2);
  yield heartRef().size(250, 1);
  yield* jsRef().position([400, 0], 2);

  const t = yield loop(() =>
    chain(
      heartRef()
        .size(280, 0.1)
        .back(0.1)
        .wait(0.2)
        .to(280, 0.1)
        .back(0.1)
        .wait(1),
    ),
  );
  yield* waitFor(1);
  yield* waitUntil('end js library');
  cancel(t);

  yield mcLogoRef().position([-(view.size().x / 2 + 400), 0], 2);
  yield heartRef().size(0, 1);
  yield* jsRef().position([view.size().x / 2 + 400, 0], 2);
});
