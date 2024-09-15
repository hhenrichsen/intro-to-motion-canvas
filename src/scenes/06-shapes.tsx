import {Circle, CODE, Layout, makeScene2D, Rect} from '@motion-canvas/2d';
import {Page} from '../components/Page';
import {
  CodeLineNumbers,
  Colors,
  Glow,
  Scrollable,
} from '@hhenrichsen/canvas-commons';
import {JavaScript, Window} from '../components/Defaults';
import {Scanlines} from '../components/Scanlines';
import {
  cancel,
  createRef,
  createSignal,
  loop,
  waitFor,
  waitUntil,
} from '@motion-canvas/core';
import {ChromaticAberration} from '../components/ChromaticAberration';

export default makeScene2D(function* (view) {
  view.fill(Colors.Catppuccin.Mocha.Crust);
  yield view.add(<Page />);

  // So, we've spent a long time talking about generators. What do they mean in
  // the context of motion canvas? Let's go back to that example file.

  const window = createRef<Window>();
  const previewWindow = createRef<Window>();
  const code = createRef<JavaScript>();
  const title = createSignal('example.tsx');
  const preview = createRef<Layout>();
  const circle = createRef<Circle>();

  view.add(
    <>
      <Window
        ref={window}
        size={[900, 900]}
        x={-300}
        title={title}
        icon={'tabler:brand-typescript'}
      >
        <Glow amount={5} copyOpacity={0.5}>
          <Scanlines>
            <ChromaticAberration>
              <Layout
                direction={'column'}
                layout
                size={() => window().size().addY(-80)}
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
      </Window>
      ,
      <Window
        ref={previewWindow}
        size={[600, 900]}
        x={475}
        title={'Preview'}
        icon="material-symbols:preview-outline"
      >
        <Scrollable size={'100%'} inactiveOpacity={0}>
          <Glow amount={5} copyOpacity={0.5}>
            <Scanlines rowSize={0.5}>
              <ChromaticAberration>
                <Layout ref={preview}></Layout>
              </ChromaticAberration>
            </Scanlines>
          </Glow>
        </Scrollable>
      </Window>
      ,
    </>,
  );

  const scl = createSignal(1);
  code().code(CODE`\
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

  preview().add(
    <Circle size={320} fill={'lightseagreen'} ref={circle} scale={scl} />,
  );
  const scaler = yield loop(() => scl(1.5, 2).to(0.75, 2));

  yield window().open(view, 1);
  yield* previewWindow().open(view, 1);

  // There are a couple parts to look for here. First, the spot where we add the
  // shape, right here.

  yield* waitUntil('add shape');
  yield* code().selection(
    [
      [8, 0],
      [13, 0],
    ],
    1,
  );

  // We also create a reference to the shape, which we can use to access it later.
  // This is a little bit of a quirk of JSX, which is the HTML-like syntax we're using.

  yield* waitUntil('createRef');
  yield* code().selection(
    code().findFirstRange(/const circle = createRef<Circle>/gm),
    1,
  );

  // Next, we animate it by scaling the circle up and down.

  yield* waitUntil('scale circle');
  yield* code().selection(
    code().findFirstRange(/yield\* circle\(\).scale\(2, 2\).to\(1, 2\)/gm),
    1,
  );

  // The magic numbers in the scale function are the scale factor and the duration
  // in that order. In this case, we first scale the circle up to twice its size
  // over 2 seconds, then back down to its original size over another 2 seconds.

  yield* waitUntil('durations');
  yield* code().selection(code().findFirstRange(/scale\(2, 2\)/gm), 1);
  yield* waitUntil('scale back');
  yield* code().selection(code().findFirstRange(/to\(1, 2\)/gm), 1);

  yield* waitUntil('shape types');
  yield* code().selection(
    [
      [0, 0],
      [Infinity, Infinity],
    ],
    1,
  );

  yield* code().code(
    CODE`\
import {Rect, makeScene2D} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();

  view.add(<Rect 
    ref={rect} 
    size={320} 
    fill={'lightseagreen'} 
  />);

  yield* rect().scale(2, 2).to(1, 2);
});
  `,
    1,
  );

  preview().removeChildren();
  yield* waitFor(0.5);

  const rect = createRef<Rect>();
  preview().add(
    <Rect size={320} fill={'lightseagreen'} ref={rect} scale={scl} />,
  );
  yield* waitUntil('star vs none');

  // Now, notice that nothing's animating anymore, and we only have one frame
  // in the animation. This is because if we return a generator from our scene,
  // motion canvas will run it without waiting to fully consume it.
  yield* code().code(
    CODE`\
import {Rect, makeScene2D} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();

  view.add(<Rect 
    ref={rect} 
    size={320} 
    fill={'lightseagreen'} 
  />);

  yield rect().scale(2, 2).to(1, 2);
});
  `,
    1,
  );

  cancel(scaler);
  preview().removeChildren();
  yield* waitFor(0.5);
  preview().add(
    <Rect size={320} fill={'lightseagreen'} ref={rect} scale={scl} />,
  );

  // This is probably clearer with an example where we have something else
  // going on. Here's one where we just wait for 2 seconds, where we get halfway
  // through the animation before we run out of frames that we wait for.
  yield* waitUntil('no star wait');
  yield* code().code(
    CODE`\
import {Rect, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();

  view.add(<Rect 
    ref={rect} 
    size={320} 
    fill={'lightseagreen'} 
  />);

  yield rect().scale(2, 2).to(1, 2);
  yield* waitFor(2);
});
  `,
    1,
  );
  preview().removeChildren();
  yield* waitFor(0.5);
  preview().add(
    <Rect size={320} fill={'lightseagreen'} ref={rect} scale={scl} />,
  );
  const cutLoop = yield loop(() => scl(1.5, 2).to(0.75, 0));
  yield* waitFor(2);

  // Here's another example. We'll wait 2 seconds, then animate the radius of the
  // rectangle to make it a circle, then back to a square. Notice how the scale
  // adjustment makes it all the way to the end, now, and then holds until the
  // animation loops.
  yield* waitUntil('doing multiple things at once');
  yield* code().code(
    CODE`\
import {Rect, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();

  view.add(<Rect 
    ref={rect} 
    size={320} 
    fill={'lightseagreen'} 
  />);

  yield rect().scale(2, 2).to(1, 2);
  yield* waitFor(2);
  yield* rect().radius(160, 2).to(0, 2);
});
  `,
    1,
  );

  preview().removeChildren();
  yield* waitFor(0.5);
  preview().add(
    <Rect size={320} fill={'lightseagreen'} ref={rect} scale={scl} />,
  );
  cancel(cutLoop);
  const scaleLoop = yield loop(() => scl(1.5, 2).to(0.75, 2).wait(2));
  const radiusLoop = yield loop(() => rect().radius(0, 2).to(160, 2).to(0, 2));
  yield* waitFor(6);

  yield* waitUntil('moving shapes around');
  yield* code().code(
    CODE`\
import {Rect, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();

  view.add(<Rect 
    ref={rect} 
    size={320} 
    fill={'lightseagreen'} 
  />);

  yield* rect().x(200, 2);
  yield* rect().x(-200, 4);
  yield* rect().x(0, 2);
});
  `,
    1,
  );
  cancel(scaleLoop);
  cancel(radiusLoop);
  preview().removeChildren();
  yield* waitFor(0.5);
  preview().add(<Rect size={320} fill={'lightseagreen'} ref={rect} />);

  const moveLoop = yield loop(() => rect().x(200, 2).to(-200, 4).back(2));
  yield* waitFor(8);

  // You can also add other shapes to the scene. They will be drawn in the order
  // that they're added, which means that the last shape added will be on top.
  yield* waitUntil('multiple shapes');

  yield* code().code(
    CODE`\
import {Rect, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();
  const circle = createRef<Circle>();

  view.add(<Rect 
    ref={rect} 
    size={320} 
    fill={'lightseagreen'}
  />);

  view.add(<Circle 
    ref={circle} 
    size={160} 
    position={160}
    fill={'white'}
  />);
}
  `,
    1,
  );

  cancel(moveLoop);
  preview().removeChildren();
  yield* waitFor(0.5);

  preview().add(<Rect size={320} fill={'lightseagreen'} ref={rect} />);
  preview().add(
    <Circle size={160} fill={'white'} position={160} ref={circle} />,
  );
  yield* waitFor(2);

  // If you want to have them in a different order, you can give them a zIndex
  // property, which will be used to sort them before they're drawn.

  yield* waitUntil('zIndex');
  yield* code().code(
    CODE`\
import {Rect, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();
  const circle = createRef<Circle>();

  view.add(<Rect 
    ref={rect} 
    size={320} 
    fill={'lightseagreen'}
    zIndex={1}
  />);

  view.add(<Circle 
    ref={circle} 
    size={160} 
    position={160}
    fill={'white'}
    zIndex={0}
  />);
}
  `,
    1,
  );

  preview().opacity(0);
  circle().zIndex(0);
  rect().zIndex(1);
  yield* waitFor(0.5);
  preview().opacity(1);
  yield* waitFor(2);

  // You can also consolidate multiple view.adds into a single fragment.

  yield* waitUntil('fragment');
  yield* code().code(
    CODE`\
import {Rect, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();
  const circle = createRef<Circle>();

  view.add(
    <>
      <Rect 
        ref={rect} 
        size={320} 
        fill={'lightseagreen'}
        zIndex={1}
      />
      <Circle 
        ref={circle} 
        size={160} 
        position={160}
        fill={'white'}
        zIndex={0}
      />
    </>
  );
}
  `,
    1,
  );
  preview().opacity(0);
  yield* waitFor(0.5);
  preview().opacity(1);
  yield* waitFor(2);

  // However, if shapes are contained within another shape, they will always be
  // drawn after their parent shape, regardless of their zIndex. So generally,
  // zIndex is only useful for shapes that are siblings.
  yield* waitUntil('child shapes');

  yield* code().code(
    CODE`\
import {Rect, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();
  const circle = createRef<Circle>();

  view.add(<Rect 
    ref={rect} 
    size={320} 
    fill={'lightseagreen'}
    zIndex={1}  
  >
    <Circle 
      ref={circle} 
      size={160} 
      position={160}
      fill={'white'}
      zIndex={0}
    />
  </Rect>);
}
  `,
    1,
  );

  preview().opacity(0);
  circle().reparent(rect());
  yield* waitFor(0.5);
  preview().opacity(1);

  yield* waitUntil('end shapes');
  cancel(moveLoop);
  yield previewWindow().close(view, 1);
  yield* window().close(view, 1);
});
