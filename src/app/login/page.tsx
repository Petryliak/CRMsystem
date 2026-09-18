"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, BarChart2, Package, Users, ArrowLeft, KeyRound, Zap, Shield, Headset, Menu, X, Phone, Send, Headphones } from "lucide-react";

export default function LoginPage() {
  const [step, setStep] = useState<"pricing" | "auth" | "reset" | "update_password">("pricing");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  
  const [selectedPlan, setSelectedPlan] = useState("Пробний період");
  
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setStep("update_password");
      }
    });
    return () => { authListener.subscription.unsubscribe(); };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const checkEmail = email.toLowerCase().trim();

      if (isLogin) {
        // ВХІД СПІВРОБІТНИКА
        const { data: empData } = await supabase.from("employees").select("*").eq("email", checkEmail).eq("password", password).single();
        if (empData) {
          await supabase.auth.signOut();
          localStorage.setItem("employee_session", JSON.stringify(empData));
          router.push("/");
          return;
        }

        // ВХІД ВЛАСНИКА
        const { data, error } = await supabase.auth.signInWithPassword({ email: checkEmail, password });
        if (error) {
          alert("Помилка: Невірний логін або пароль.");
          setLoading(false);
          return;
        }
        localStorage.removeItem("employee_session");
        router.push("/");

      } else {
        // РЕЄСТРАЦІЯ
        const { data: existingUsers } = await supabase.from("crm_users").select("id").eq("email", checkEmail);
        if (existingUsers && existingUsers.length > 0) {
          alert("Акаунт з такою поштою вже існує! Будь ласка, натисніть 'Увійти'.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({ email: checkEmail, password });
        if (error) {
          alert("Помилка реєстрації. Можливо, пароль надто простий (мінімум 6 символів).");
          setLoading(false); return;
        }
        
        if (data.user) {
          await supabase.from("crm_users").upsert([{
            id: data.user.id,
            email: checkEmail,
            plan: selectedPlan
          }]);
        }
        
        alert("Реєстрація успішна! Тепер ви можете увійти в кабінет.");
        setIsLogin(true);
      }
    } catch (error: any) {
      alert("Помилка: Перевірте правильність даних.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { alert("Введіть email!"); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login',
    });
    setLoading(false);
    if (error) { 
      alert("Системне повідомлення: Після того, як ви підключите свій справжній домен, функція відновлення пароля запрацює автоматично (зараз Supabase блокує листи для локальних адрес)."); 
    } else {
      alert("Посилання для відновлення пароля надіслано на вашу пошту!");
      setStep("auth");
      setIsLogin(true);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) { alert("Пароль має містити мінімум 6 символів!"); return; }
    
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    
    if (error) { alert("Помилка: " + error.message); } 
    else {
      alert("Пароль успішно змінено! Тепер ви можете увійти з новим паролем.");
      setStep("auth");
      setIsLogin(true);
      setPassword("");
    }
  };

  const selectPlanAndProceed = (planName: string) => {
    setSelectedPlan(planName);
    setStep("auth");
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  // ЄДИНИЙ КОМПОНЕНТ АВТОРИЗАЦІЇ
  const authFormsJsx = (
    <div className="auth-container-wrapper">
      {step === "auth" && (
        <div className="auth-container">
          <button onClick={() => setStep("pricing")} className="auth-back"><ArrowLeft size={16}/> До вибору тарифу</button>
          <h2 className="auth-title">{isLogin ? "З поверненням!" : "Створити акаунт"}</h2>
          <p className="auth-subtitle">{isLogin ? "Увійдіть, щоб керувати своїм бізнесом." : "Зареєструйтесь для доступу до системи."}</p>
          
          <form onSubmit={handleAuth}>
            <div className="input-group">
              <label className="input-label">Email адреса</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="name@company.com" />
            </div>
            <div className="input-group" style={{ marginBottom: "8px" }}>
              <label className="input-label">Пароль</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
            </div>
            
            {isLogin && (
              <div className="forgot-password">
                <button type="button" onClick={() => setStep("reset")}>Забули пароль?</button>
              </div>
            )}

            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? "Зачекайте..." : isLogin ? "Увійти в кабінет" : "Зареєструватись"} <ArrowRight size={18} />
            </button>
          </form>
          <div className="auth-switch">
            {isLogin ? "Ще немає акаунту?" : "Вже маєте акаунт?"}
            <button type="button" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Створити зараз" : "Увійти"}</button>
          </div>
        </div>
      )}

      {step === "reset" && (
        <div className="auth-container">
          <button onClick={() => setStep("auth")} className="auth-back"><ArrowLeft size={16}/> Назад до входу</button>
          <h2 className="auth-title">Відновлення пароля</h2>
          <p className="auth-subtitle">Введіть свою пошту, і ми надішлемо вам посилання для створення нового пароля.</p>
          <form onSubmit={handleResetPassword}>
            <div className="input-group">
              <label className="input-label">Email адреса</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="name@company.com" />
            </div>
            <button type="submit" disabled={loading} className="auth-btn" style={{ marginTop: "16px" }}>
              {loading ? "Зачекайте..." : "Надіслати посилання"}
            </button>
          </form>
        </div>
      )}

      {step === "update_password" && (
        <div className="auth-container">
          <div style={{ width: "48px", height: "48px", backgroundColor: "#D1FAE5", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", margin: "0 auto 20px auto" }}>
            <KeyRound size={24} />
          </div>
          <h2 className="auth-title" style={{ textAlign: "center" }}>Новий пароль</h2>
          <p className="auth-subtitle" style={{ textAlign: "center" }}>Придумайте новий надійний пароль для вашого акаунту.</p>
          <form onSubmit={handleUpdatePassword}>
            <div className="input-group">
              <label className="input-label">Новий пароль</label>
              <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" placeholder="Мінімум 6 символів" minLength={6} />
            </div>
            <button type="submit" disabled={loading} className="auth-btn" style={{ marginTop: "16px" }}>
              {loading ? "Зачекайте..." : "Зберегти пароль"} <Check size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <div className="login-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        .login-wrapper { display: flex; min-height: 100vh; font-family: 'Inter', system-ui, sans-serif; background-color: #F8FAFC; color: #0F172A; overflow-x: hidden; position: relative; }
        
        /* =========================================
           ВІДЖЕТ ПІДТРИМКИ (3D Дизайн)
           ========================================= */
        .support-widget { position: fixed; bottom: 24px; right: 24px; z-index: 9999; }
        .support-menu { position: absolute; bottom: 85px; right: 0; background: #FFFFFF; padding: 12px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); display: flex; flex-direction: column; gap: 8px; min-width: 240px; border: 1px solid #E2E8F0; opacity: 0; pointer-events: none; transform: translateY(10px); transition: all 0.2s; }
        .support-menu.open { opacity: 1; pointer-events: auto; transform: translateY(0); }
        .support-link { text-decoration: none; display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 14px; transition: all 0.2s; }
        .support-link.phone { background: #F8FAFC; color: #0F172A; }
        .support-link.phone:hover { background: #F1F5F9; }
        .support-link.tg { background: #F0FDF4; color: #047857; }
        .support-link.tg:hover { background: #D1FAE5; }
        
        /* 3D Кнопка */
        .support-btn { 
          width: 68px; 
          height: 68px; 
          border-radius: 50%; 
          background: radial-gradient(circle at 30% 30%, #34D399 0%, #059669 50%, #064E3B 100%); 
          color: #FFF; 
          border: none; 
          box-shadow: 0 12px 24px rgba(5, 150, 105, 0.4), inset 0 -4px 8px rgba(0,0,0,0.2), inset 0 4px 8px rgba(255,255,255,0.4); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          cursor: pointer; 
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); 
        }
        .support-btn:hover { transform: scale(1.08); box-shadow: 0 16px 32px rgba(5, 150, 105, 0.5), inset 0 -4px 8px rgba(0,0,0,0.2), inset 0 4px 8px rgba(255,255,255,0.5); }
        .s-icon { width: 32px; height: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); }

        /* =========================================
           DESKTOP STYLES (ВИПРАВЛЕНО ВИСОТУ І СКРОЛ)
           ========================================= */
        .desktop-pricing-view { display: flex; width: 100%; height: 100vh; overflow: hidden; }
        .left-panel { flex: 0 0 42%; position: relative; z-index: 20; display: flex; flex-direction: column; height: 100%; }
        
        /* ТЕМНО-ЗЕЛЕНИЙ ФОН ІЗ СІТКОЮ */
        .left-bg-wrapper { 
          position: absolute; inset: 0; 
          background-color: #011810; 
          background-image: linear-gradient(rgba(52, 211, 153, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(52, 211, 153, 0.05) 1px, transparent 1px);
          background-size: 32px 32px;
          overflow: hidden; z-index: 1; 
        }
        .bg-glow { 
          position: absolute; top: -30%; left: -30%; width: 160%; height: 160%; 
          background: radial-gradient(circle at 40% 40%, rgba(16,185,129,0.12) 0%, transparent 65%); 
          pointer-events: none; 
        }
        
        /* ТЕКСТ ПОСУНУТО ВЛІВО */
        .left-content { position: relative; z-index: 30; padding: 40px 30px; color: #FFFFFF; flex: 1; display: flex; flex-direction: column; justify-content: flex-start; }
        .brand-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .brand-icon { width: 36px; height: 36px; background: rgba(255,255,255,0.1); backdrop-filter: blur(4px); border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.2); }
        
        .hero-title { font-size: 42px; font-weight: 900; line-height: 1.1; margin-bottom: 16px; color: #FFFFFF; letter-spacing: -1px; max-width: 380px; }
        .hero-title span { color: #10B981; }
        
        .hero-subtitle { font-size: 14px; color: rgba(209,250,229,0.7); line-height: 1.6; margin-bottom: 32px; max-width: 260px; font-weight: 500; }
        
        .features-list { max-width: 260px; background: rgba(1, 24, 16, 0.6); backdrop-filter: blur(8px); padding: 20px; border-radius: 16px; border: 1px solid rgba(52, 211, 153, 0.1); }
        .feature-item { display: flex; gap: 12px; margin-bottom: 12px; }
        .feature-item:last-child { margin-bottom: 0; }
        .feature-icon-wrapper { background: rgba(16,185,129,0.2); padding: 8px; border-radius: 10px; height: max-content; }
        .feature-title { font-weight: 700; font-size: 13px; margin-bottom: 4px; color: #FFFFFF; }
        .feature-desc { font-size: 11px; color: rgba(209,250,229,0.75); line-height: 1.3; margin: 0; padding-left: 14px; }
        .feature-desc li { margin-bottom: 2px; }
        .footer-text { margin-top: auto; font-size: 10px; color: rgba(209,250,229,0.5); font-weight: 600; letter-spacing: 1px; padding-bottom: 20px; z-index: 50; position: relative; }
        
        /* КАРТИНКА: ЮВЕЛІРНО ПОСУНУТА ВЛІВО */
        .hero-image { position: absolute; top: 25%; right: -26%; width: 112%; max-width: 800px; z-index: 40; object-fit: contain; pointer-events: none; filter: drop-shadow(-10px 20px 30px rgba(0,0,0,0.4)); }
        
        /* ПРАВА ПАНЕЛЬ: Внутрішній скрол */
        .right-panel { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 20px 40px; background: #FFFFFF; z-index: 10; height: 100%; overflow-y: auto; }
        .right-content { width: 100%; max-width: 900px; margin: 0 auto; }
        
        .pricing-header { margin-bottom: 24px; text-align: left; }
        .badge { background: #D1FAE5; color: #065F46; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; margin-bottom: 10px; }
        .pricing-title { font-size: 32px; font-weight: 800; margin-bottom: 8px; color: #0F172A; letter-spacing: -0.5px; }
        .pricing-title span { color: #059669; }
        .pricing-subtitle { color: #64748B; font-size: 13px; max-width: 500px; line-height: 1.4; }
        .pricing-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; align-items: stretch; }
        .pricing-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; padding: 20px; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
        .pricing-card:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.04); }
        .card-badge { font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 6px; display: inline-block; margin-bottom: 12px; width: max-content; }
        .card-title { font-size: 18px; font-weight: 800; margin-bottom: 4px; }
        .card-desc { font-size: 12px; color: #64748B; margin-bottom: 16px; line-height: 1.3; }
        .card-price-box { margin-bottom: 20px; }
        .card-price { font-size: 36px; font-weight: 800; letter-spacing: -1px; }
        .card-period { font-size: 13px; color: #64748B; font-weight: 600; }
        .card-features { flex: 1; display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
        .card-feature-item { display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: #475569; font-weight: 500; line-height: 1.3; }
        .btn-outline { border: 2px solid #059669; color: #059669; background: transparent; padding: 12px; border-radius: 12px; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.2s; text-align: center; }
        .btn-outline:hover { background: #ECFDF5; }
        .btn-light { border: 1px solid #E2E8F0; color: #334155; background: #F8FAFC; padding: 12px; border-radius: 12px; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.2s; text-align: center; }
        .btn-light:hover { background: #F1F5F9; border-color: #CBD5E1; }
        .pro-card { background: #064E3B; color: #FFFFFF; border: none; box-shadow: 0 10px 30px rgba(6,78,59,0.15); position: relative; transform: scale(1.04); z-index: 10; }
        .pro-card .card-desc, .pro-card .card-period { color: rgba(209,250,229,0.8); }
        .pro-card .card-feature-item { color: rgba(255,255,255,0.9); }
        .popular-tag { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #10B981; color: #FFF; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 20px; letter-spacing: 0.5px; white-space: nowrap; box-shadow: 0 4px 10px rgba(16,185,129,0.3); }
        .btn-solid { background: #10B981; color: #FFFFFF; border: none; padding: 12px; border-radius: 12px; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(16,185,129,0.2); text-align: center; }
        .btn-solid:hover { background: #059669; }

        /* AUTH FORMS STYLES */
        .auth-container-wrapper { width: 100%; display: flex; justify-content: center; align-items: center; height: 100%; }
        .auth-container { max-width: 380px; width: 100%; margin: 0 auto; }
        .auth-back { display: flex; align-items: center; gap: 6px; color: #64748B; font-size: 13px; font-weight: 700; cursor: pointer; border: none; background: transparent; margin-bottom: 24px; transition: color 0.2s; }
        .auth-back:hover { color: #0F172A; }
        .auth-title { font-size: 28px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.5px; color: #0F172A; }
        .auth-subtitle { color: #64748B; font-size: 14px; margin-bottom: 24px; line-height: 1.5; }
        
        .input-group { margin-bottom: 16px; }
        .input-label { display: block; font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 6px; }
        .input-field { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #E2E8F0; background: #F8FAFC; font-size: 14px; outline: none; transition: all 0.2s; font-family: 'Inter', sans-serif; font-weight: 500; color: #0F172A; }
        .input-field:focus { background: #FFFFFF; border-color: #10B981; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
        .auth-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: #064E3B; color: #FFFFFF; border: none; padding: 14px; border-radius: 12px; font-weight: 800; font-size: 15px; cursor: pointer; margin-top: 16px; transition: all 0.2s; }
        .auth-btn:hover { background: #047857; }
        .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        
        .auth-switch { text-align: center; margin-top: 24px; font-size: 14px; color: #64748B; font-weight: 500; }
        .auth-switch button { color: #10B981; font-weight: 800; border: none; background: transparent; cursor: pointer; margin-left: 4px; }
        .auth-switch button:hover { text-decoration: underline; }
        
        .forgot-password { text-align: right; margin-top: 8px; }
        .forgot-password button { background: transparent; border: none; color: #10B981; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .forgot-password button:hover { text-decoration: underline; color: #047857; }

        /* MOBILE LANDING STYLES */
        .mobile-pricing-view { display: none; }
        
        @media (max-width: 1300px) { 
          .pricing-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } 
          .pro-card { transform: scale(1); } 
          .hero-image { top: 30%; right: -25%; width: 100%; opacity: 0.9; }
        }
        
        @media (max-width: 768px) { 
          /* ЗМЕНШЕНА КНОПКА ПІДТРИМКИ НА ТЕЛЕФОНІ */
          .support-widget { bottom: 16px; right: 16px; }
          .support-btn { width: 50px; height: 50px; }
          .s-icon { width: 22px; height: 22px; }
          .support-menu { bottom: 60px; right: 0; min-width: 220px; }

          .desktop-pricing-view { display: none; }
          .mobile-pricing-view { display: block; width: 100%; min-height: 100vh; background-color: #011C13; overflow-x: hidden; font-family: 'Inter', sans-serif; padding-bottom: 40px; position: relative; }
          
          .m-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; position: absolute; top: 0; left: 0; width: 100%; z-index: 10; }
          .m-logo-box { display: flex; align-items: center; gap: 12px; }
          .m-logo-icon { width: 36px; height: 36px; background: #047857; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
          
          .m-hero { position: relative; width: 100%; background: #011C13; }
          .m-hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
          .m-hero-bg img { width: 100%; height: 100%; object-fit: cover; object-position: center bottom; opacity: 0.8; }
          .m-hero-content { position: relative; z-index: 2; padding: 110px 24px 380px 24px; text-align: left; }
          
          .m-badge-top { background: rgba(52, 211, 153, 0.15); color: #34D399; font-size: 10px; font-weight: 800; padding: 6px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: 16px; border: 1px solid rgba(52, 211, 153, 0.2); }
          .m-hero-content h1 { font-size: 36px; font-weight: 800; line-height: 1.1; margin-bottom: 16px; letter-spacing: -0.5px; color: #FFFFFF; }
          .m-hero-content h1 span { color: #34D399; }
          .m-hero-content p { font-size: 15px; color: rgba(255,255,255,0.8); line-height: 1.5; margin-bottom: 0; font-weight: 500; }
          
          .m-pricing { background: transparent; padding: 40px 0 20px 0; position: relative; z-index: 10; border-top: 1px solid rgba(255,255,255,0.05); }
          .m-pricing-header { padding: 0 24px; margin-bottom: 24px; text-align: left; }
          .m-pricing h2 { font-size: 28px; font-weight: 800; line-height: 1.2; margin-bottom: 12px; color: #FFFFFF; letter-spacing: -0.5px; }
          .m-pricing p { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.5; }
          
          .m-cards-scroll { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 16px; padding: 20px 24px 30px 24px; -ms-overflow-style: none; scrollbar-width: none; }
          .m-cards-scroll::-webkit-scrollbar { display: none; }
          
          .m-card { min-width: 280px; scroll-snap-align: center; background: rgba(255,255,255,0.03); border-radius: 24px; padding: 28px 24px; display: flex; flex-direction: column; position: relative; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); }
          .m-card.pro { border: 1px solid #10B981; background: rgba(16,185,129,0.05); transform: scale(1.02); }
          .m-popular-tag { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #10B981; color: #FFF; font-size: 11px; font-weight: 800; padding: 6px 16px; border-radius: 20px; letter-spacing: 0.5px; white-space: nowrap; box-shadow: 0 4px 10px rgba(16,185,129,0.3); }
          
          .m-card-badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 8px; display: inline-block; margin-bottom: 16px; width: max-content; }
          .m-card-badge.light { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); }
          .m-card-badge.green { background: rgba(16,185,129,0.15); color: #34D399; }
          .m-card.pro .m-card-badge { background: rgba(255,255,255,0.15); color: #FFF; }
          
          .m-card-title { font-size: 24px; font-weight: 800; color: #FFFFFF; margin-bottom: 6px; line-height: 1.2; }
          .m-card-subtitle { font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 24px; min-height: 32px; }
          .m-card-price { font-size: 44px; font-weight: 900; color: #FFFFFF; margin-bottom: 24px; letter-spacing: -1px; }
          .m-card-price span { font-size: 15px; color: rgba(255,255,255,0.5); font-weight: 600; }
          
          .m-features { flex: 1; display: flex; flex-direction: column; gap: 14px; margin-bottom: 32px; }
          .m-feature-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: rgba(255,255,255,0.85); font-weight: 500; line-height: 1.4; }
          .m-card.pro .m-feature-item { color: #FFFFFF; font-weight: 600; }
          
          .m-btn { width: 100%; padding: 16px; border-radius: 12px; font-weight: 800; font-size: 15px; text-align: center; cursor: pointer; transition: all 0.2s; }
          .m-btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #FFFFFF; }
          .m-btn-solid { background: #10B981; border: none; color: #FFFFFF; box-shadow: 0 4px 15px rgba(16,185,129,0.3); }

          .m-footer-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 0 24px 40px 24px; position: relative; z-index: 10;}
          .m-f-item { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
          .m-f-icon { color: #34D399; }
          .m-f-title { font-size: 12px; font-weight: 700; color: #FFFFFF; line-height: 1.2; }
          .m-f-desc { font-size: 10px; color: rgba(255,255,255,0.5); line-height: 1.3; }

          /* АВТОРИЗАЦІЯ НА МОБІЛЬНОМУ */
          .auth-container-wrapper { padding: 0 24px; padding-bottom: 40px; position: relative; z-index: 20; }
          .auth-container { 
            background: #FFFFFF; 
            padding: 32px 24px; 
            border-radius: 24px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.3); 
            width: 100%;
          }
        }
      `}</style>

      {/* =========================================
          DESKTOP VIEW (Розділений екран ПК)
          ========================================= */}
      <div className="desktop-pricing-view">
        <div className="left-panel">
          <div className="left-bg-wrapper"><div className="bg-glow"></div></div>
          <div className="left-content">
            <div className="brand-header">
              <div className="brand-icon"><BarChart2 color="#FFF" size={20} /></div>
              <div>
                <h1 style={{ fontWeight: 800, fontSize: "16px" }}>Price Drop</h1>
                <p style={{ fontSize: "11px", color: "rgba(209,250,229,0.8)", fontWeight: 500 }}>Business CRM</p>
              </div>
            </div>
            <h2 className="hero-title">Контролюй свій бізнес <br/><span>у кілька кліків</span></h2>
            <p className="hero-subtitle">Сучасна CRM система для автоматизації продажів, обліку товарів та ефективного аналізу твого бізнесу.</p>
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon-wrapper"><BarChart2 size={16} color="#6EE7B7" /></div>
                <div><h3 className="feature-title">Аналітика та звіти</h3><ul className="feature-desc"><li>Детальна аналітика</li><li>Графіки</li><li>Дані</li></ul></div>
              </div>
              <div className="feature-item">
                <div className="feature-icon-wrapper"><Package size={16} color="#6EE7B7" /></div>
                <div><h3 className="feature-title">Облік товарів</h3><ul className="feature-desc"><li>Авто-списання</li><li>Залишки</li></ul></div>
              </div>
              <div className="feature-item">
                <div className="feature-icon-wrapper"><Users size={16} color="#6EE7B7" /></div>
                <div><h3 className="feature-title">Клієнти та продажі</h3><ul className="feature-desc"><li>Замовлення</li><li>База клієнтів</li></ul></div>
              </div>
            </div>
            <div className="footer-text">БІЛЬШЕ КОНТРОЛЮ &nbsp;|&nbsp; БІЛЬШЕ ПРИБУТКУ</div>
          </div>
          <img src="/hero-3d.png" alt="Price Drop Dashboard" className="hero-image" />
        </div>

        <div className="right-panel">
          <div className="right-content">
            {step === "pricing" ? (
              <>
                <div className="pricing-header">
                  <div className="badge">Тарифні плани</div>
                  <h2 className="pricing-title">Пройди <span>30 днів</span> безкоштовно</h2>
                  <p className="pricing-subtitle">Оціни всі можливості системи. Після пробного періоду обери зручний тариф або залишайся на безкоштовному плані.</p>
                </div>

                <div className="pricing-grid">
                  <div className="pricing-card">
                    <div className="card-badge" style={{ background: "#ECFDF5", color: "#047857" }}>Пробний період</div>
                    <h3 className="card-title">30 днів безкоштовно</h3>
                    <p className="card-desc" style={{ marginBottom: "50px" }}>Для всіх користувачів</p>
                    <div className="card-features">{['Повний доступ до всіх функцій', 'Аналітика та звіти', 'Облік товарів', 'Клієнти та замовлення', 'Підтримка 24/7'].map((f, i) => (<div key={i} className="card-feature-item"><Check size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "1px" }} /><span>{f}</span></div>))}</div>
                    <button onClick={() => selectPlanAndProceed("Пробний період")} className="btn-outline">Почати зараз</button>
                  </div>
                  <div className="pricing-card">
                    <div className="card-badge" style={{ background: "#F1F5F9", color: "#475569" }}>Безкоштовно</div>
                    <h3 className="card-title">Малий бізнес</h3>
                    <p className="card-desc">До 20 продажів на місяць</p>
                    <div className="card-price-box"><span className="card-price">$0</span><span className="card-period"> /міс</span></div>
                    <div className="card-features">{['Усі базові функції', 'До 20 продажів на місяць', 'Підтримка 24/7'].map((f, i) => (<div key={i} className="card-feature-item"><Check size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "1px" }} /><span>{f}</span></div>))}</div>
                    <button onClick={() => selectPlanAndProceed("Малий бізнес")} className="btn-light">Обрати</button>
                  </div>
                  <div className="pricing-card pro-card">
                    <div className="popular-tag">Популярний</div>
                    <div className="card-badge" style={{ background: "rgba(255,255,255,0.15)", color: "#FFF" }}>Pro</div>
                    <h3 className="card-title">Pro</h3>
                    <p className="card-desc">До 200 продажів</p>
                    <div className="card-price-box"><span className="card-price">$5</span><span className="card-period"> /міс</span></div>
                    <div className="card-features">{['Усі функції', 'До 200 продажів', '1 співробітник', 'Поглиблена аналітика', 'Пріоритетна підтримка'].map((f, i) => (<div key={i} className="card-feature-item"><Check size={16} color="#34D399" style={{ flexShrink: 0, marginTop: "1px" }} /><span>{f}</span></div>))}</div>
                    <button onClick={() => selectPlanAndProceed("Pro")} className="btn-solid">Обрати</button>
                  </div>
                  <div className="pricing-card">
                    <div className="card-badge" style={{ background: "#F1F5F9", color: "#475569" }}>Business</div>
                    <h3 className="card-title">Business</h3>
                    <p className="card-desc">Від 200 продажів і більше</p>
                    <div className="card-price-box"><span className="card-price">$8</span><span className="card-period"> /міс</span></div>
                    <div className="card-features">{['Усі функції', 'Від 200 продажів і більше', '5–10 співробітників', 'Розширена аналітика', 'Персональний менеджер'].map((f, i) => (<div key={i} className="card-feature-item"><Check size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "1px" }} /><span>{f}</span></div>))}</div>
                    <button onClick={() => selectPlanAndProceed("Business")} className="btn-light">Обрати</button>
                  </div>
                </div>
              </>
            ) : (
              authFormsJsx
            )}
          </div>
        </div>
      </div>

      {/* =========================================
          MOBILE VIEW (ДАРК ЛЕНДІНГ ПО ФОТО)
          ========================================= */}
      <div className="mobile-pricing-view">
        <header className="m-header">
          <div className="m-logo-box">
            <div className="m-logo-icon"><BarChart2 color="#FFF" size={20} /></div>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: "15px", color: "#FFF", lineHeight: 1.1 }}>Price Drop</h1>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Business CRM</p>
            </div>
          </div>
        </header>

        {/* ТЕКСТ ЛЕЖИТЬ НА ФОНІ hero-mockup.png */}
        <section className="m-hero">
          <div className="m-hero-bg"><img src="/hero-mockup.png" alt="CRM Mockup" /></div>
          <div className="m-hero-content">
            <span className="m-badge-top">КОНТРОЛЬ БІЗНЕСУ</span>
            <h1>Створено для тих, <br/><span>хто хоче рости</span></h1>
            <p>Проста та потужна CRM система для автоматизації продажів, обліку та аналітики твого бізнесу.</p>
          </div>
        </section>

        <section className="m-pricing">
          {step === "pricing" ? (
            <>
              <div className="m-pricing-header">
                <span className="m-badge-top">ТАРИФНІ ПЛАНИ</span>
                <h2>Почни вже сьогодні з потрібного тарифу</h2>
                <p>Обери тариф, який підходить саме твоєму бізнесу. Після реєстрації ти одразу отримаєш доступ до всіх можливостей системи.</p>
              </div>

              <div className="m-cards-scroll">
                
                {/* Картка 1: Пробний */}
                <div className="m-card">
                  <span className="m-card-badge green">Пробний період</span>
                  <div className="m-card-title"><span style={{color: '#10B981', fontWeight: 900}}>30</span> днів<br/>безкоштовно</div>
                  <div className="m-card-subtitle" style={{ marginBottom: "30px", marginTop: "8px" }}>Для всіх користувачів</div>
                  
                  <div className="m-features">
                    {['Повний доступ до всіх функцій', 'Аналітика та звіти', 'Облік товарів', 'Клієнти та замовлення', 'Підтримка 24/7'].map((f, i) => (
                      <div key={i} className="m-feature-item"><Check size={18} color="#10B981" style={{ flexShrink: 0 }} /><span>{f}</span></div>
                    ))}
                  </div>
                  <button onClick={() => selectPlanAndProceed("Пробний період")} className="m-btn m-btn-outline-green">Почати зараз</button>
                </div>

                {/* Картка 2: Малий бізнес */}
                <div className="m-card">
                  <span className="m-card-badge light">Безкоштовно</span>
                  <div className="m-card-title">Малий бізнес</div>
                  <div className="m-card-subtitle">До 20 продажів на місяць</div>
                  
                  <div className="m-card-price">$0<span> /міс</span></div>
                  
                  <div className="m-features">
                    {['Усі базові функції', 'До 20 продажів на місяць', 'Підтримка 24/7'].map((f, i) => (
                      <div key={i} className="m-feature-item"><Check size={18} color="#10B981" style={{ flexShrink: 0 }} /><span>{f}</span></div>
                    ))}
                  </div>
                  <button onClick={() => selectPlanAndProceed("Малий бізнес")} className="m-btn m-btn-light">Обрати</button>
                </div>

                {/* Картка 3: Pro (Зелена) */}
                <div className="m-card pro">
                  <div className="m-popular-tag">Популярний</div>
                  <span className="m-card-badge">Pro</span>
                  <div className="m-card-title">Pro</div>
                  <div className="m-card-subtitle">До 200 продажів</div>
                  
                  <div className="m-card-price">$5<span> /міс</span></div>
                  
                  <div className="m-features">
                    {['Усі функції', 'До 200 продажів', '1 співробітник', 'Поглиблена аналітика', 'Пріоритетна підтримка'].map((f, i) => (
                      <div key={i} className="m-feature-item"><Check size={18} color="#10B981" style={{ flexShrink: 0 }} /><span>{f}</span></div>
                    ))}
                  </div>
                  <button onClick={() => selectPlanAndProceed("Pro")} className="m-btn m-btn-solid">Обрати</button>
                </div>

                {/* Картка 4: Business */}
                <div className="m-card">
                  <span className="m-card-badge light">Business</span>
                  <div className="m-card-title">Business</div>
                  <div className="m-card-subtitle">Від 200 продажів і більше</div>
                  
                  <div className="m-card-price">$8<span> /міс</span></div>
                  
                  <div className="m-features">
                    {['Усі функції', 'Від 200 продажів і більше', '5–10 співробітників', 'Розширена аналітика', 'Персональний менеджер'].map((f, i) => (
                      <div key={i} className="m-feature-item"><Check size={18} color="#10B981" style={{ flexShrink: 0 }} /><span>{f}</span></div>
                    ))}
                  </div>
                  <button onClick={() => selectPlanAndProceed("Business")} className="m-btn m-btn-light">Обрати</button>
                </div>

              </div>
            </>
          ) : (
            authFormsJsx
          )}
        </section>

        <section className="m-footer-features">
          <div className="m-f-item">
            <Zap className="m-f-icon" size={24} />
            <div>
              <div className="m-f-title">Швидкий старт</div>
              <div className="m-f-desc">Налаштування за 5 хв</div>
            </div>
          </div>
          <div className="m-f-item">
            <Shield className="m-f-icon" size={24} />
            <div>
              <div className="m-f-title">Надійний захист</div>
              <div className="m-f-desc">Ваші дані в безпеці</div>
            </div>
          </div>
          <div className="m-f-item">
            <Headphones className="m-f-icon" size={24} />
            <div>
              <div className="m-f-title">Підтримка 24/7</div>
              <div className="m-f-desc">Завжди на зв'язку</div>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================
          ВІДЖЕТ ПІДТРИМКИ (3D КНОПКА ЯК НА ФОТО)
          ========================================= */}
      <div className="support-widget">
        <div className={`support-menu ${isSupportOpen ? 'open' : ''}`}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', padding: '4px 8px', marginBottom: '4px' }}>Служба підтримки</div>
          <a href="tel:+380983651622" className="support-link phone">
            <Phone size={18} /> +38 098 365 16 22
          </a>
          <a href="https://t.me/davyd.petryliak" target="_blank" rel="noreferrer" className="support-link tg">
            <Send size={18} /> Telegram
          </a>
        </div>
        <button className="support-btn" onClick={() => setIsSupportOpen(!isSupportOpen)}>
          {isSupportOpen ? <X className="s-icon" strokeWidth={2.5} /> : <Headset className="s-icon" strokeWidth={2.5} />}
        </button>
      </div>

    </div>
  );
}