'use client';

import { useEffect, useState } from 'react';

type UserGift = {
  id: string;
  gift_name: string;
  preview_url: string | null;
  acquired_at: string;
};

type MarketItem = {
  id: string;
  gift_name: string;
  price_stars: number;
  allow_upgrade: boolean;
  allow_auction: boolean;
  preview_url: string | null;
};

type ProfileData = {
  user: {
    telegram_id: number;
    username: string | null;
    avatar_url: string | null;
    balance_stars: number;
  } | null;
  gifts: UserGift[];
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'profile' | 'market'>('profile');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [market, setMarket] = useState<MarketItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const profileResponse = await fetch('/api/profile', { credentials: 'include' });
      const profileData = (await profileResponse.json()) as ProfileData;
      setProfile(profileData);

      const marketResponse = await fetch('/api/market/list');
      const marketData = (await marketResponse.json()) as MarketItem[];
      setMarket(marketData);
    };

    load().catch(() => undefined);
  }, []);

  return (
    <main>
      <header className="header">
        <div>
          <h1>Gift Market</h1>
          <p>Покупай и улучшай подарки с реальными моделями Telegram.</p>
        </div>
        <div className="user-card">
          {profile?.user?.avatar_url ? (
            <img className="avatar" src={profile.user.avatar_url} alt="avatar" />
          ) : (
            <div className="avatar" />
          )}
          <div className="balance">
            <span>{profile?.user?.username ?? 'Ваш профиль'}</span>
            <strong>{profile?.user?.balance_stars ?? 0} ⭐</strong>
          </div>
        </div>
      </header>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
          type="button"
        >
          Профиль
        </button>
        <button
          className={`tab-button ${activeTab === 'market' ? 'active' : ''}`}
          onClick={() => setActiveTab('market')}
          type="button"
        >
          Маркет
        </button>
      </div>

      {activeTab === 'profile' ? (
        <section className="section">
          <h2>Мои подарки</h2>
          {profile?.gifts?.length ? (
            <div className="grid">
              {profile.gifts.map((gift) => (
                <div key={gift.id} className="card">
                  {gift.preview_url ? <img src={gift.preview_url} alt={gift.gift_name} /> : <div className="empty">Нет превью</div>}
                  <div>
                    <strong>{gift.gift_name}</strong>
                    <div className="badges">
                      <span className="badge">Получено {new Date(gift.acquired_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">У вас пока нет подарков.</div>
          )}
        </section>
      ) : (
        <section className="section">
          <h2>Маркет подарков</h2>
          {market.length ? (
            <div className="grid">
              {market.map((item) => (
                <div key={item.id} className="card">
                  {item.preview_url ? <img src={item.preview_url} alt={item.gift_name} /> : <div className="empty">Нет превью</div>}
                  <div>
                    <strong>{item.gift_name}</strong>
                    <div className="badges">
                      <span className="badge">{item.price_stars} ⭐</span>
                      {item.allow_upgrade && <span className="badge">Улучшение</span>}
                      {item.allow_auction && <span className="badge">Аукцион</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">Пока нет активных подарков.</div>
          )}
        </section>
      )}
    </main>
  );
}
