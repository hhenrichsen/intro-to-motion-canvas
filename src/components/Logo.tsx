import {Colors} from '@hhenrichsen/canvas-commons';
import {Circle, Img, Layout, LayoutProps, Line, blur} from '@motion-canvas/2d';
import {
  Reference,
  SignalValue,
  createComputed,
  createRef,
  unwrap,
  waitFor,
} from '@motion-canvas/core';

export interface LogoProps extends LayoutProps {
  scale?: SignalValue<number>;
}

export class Logo extends Layout {
  private readonly maskRef: Reference<Line>;
  private readonly lowerRef: Reference<Img>;
  private readonly baseRef: Reference<Circle>;

  public constructor({scale = 1, ...props}: LogoProps) {
    super({
      ...props,
      scale: createComputed(() => unwrap(scale) * 2),
      cache: true,
    });

    this.maskRef = createRef();
    this.lowerRef = createRef();
    this.baseRef = createRef();

    this.add(
      <>
        <Circle
          ref={this.baseRef}
          fill={Colors.Catppuccin.Mocha.Surface0}
          size={300}
          shadowColor={'black'}
          shadowOffset={12}
          shadowBlur={25}
        ></Circle>
        <Layout cache scale={0.9}>
          <Layout>
            <Line
              ref={this.maskRef}
              position={[-100, -180]}
              points={[
                [0, 0],
                [100, 0],
                [100, 100],
                [200, 100],
                [200, 200],
                [0, 200],
              ]}
              closed
              radius={100}
              fill="white"
            ></Line>
            <Img
              src={'/HunterLogoUpperNoGlow.svg'}
              scale={0.8}
              position={[-32, -53]}
              compositeOperation={'source-in'}
            ></Img>
            <Layout cache compositeOperation={'overlay'} filters={[blur(10)]}>
              <Line
                points={this.maskRef().points}
                position={() => this.maskRef().position().add([-2, -5])}
                closed
                radius={100}
                fill="white"
              ></Line>
              <Img
                src={'/HunterLogoUpperNoGlow.svg'}
                position={[-32, -53]}
                scale={0.8}
                opacity={1}
                compositeOperation={'source-in'}
              ></Img>
            </Layout>
          </Layout>
          <Img
            ref={this.lowerRef}
            src={'/HunterLogoLower.svg'}
            position={[34, 53]}
          ></Img>
        </Layout>
      </>,
    );
  }

  public *animateIn(duration: number) {
    this.lowerRef().scale(50);
    this.maskRef().position(0);
    this.baseRef().size(0);
    yield this.lowerRef().scale(1, duration * 0.33);
    yield* waitFor(duration * 0.22);
    yield this.maskRef().position([-100, -180], duration * 0.77);
    yield* waitFor(duration * 0.55);
    yield* this.baseRef().size(300, duration * 0.11);
  }
}
