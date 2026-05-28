import type { HulebuCocosSceneModel } from "../contracts/HulebuSceneModel";
import type { HulebuLayoutSize } from "./HulebuSampleSceneModel";
import { getHulebuLevelConfigByIndex } from "../config/HulebuLevelConfig";
import { HulebuRuntimeState } from "../runtime/HulebuRuntimeState";

export interface HulebuConfiguredSceneBootstrap {
  sceneModel: HulebuCocosSceneModel;
  runtimeState: HulebuRuntimeState;
}

export function createHulebuConfiguredSceneModelForLayout(
  layout: HulebuLayoutSize,
  levelIndex = 0,
): HulebuConfiguredSceneBootstrap {
  const runtimeState = new HulebuRuntimeState(getHulebuLevelConfigByIndex(levelIndex));
  return {
    runtimeState,
    sceneModel: runtimeState.toSceneModel(layout),
  };
}
