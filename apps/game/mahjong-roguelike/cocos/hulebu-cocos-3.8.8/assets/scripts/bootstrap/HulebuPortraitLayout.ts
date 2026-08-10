export interface HulebuPortraitLayoutInput {
  width: number;
  height: number;
  cssHeight: number;
  scale: number;
}

export interface HulebuPortraitZones {
  topPlaqueY: number;
  progressDotY: number;
  slotY: number;
  reserveY: number;
  comboY: number;
  riverY: number;
  meldY: number;
  tableTop: number;
  tableBottom: number;
}

function scaled(value: number, scale: number): number {
  return Math.round(value * scale);
}

/** Fixed portrait bands, measured from the bottom of the Cocos UI canvas. */
export function resolveHulebuPortraitZones(layout: HulebuPortraitLayoutInput): HulebuPortraitZones {
  const scale = layout.scale;
  const slotY = scaled(Math.max(64, layout.cssHeight * 0.07), scale);
  const reserveY = slotY + scaled(62, scale);
  const comboY = slotY + scaled(130, scale);
  const riverY = comboY + scaled(62, scale);
  const meldY = riverY + scaled(62, scale);
  const topPlaqueY = layout.height - scaled(58, scale);

  return {
    topPlaqueY,
    progressDotY: topPlaqueY - scaled(30, scale),
    slotY,
    reserveY,
    comboY,
    riverY,
    meldY,
    tableTop: scaled(108, scale),
    tableBottom: comboY + scaled(42, scale),
  };
}
