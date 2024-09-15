import {Circle, Layout, LayoutProps} from '@motion-canvas/2d';
import {
  PossibleColor,
  SignalValue,
  Vector2,
  remap,
  useRandom,
  useScene,
} from '@motion-canvas/core';

export function makeSplatterData(
  count: number,
  colors: SignalValue<PossibleColor>[],
  minSize: number = 5,
  maxSize: number = 20,
  seed: number,
): [Vector2, SignalValue<PossibleColor>, number][] {
  const r = useRandom(seed, true);
  return Array.from({length: count}, () => [
    new Vector2(r.nextFloat(0, 1), r.nextFloat(0, 1)),
    colors[r.nextInt(0, colors.length)],
    r.nextInt(minSize, maxSize),
  ]);
}

export function Splatters({
  splatters,
  ...props
}: {
  splatters: [Vector2, SignalValue<PossibleColor>, number][];
} & LayoutProps) {
  const s = useScene().getSize();
  return (
    <Layout {...props}>
      {splatters.map(([position, color, size]) => (
        <Circle
          position={[
            remap(0, 1, -s.x / 2, s.x / 2, position.x),
            remap(0, 1, -s.y / 2, s.y / 2, position.y),
          ]}
          fill={color}
          size={size}
        />
      ))}
    </Layout>
  );
}
