import {Colors, Glow} from '@hhenrichsen/canvas-commons';
import {Icon, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitUntil} from '@motion-canvas/core';
import {Page} from '../components/Page';
import {Body} from '../components/Body';

export default makeScene2D(function* (view) {
  view.fill(Colors.Catppuccin.Mocha.Crust);
  yield view.add(<Page />);

  yield* waitUntil('node in');
  const nodejsLogoRef = createRef<Icon>();
  const npmRef = createRef<Icon>();
  const plusRef = createRef<Icon>();
  const linkRef = createRef<Txt>();

  yield view.add(
    <>
      <Icon
        ref={nodejsLogoRef}
        icon="mdi:nodejs"
        color={Colors.Catppuccin.Mocha.Green}
        position={[-(view.size().x / 2 + 400), 0]}
        size={300}
      ></Icon>
      <Glow amount={20}>
        <Icon
          ref={plusRef}
          icon="material-symbols:add"
          color={Colors.Catppuccin.Mocha.Text}
          size={0}
        ></Icon>
      </Glow>
      ,
      <Icon
        ref={npmRef}
        icon="mdi:npm"
        color={Colors.Catppuccin.Mocha.Red}
        position={[view.size().x / 2 + 400, 0]}
        size={300}
      ></Icon>
      <Body
        position={[0, 250]}
        textAlign={'center'}
        width={'100%'}
        ref={linkRef}
      >
        https://nodejs.org/en/download
      </Body>
      ,
    </>,
  );
  const t = linkRef().text();
  linkRef().text('');
  yield nodejsLogoRef().position([-400, 0], 2);
  yield plusRef().size(200, 1);
  yield* npmRef().position([400, 0], 2);

  yield* waitUntil('node download link');
  yield* linkRef().text(t, 1);

  yield* waitUntil('end node npm');

  yield linkRef().opacity(0, 2);
  yield nodejsLogoRef().position([-(view.size().x / 2 + 400), 0], 2);
  yield plusRef().size(0, 2);
  yield* npmRef().position([view.size().x / 2 + 400, 0], 2);
});
