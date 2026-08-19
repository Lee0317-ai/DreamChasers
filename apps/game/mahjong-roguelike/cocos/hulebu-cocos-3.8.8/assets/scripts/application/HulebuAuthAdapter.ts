export type HulebuAuthMode = "wechat" | "guest";

export interface HulebuAuthSession {
  mode: HulebuAuthMode;
  subject: string;
  displayName: string;
  isPreview: boolean;
}

export interface HulebuAuthAdapter {
  signIn(mode: HulebuAuthMode): Promise<HulebuAuthSession>;
}

/**
 * Cocos Web 预览认证适配器。
 * 微信小游戏/小程序发布时在同一接口下替换为 wx.login + 服务端会话实现，
 * 客户端不保存 AppSecret 或 session_key。
 */
export class HulebuPreviewAuthAdapter implements HulebuAuthAdapter {
  signIn(mode: HulebuAuthMode): Promise<HulebuAuthSession> {
    return Promise.resolve({
      mode,
      subject: mode === "wechat" ? "preview-wechat-user" : "preview-guest-user",
      displayName: mode === "wechat" ? "微信试玩用户" : "游客",
      isPreview: true,
    });
  }
}
