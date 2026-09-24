"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, AlertCircle, ShieldCheck, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Цей рядок автоматично чистить всі баги Телеграму при відкритті сторінки логіну!
  useEffect(() => {
    localStorage.clear();
    supabase.auth.signOut().catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password.trim(),
    });

    if (error) {
      setError("Неправильний email або пароль.");
      setLoading(false);
    } else if (data.session) {
      // Якщо вхід успішний - перекидаємо на головний дашборд
      router.push("/"); 
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#F8FAFC", fontFamily: "system-ui, -apple-system, sans-serif", padding: "20px" }}>
      <div style={{ backgroundColor: "#FFF", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", width: "100%", maxWidth: "440px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "64px", height: "64px", backgroundColor: "#047857", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto", boxShadow: "0 4px 12px rgba(4, 120, 87, 0.2)" }}>
            <ShieldCheck size={32} color="#FFF" />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0F172A", margin: "0 0 8px 0" }}>З поверненням!</h1>
          <p style={{ fontSize: "14px", color: "#64748B", margin: 0, fontWeight: "500" }}>Увійдіть до свого робочого простору Price Drop</p>
        </div>

        {error && (
          <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FCA5A5", color: "#DC2626", padding: "12px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>Email</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}><Mail size={18} /></div>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vash@email.com" style={{ width: "100%", padding: "14px 14px 14px 42px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "15px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", color: "#0F172A", fontWeight: "600" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>Пароль</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}><Lock size={18} /></div>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "14px 14px 14px 42px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "15px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", color: "#0F172A", fontWeight: "600" }} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%", backgroundColor: "#10B981", color: "#FFF", border: "none", padding: "16px", borderRadius: "12px", fontWeight: "800", fontSize: "15px", cursor: loading ? "not-allowed" : "pointer", marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)", transition: "all 0.2s", opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} />}
            {loading ? "Вхід..." : "Увійти"}
          </button>
        </form>

        <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #E2E8F0", textAlign: "center" }}>
          <p style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A", margin: "0 0 8px 0" }}>Ще немає акаунту?</p>
          <p style={{ fontSize: "12px", color: "#64748B", margin: 0, lineHeight: "1.5", fontWeight: "500" }}>
            Додаток Price Drop призначений для керування вже існуючим робочим простором. Щоб створити новий акаунт, відкрийте сайт <b>pricedrop.com</b>
          </p>
        </div>

      </div>
    </div>
  );
}