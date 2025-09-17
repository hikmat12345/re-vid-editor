import { Composition } from "remotion";
import { Main } from "./main";
import { COMP_NAME, DURATION_IN_FRAMES, FPS } from "../constants";

/**
 * Root component for the Remotion project.
 * Sets up the composition and provides default props.
 */
export const RemotionRoot: React.FC = () => {
  const defaultMyCompProps: any = {
    overlays: [],
    durationInFrames: DURATION_IN_FRAMES,
    fps: FPS,
    width: 1920,
    height: 1920,
    src: "",
    setSelectedOverlayId: () => { },
    selectedOverlayId: null,
    changeOverlay: () => { },
  };

  return (
    <>
      <Composition
        id={COMP_NAME}
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1920}
        calculateMetadata={async ({ props }) => {
          return {
            durationInFrames: props.durationInFrames,
            width: props.width,
            height: props.height,
          };
        }}
        defaultProps={defaultMyCompProps}
      />
    </>
  );
};
