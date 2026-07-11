import type { HulebuCocosSceneModel } from "../contracts/HulebuSceneModel";
import type { HulebuLayoutSize } from "./HulebuSampleSceneModel";
import { createHulebuRuntimeLevelForRun, HULEBU_MAINLINE_RUN_PROFILE, type HulebuRunProfile } from "../config/HulebuLevelConfig";
import {
  HulebuRuntimeState,
  type HulebuLevelModifierState,
  type HulebuMetaUpgradeState,
  type HulebuRunArchetypeState,
  type HulebuRunRewardState,
} from "../runtime/HulebuRuntimeState";

export interface HulebuConfiguredSceneBootstrap {
  sceneModel: HulebuCocosSceneModel;
  runtimeState: HulebuRuntimeState;
}

export function createHulebuConfiguredSceneModelForLayout(
  layout: HulebuLayoutSize,
  levelIndex = 0,
  runRewards?: HulebuRunRewardState,
  levelModifiers?: HulebuLevelModifierState,
  metaUpgrades?: HulebuMetaUpgradeState,
  runArchetype?: HulebuRunArchetypeState,
  runProfile: HulebuRunProfile = HULEBU_MAINLINE_RUN_PROFILE,
  displayOrder?: number,
): HulebuConfiguredSceneBootstrap {
  const runtimeState = new HulebuRuntimeState(
    createHulebuRuntimeLevelForRun(levelIndex, runProfile, displayOrder),
    runRewards,
    levelModifiers,
    metaUpgrades,
    runArchetype,
  );
  return {
    runtimeState,
    sceneModel: runtimeState.toSceneModel(layout),
  };
}
