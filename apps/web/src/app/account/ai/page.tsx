import { requireUser } from "@/lib/auth/session";

export default async function AccountAiPage() {
  await requireUser();

  return (
    <main className="account-page">
      <section className="account-hero compact">
        <p className="account-eyebrow">AI Gateway</p>
        <h1>模型来源</h1>
        <p>统一管理平台额度、临时 Key、外部 Gateway BYOK 和后续本地连接器入口。</p>
      </section>
      <section className="account-grid">
        <div className="account-panel">
          <p className="account-eyebrow">Platform Pool</p>
          <h2>平台额度</h2>
          <p className="account-muted">由平台配置 provider，用户按权益使用。</p>
        </div>
        <div className="account-panel">
          <p className="account-eyebrow">Ephemeral Key</p>
          <h2>临时 Key</h2>
          <p className="account-muted">后续支持请求级输入，不入库、不写日志。</p>
        </div>
        <div className="account-panel">
          <p className="account-eyebrow">External Gateway</p>
          <h2>外部 BYOK</h2>
          <p className="account-muted">后续只保存外部 Gateway 引用，不直接保存用户 provider Key。</p>
        </div>
      </section>
    </main>
  );
}
