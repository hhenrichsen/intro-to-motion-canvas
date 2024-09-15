import {Reference, useScene} from '@motion-canvas/core';
import {Splatters, makeSplatterData} from './Splatter';
import {Logo} from './Logo';
import {Colors} from '@hhenrichsen/canvas-commons';
import {Layout} from '@motion-canvas/2d';

const splatterData = makeSplatterData(
  100,
  [Colors.Catppuccin.Mocha.Crust, Colors.Catppuccin.Mocha.Mantle],
  5,
  20,
  1267451672,
);

export const Page = ({
  includeLogo = true,
  logoRef,
  splattersRef,
}: {
  includeLogo?: boolean;
  logoRef?: Reference<Logo>;
  splattersRef?: Reference<Layout>;
}) => {
  return (
    <>
      <Splatters splatters={splatterData} ref={splattersRef} />
      {includeLogo ? (
        <Logo
          ref={logoRef}
          scale={0.25}
          position={useScene().getSize().mul([-0.45, 0.4])}
        ></Logo>
      ) : null}
    </>
  );
};
