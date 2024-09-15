import {Layout, LayoutProps} from '@motion-canvas/2d';
import chromaticAberration from './chromaticaberration.glsl';

export class ChromaticAberration extends Layout {
  public constructor(props: LayoutProps) {
    super({
      ...props,
    });
    this.shaders({
      fragment: chromaticAberration,
    });
  }
}
