'use client';

import { useEffect, useMemo, useState } from 'react';

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

type LoginPayload = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

declare global {
  interface Window {
    onTelegramAuth?: (user: LoginPayload) => void;
  }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'profile' | 'market'>('profile');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [market, setMarket] = useState<MarketItem[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);

  const botUsername = useMemo(() => process.env.NEXT_PUBLIC_BOT_USERNAME ?? '', []);

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

  useEffect(() => {
    if (profile?.user || !botUsername) {
      return;
    }

    const container = document.getElementById('telegram-login');
    if (!container || container.childElementCount > 0) {
      return;
    }

    window.onTelegramAuth = async (user: LoginPayload) => {
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          setAuthError('Не удалось авторизоваться через Telegram.');
          return;
        }

        const profileResponse = await fetch('/api/profile', { credentials: 'include' });
        const profileData = (await profileResponse.json()) as ProfileData;
        setProfile(profileData);
      } catch {
        setAuthError('Ошибка сети при авторизации.');
      }
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.dataset.telegramLogin = botUsername;
    script.dataset.size = 'large';
    script.dataset.userpic = 'false';
    script.dataset.onauth = 'onTelegramAuth(user)';
    script.dataset.requestAccess = 'write';
    container.appendChild(script);

    return () => {
      window.onTelegramAuth = undefined;
    };
  }, [botUsername, profile?.user]);

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

      {!profile?.user && (
        <section className="section">
          <h2>Вход через Telegram</h2>
          {botUsername ? (
            <>
              <p>Используйте официальный Telegram Login Widget для авторизации.</p>
              <div id="telegram-login" />
              {authError && <p className="empty">{authError}</p>}
            </>
          ) : (
            <p className="empty">Укажите NEXT_PUBLIC_BOT_USERNAME в переменных окружения.</p>
          )}
        </section>
      )}

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
