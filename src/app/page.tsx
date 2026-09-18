"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Home, Package, ShoppingCart, CreditCard, BarChart2,
  Users, Truck, PieChart, Settings, Calendar, 
  Wallet, TrendingUp, LogOut, Plus, Loader2, Image as ImageIcon, 
  Trash2, Briefcase, Printer, X, CheckCircle, XCircle, Menu,
  Hash, Coins, User, Check, ArrowRight, ChevronLeft, ChevronRight, FileText, Shield, Send, UploadCloud, Copy, ShieldCheck, Mail, Search, Headset, Phone
} from "lucide-react";

// !!! ТВОЯ ПОШТА СУПЕР-АДМІНА !!!
const SUPER_ADMIN_EMAIL = "davidpetrilak4@gmail.com"; 

// !!! ДАНІ ДЛЯ TELEGRAM БОТА !!!
const TELEGRAM_BOT_TOKEN = "8786054702:AAG837HCBYkgW2E_UqgJ3YEiEYaW9paNFfA"; 
const TELEGRAM_CHAT_ID = "1374528287"; 

const CustomSelect = ({ value, onChange, options, placeholder, triggerStyle, dropdownStyle, triggerClassName, wrapperClassName }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const handleClickOutside = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, []);
  const selectedOption = options.find((o: any) => o.value === value) || null;
  return (
    <div ref={ref} className={wrapperClassName} style={{ position: "relative", width: "100%", minWidth: 0 }}>
      <div onClick={() => setIsOpen(!isOpen)} className={triggerClassName} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", userSelect: "none", transition: "all 0.2s", boxSizing: "border-box", ...triggerStyle }}>
        <span style={{ display: "block", textAlign: "left", lineHeight: "1.3", paddingRight: "8px", overflow: "hidden", textOverflow: "ellipsis" }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0, marginLeft: "4px", color: "#64748B" }}><path d="m6 9 6 6 6-6"/></svg>
      </div>
      {isOpen && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, width: "100%", backgroundColor: "#FFF", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", zIndex: 1000, maxHeight: "250px", overflowY: "auto", padding: "8px", ...dropdownStyle }}>
          {options.length === 0 && <div style={{ padding: "12px", textAlign: "center", color: "#94A3B8", fontSize: "13px" }}>Немає варіантів</div>}
          {options.map((opt: any) => (
            <div key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); }} style={{ padding: "12px 16px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, color: value === opt.value ? "#1A9682" : "#0F172A", backgroundColor: value === opt.value ? "#F0FDFA" : "transparent", cursor: "pointer", transition: "all 0.2s", marginBottom: "2px" }} onMouseEnter={(e) => { if(value !== opt.value) e.currentTarget.style.backgroundColor = "#F8FAFC" }} onMouseLeave={(e) => { if(value !== opt.value) e.currentTarget.style.backgroundColor = "transparent" }}>
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CustomCalendar = ({ mode, value, onChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dateObj = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(dateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(dateObj.getMonth());
  useEffect(() => { if (isOpen) { const d = value ? new Date(value) : new Date(); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); } }, [isOpen, value]);
  useEffect(() => { const handleClickOutside = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, []);
  const months = ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"];
  const fullMonths = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
  const formatDisplay = () => { if (!value) return "Оберіть дату"; const d = new Date(value); if (mode === "month") return `${fullMonths[d.getMonth()]} ${d.getFullYear()}`; return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth()+1).toString().padStart(2, '0')}.${d.getFullYear()}`; };
  const handlePrev = () => { if (mode === "month") { setViewYear(viewYear - 1); } else { if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); } else { setViewMonth(viewMonth - 1); } } };
  const handleNext = () => { if (mode === "month") { setViewYear(viewYear + 1); } else { if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); } else { setViewMonth(viewMonth + 1); } } };
  const handleMonthSelect = (idx: number) => { const mm = (idx + 1).toString().padStart(2, '0'); onChange(`${viewYear}-${mm}`); setIsOpen(false); };
  const handleDateSelect = (day: number) => { const mm = (viewMonth + 1).toString().padStart(2, '0'); const dd = day.toString().padStart(2, '0'); onChange(`${viewYear}-${mm}-${dd}`); setIsOpen(false); };
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => { let day = new Date(y, m, 1).getDay(); return day === 0 ? 6 : day - 1; };
  return (
    <div ref={ref} style={{ position: "relative", minWidth: 0 }}>
      <div onClick={() => setIsOpen(!isOpen)} className="styled-date-input" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", boxSizing: "border-box" }}>
        <span className="desktop-nowrap" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{formatDisplay()}</span>
        <Calendar style={{ width: "16px", height: "16px", color: "#1A9682", flexShrink: 0 }} />
      </div>
      {isOpen && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: "280px", backgroundColor: "#FFF", borderRadius: "20px", border: "1px solid #E2E8F0", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", zIndex: 1000, padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <button onClick={handlePrev} style={{ background: "#F1F5F9", border: "none", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#E2E8F0"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#F1F5F9"}><ChevronLeft size={18} /></button>
            <div style={{ fontWeight: 800, fontSize: "15px", color: "#0F172A" }}>{mode === "month" ? viewYear : `${fullMonths[viewMonth]} ${viewYear}`}</div>
            <button onClick={handleNext} style={{ background: "#F1F5F9", border: "none", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#E2E8F0"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#F1F5F9"}><ChevronRight size={18} /></button>
          </div>
          {mode === "month" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {months.map((m, i) => {
                const isSelected = value === `${viewYear}-${(i+1).toString().padStart(2, '0')}`;
                return (<button key={m} onClick={() => handleMonthSelect(i)} style={{ padding: "14px 8px", borderRadius: "12px", border: "none", backgroundColor: isSelected ? "#1A9682" : "transparent", color: isSelected ? "#FFF" : "#0F172A", fontWeight: 700, fontSize: "14px", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "#F1F5F9" }} onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent" }}>{m}</button>)
              })}
            </div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "12px", textAlign: "center" }}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map(d => <div key={d} style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8" }}>{d}</div>)}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
                {Array.from({ length: getFirstDayOfMonth(viewYear, viewMonth) }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: getDaysInMonth(viewYear, viewMonth) }).map((_, i) => {
                  const day = i + 1; const isSelected = value === `${viewYear}-${(viewMonth+1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                  return (<button key={day} onClick={() => handleDateSelect(day)} style={{ aspectRatio: "1/1", borderRadius: "10px", border: "none", backgroundColor: isSelected ? "#1A9682" : "transparent", color: isSelected ? "#FFF" : "#0F172A", fontWeight: 700, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "#F1F5F9" }} onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent" }}>{day}</button>)
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const FormatMoney = ({ amount, showSign }: { amount: number, showSign?: boolean }) => {
  const safeAmount = Number(amount) || 0;
  const formatted = Math.abs(safeAmount).toLocaleString("uk-UA");
  let prefix = "₴";
  if (showSign) prefix = safeAmount > 0 ? "+₴" : safeAmount < 0 ? "-₴" : "₴";
  else if (safeAmount < 0) prefix = "-₴";
  return <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 800, letterSpacing: "-0.5px", whiteSpace: "nowrap" }}>{prefix}{formatted}</span>;
};

const FormatNumber = ({ num }: { num: number }) => (
  <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 700, letterSpacing: "-0.5px" }}>{(Number(num) || 0).toLocaleString("uk-UA")}</span>
);

interface Product { id: string; name: string; category: string; price: number; cost_price: number; type: "clothing" | "simple"; sizes: Record<string, number>; quantity: number; image_url: string; }
interface Sale { id: string; product_id?: string; product_name: string; selected_size?: string; quantity: number; total_price: number; cost_price: number; profit: number; customer_name?: string; created_at: string; status: string; prepayment: number; ttn: string; employee_name: string; }
interface Expense { id: string; description: string; category: string; amount: number; created_at: string; }
interface Employee { id: string; name: string; role: string; phone: string; email?: string; password?: string; user_id?: string; }
interface Client { id: string; name: string; phone: string; }
interface Supplier { id: string; name: string; contact: string; }

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Головна");
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("owner");
  const [businessName, setBusinessName] = useState<string>("Business CRM");
  
  const [userPlan, setUserPlan] = useState<string>("Пробний період");
  const [paymentDateStr, setPaymentDateStr] = useState<string>("");
  const [daysToPay, setDaysToPay] = useState<number>(0);

  const [filterMode, setFilterMode] = useState<"month" | "date">("month");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [crmUsersList, setCrmUsersList] = useState<any[]>([]);
  const [adminSearch, setAdminSearch] = useState("");
  const [isTrialExpired, setIsTrialExpired] = useState(false);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  
  const [selectedClientForDetails, setSelectedClientForDetails] = useState<Client | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [productForm, setProductForm] = useState({ name: "", category: "", price: "", costPrice: "", type: "clothing" as "clothing" | "simple", simpleQuantity: "", sizes: { S: "", M: "", L: "", XL: "", XXL: "" } as Record<string, any> });
  const [saleForm, setSaleForm] = useState({ product_id: "", selected_size: "", quantity: "1", total_price: "", customer_type: "Роздрібний покупець", customer_name: "", payment_type: "full", prepayment: "", ttn: "" });
  const [expenseForm, setExpenseForm] = useState({ description: "", category: "Загальні", amount: "", created_at: new Date().toISOString().slice(0, 10) });
  const [employeeForm, setEmployeeForm] = useState({ name: "", role: "", phone: "", email: "", password: "" });
  const [clientForm, setClientForm] = useState({ name: "", phone: "" });
  const [supplierForm, setSupplierForm] = useState({ name: "", contact: "" });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSendingReceipt, setIsSendingReceipt] = useState(false);
  const [receiptSent, setReceiptSent] = useState(false);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState("Pro ($5/міс)");
  const receiptInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { 
    checkUserAndFetchData(); 
    const storedName = localStorage.getItem("business_name");
    if (storedName) setBusinessName(storedName);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const channel = supabase.channel('realtime_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sales', filter: `user_id=eq.${userId}` }, (payload) => { setSales(prev => prev.find(s => s.id === payload.new.id) ? prev : [payload.new as Sale, ...prev]); })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sales', filter: `user_id=eq.${userId}` }, (payload) => { setSales(prev => prev.map(s => s.id === payload.new.id ? payload.new as Sale : s)); })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'products', filter: `user_id=eq.${userId}` }, (payload) => { setProducts(prev => prev.find(p => p.id === payload.new.id) ? prev : [payload.new as Product, ...prev]); })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products', filter: `user_id=eq.${userId}` }, (payload) => { setProducts(prev => prev.map(p => p.id === payload.new.id ? payload.new as Product : p)); })
      .subscribe();
    return () => { supabase.removeChannel(channel); }
  }, [userId]);

  const checkUserAndFetchData = async () => {
    // 1. СПІВРОБІТНИК
    const empSession = localStorage.getItem("employee_session");
    if (empSession) {
      const emp = JSON.parse(empSession);
      setUserId(emp.user_id);
      setUserEmail(emp.email || emp.name);
      setUserRole("employee");

      const { data: ownerCrm } = await supabase.from("crm_users").select("*").eq("id", emp.user_id).single();
      if (ownerCrm && ownerCrm.email !== SUPER_ADMIN_EMAIL) {
        const isPaid = ownerCrm.plan && (ownerCrm.plan.includes("Pro") || ownerCrm.plan.includes("Business") || ownerCrm.plan.includes("Безліміт") || ownerCrm.plan === "Малий бізнес");
        const createdAt = new Date(ownerCrm.created_at || new Date());
        let daysPassed = Math.floor((new Date().getTime() - createdAt.getTime()) / (1000 * 3600 * 24));
        if (daysPassed < 0) daysPassed = 0; // Захист від зміщених дат у майбутнє
        
        if (ownerCrm.plan === "Пробний період" && daysPassed >= 30) {
          setIsTrialExpired(true);
          setLoading(false);
          return; 
        }
      }
      await loadDatabaseData(emp.user_id);
      setLoading(false);
      return;
    }

    // 2. ВЛАСНИК
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }
    
    const uEmail = session.user.email || "";
    const userEmailToCheck = uEmail.toLowerCase().trim();
    setUserEmail(uEmail); 
    setUserId(session.user.id);
    setUserRole("owner");

    let { data: crmUser } = await supabase.from("crm_users").select("*").eq("email", userEmailToCheck).single();
    
    if (!crmUser) {
      const newUser = { id: session.user.id, email: userEmailToCheck, plan: "Пробний період" };
      await supabase.from("crm_users").insert([newUser]);
      crmUser = newUser;
    }

    if (crmUser) {
      if (userEmailToCheck === SUPER_ADMIN_EMAIL) {
        setUserPlan("Безліміт (Супер-Адмін)");
        setPaymentDateStr("Необмежено");
        setDaysToPay(999);
      } else {
        setUserPlan(crmUser.plan || "Пробний період");
        const createdAt = new Date(crmUser.created_at || new Date());
        let daysPassed = Math.floor((new Date().getTime() - createdAt.getTime()) / (1000 * 3600 * 24));
        if (daysPassed < 0) daysPassed = 0; // Захист від майбутніх дат! Не більше 30.
        
        const nextPayDate = new Date(createdAt);
        nextPayDate.setDate(nextPayDate.getDate() + 30);
        setPaymentDateStr(nextPayDate.toLocaleDateString('uk-UA'));
        setDaysToPay(Math.max(0, 30 - daysPassed));

        if (crmUser.plan === "Пробний період" && daysPassed >= 30) {
          setIsTrialExpired(true);
          setLoading(false);
          return; 
        }
      }
    }

    if (uEmail === SUPER_ADMIN_EMAIL) {
      const { data: allUsers } = await supabase.from("crm_users").select("*").order("created_at", { ascending: false });
      if (allUsers) setCrmUsersList(allUsers);
    }

    await loadDatabaseData(session.user.id); 
    setLoading(false);
  };

  const loadDatabaseData = async (uid: string) => {
    const [{ data: prodData }, { data: salesData }, { data: expData }, { data: empData }, { data: cliData }, { data: supData }] = await Promise.all([
      supabase.from("products").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("sales").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("expenses").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("employees").select("*").eq("user_id", uid),
      supabase.from("clients").select("*").eq("user_id", uid),
      supabase.from("suppliers").select("*").eq("user_id", uid)
    ]);
    if (prodData) setProducts(prodData as Product[]);
    if (salesData) setSales(salesData as Sale[]);
    if (expData) setExpenses(expData as Expense[]);
    if (empData) setEmployees(empData as Employee[]);
    if (cliData) setClients(cliData as Client[]);
    if (supData) setSuppliers(supData as Supplier[]);
  };

  const handleDeleteProduct = async (id: string) => { if (!confirm("Видалити товар?")) return; await supabase.from("products").delete().eq("id", id); setProducts(products.filter(p => p.id !== id)); };
  const handleDeleteSale = async (id: string) => { if (!confirm("Видалити запис?")) return; await supabase.from("sales").delete().eq("id", id); setSales(sales.filter(s => s.id !== id)); };
  const handleDeleteExpense = async (id: string) => { if (!confirm("Видалити витрату?")) return; await supabase.from("expenses").delete().eq("id", id); setExpenses(expenses.filter(e => e.id !== id)); };
  const handleDeleteEmployee = async (id: string) => { if (!confirm("Видалити співробітника?")) return; await supabase.from("employees").delete().eq("id", id); setEmployees(employees.filter(e => e.id !== id)); };
  const handleDeleteClient = async (id: string) => { if (!confirm("Видалити клієнта?")) return; await supabase.from("clients").delete().eq("id", id); setClients(clients.filter(c => c.id !== id)); };
  const handleDeleteSupplier = async (id: string) => { if (!confirm("Видалити постачальника?")) return; await supabase.from("suppliers").delete().eq("id", id); setSuppliers(suppliers.filter(s => s.id !== id)); };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image(); img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 500; const MAX_HEIGHT = 500; let width = img.width; let height = img.height;
        if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } 
        else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
        canvas.width = width; canvas.height = height; const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height); setImagePreview(canvas.toDataURL("image/jpeg", 0.7));
      };
    }; reader.readAsDataURL(file);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault(); if (!userId) return;
    const isClothing = productForm.type === "clothing";
    const cleanSizes: Record<string, number> = {};
    if (isClothing) { Object.entries(productForm.sizes).forEach(([k, v]) => { cleanSizes[k] = Number(v) || 0; }); }
    const totalQty = isClothing ? Object.values(cleanSizes).reduce((a, b) => a + b, 0) : Number(productForm.simpleQuantity) || 0;
    
    const newProduct = { user_id: userId, name: productForm.name, category: productForm.category || "Без категорії", price: Number(productForm.price) || 0, cost_price: Number(productForm.costPrice) || 0, type: productForm.type, sizes: isClothing ? cleanSizes : {}, quantity: totalQty, image_url: imagePreview || "" };
    const { data, error } = await supabase.from("products").insert([newProduct]).select();
    if (error) { alert("Помилка бази даних: " + error.message); return; }
    if (data) setProducts(prev => prev.find(p => p.id === data[0].id) ? prev : [data[0] as Product, ...prev]);
    setIsProductModalOpen(false); setImagePreview(null); setProductForm({ name: "", category: "", price: "", costPrice: "", type: "clothing", simpleQuantity: "", sizes: { S: "", M: "", L: "", XL: "", XXL: "" } });
  };

  const handleSelectProductForSale = (prodId: string) => {
    const selected = products.find(p => p.id === prodId);
    if (selected) {
      const availableSizes = selected.sizes ? Object.entries(selected.sizes).filter(([_, cnt]) => cnt > 0) : [];
      const initialSize = selected.type === "clothing" && availableSizes.length > 0 ? availableSizes[0][0] : "";
      setSaleForm({ ...saleForm, product_id: prodId, selected_size: initialSize, quantity: "1", total_price: selected.price.toString() });
    }
  };

  const handleSaleQuantityOrSizeChange = (qtyStr: string, sizeStr?: string) => {
    const qty = Number(qtyStr) || 1; const currentProd = products.find(p => p.id === saleForm.product_id);
    setSaleForm({ ...saleForm, quantity: qtyStr, selected_size: sizeStr !== undefined ? sizeStr : saleForm.selected_size, total_price: (currentProd ? currentProd.price * qty : 0).toString() });
  };

  const handleSaveSale = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!userId || !saleForm.product_id) { alert("Оберіть товар для продажу!"); return; }

    const qtyToSell = Number(saleForm.quantity) || 1; 

    // ====== ПЕРЕВІРКА ЛІМІТУ ДЛЯ ТАРИФУ "МАЛИЙ БІЗНЕС" ======
    if (userPlan === "Малий бізнес" || userPlan === "Безкоштовно") {
      const currentMonth = new Date().toISOString().slice(0, 7);
      // РАХУЄМО ОДИНИЦІ ТОВАРУ (ШТУКИ) ЗА МІСЯЦЬ!
      const salesThisMonthItems = sales
        .filter(s => s.created_at.startsWith(currentMonth))
        .reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
      
      if (salesThisMonthItems + qtyToSell > 20) {
        alert(`ЛІМІТ ВИЧЕРПАНО!\n\nНа безкоштовному тарифі доступно максимум 20 проданих речей на місяць.\nВже продано: ${salesThisMonthItems} шт.\nВи намагаєтесь продати ще: ${qtyToSell} шт.\n\nБудь ласка, перейдіть на платний тариф у налаштуваннях.`);
        return; 
      }
    }
    // =========================================================
    
    const selectedProd = products.find(p => p.id === saleForm.product_id); 
    if (!selectedProd) return;
    
    const salePrice = Number(saleForm.total_price) || 0;
    const unitCost = Number(selectedProd.cost_price || 0); 
    const totalCost = unitCost * qtyToSell; 
    const profit = salePrice - totalCost;
    
    let updatedSizes = { ...(selectedProd.sizes || {}) }; 
    let updatedTotalQuantity = selectedProd.quantity || 0;

    if (selectedProd.type === "clothing" || (selectedProd.sizes && Object.keys(selectedProd.sizes).length > 0)) {
      const sizeKey = saleForm.selected_size || ""; 
      const currentSizeStock = updatedSizes[sizeKey] || 0;
      if (currentSizeStock < qtyToSell) { alert(`Недостатньо розміру ${sizeKey}! В наявності: ${currentSizeStock} шт.`); return; }
      updatedSizes[sizeKey] = currentSizeStock - qtyToSell; 
      updatedTotalQuantity = Object.values(updatedSizes).reduce((a, b) => Number(a) + Number(b), 0);
    } else {
      if (updatedTotalQuantity < qtyToSell) { alert(`Недостатньо товару! В наявності: ${updatedTotalQuantity} шт.`); return; }
      updatedTotalQuantity -= qtyToSell;
    }

    let finalCustomerName = "Роздрібний покупець";
    if (saleForm.customer_type === "З бази клієнтів" || saleForm.customer_type === "Новий покупець") {
      if (!saleForm.customer_name) { alert("Введіть ПІБ клієнта!"); return; }
      finalCustomerName = saleForm.customer_name;
    }

    const isCod = saleForm.payment_type === "cod";
    const currentEmployeeName = userRole === "employee" ? userEmail : "Власник";

    const newSale = { 
      user_id: userId, 
      product_id: saleForm.product_id || null, 
      product_name: selectedProd.name || "Товар", 
      selected_size: saleForm.selected_size || null, 
      quantity: qtyToSell, 
      total_price: salePrice, 
      cost_price: totalCost, 
      profit: profit, 
      customer_name: finalCustomerName,
      status: isCod ? "В дорозі" : "Отримано",
      prepayment: isCod ? (Number(saleForm.prepayment) || 0) : 0,
      ttn: isCod ? (saleForm.ttn || "") : "",
      employee_name: currentEmployeeName
    };

    const { data, error } = await supabase.from("sales").insert([newSale]).select();
    if (error) { alert("Помилка при збереженні продажу: " + error.message); return; }

    if (data) {
      setSales(prev => prev.find(s => s.id === data[0].id) ? prev : [data[0] as Sale, ...prev]);
      await supabase.from("products").update({ sizes: updatedSizes, quantity: updatedTotalQuantity }).eq("id", selectedProd.id);
      setProducts(products.map(p => p.id === selectedProd.id ? { ...p, sizes: updatedSizes, quantity: updatedTotalQuantity } : p));
    }
    
    setIsSaleModalOpen(false); 
    setSaleForm({ product_id: "", selected_size: "", quantity: "1", total_price: "", customer_type: "Роздрібний покупець", customer_name: "", payment_type: "full", prepayment: "", ttn: "" });
  };

  const handleUpdateSaleStatus = async (sale: Sale, newStatus: string) => {
    if (newStatus === "Відмова") {
      if (!confirm("Клієнт відмовився? Товар буде повернуто на склад, а передоплата залишиться у вас.")) return;
      const selectedProd = products.find(p => p.id === sale.product_id);
      if (selectedProd) {
        let updatedSizes = { ...selectedProd.sizes };
        let updatedTotalQuantity = selectedProd.quantity || 0;
        if (selectedProd.type === "clothing" && sale.selected_size) {
          updatedSizes[sale.selected_size] = (updatedSizes[sale.selected_size] || 0) + sale.quantity;
          updatedTotalQuantity += sale.quantity;
        } else {
          updatedTotalQuantity += sale.quantity;
        }
        await supabase.from("products").update({ sizes: updatedSizes, quantity: updatedTotalQuantity }).eq("id", selectedProd.id);
        setProducts(products.map(p => p.id === selectedProd.id ? { ...p, sizes: updatedSizes, quantity: updatedTotalQuantity } : p));
      }
    } else if (newStatus === "Отримано") {
      if (!confirm("Підтверджуєте отримання посилки клієнтом? Повна сума буде зарахована в прибуток.")) return;
    }
    const { error } = await supabase.from("sales").update({ status: newStatus }).eq("id", sale.id);
    if (!error) setSales(sales.map(s => s.id === sale.id ? { ...s, status: newStatus } : s));
  };

  const handleSaveExpense = async (e: React.FormEvent) => { 
    e.preventDefault(); if (!userId) return; 
    const newExpense = { 
      user_id: userId, 
      description: expenseForm.description, 
      category: expenseForm.category, 
      amount: Number(expenseForm.amount) || 0,
      created_at: new Date(expenseForm.created_at).toISOString() 
    }; 
    const { data, error } = await supabase.from("expenses").insert([newExpense]).select(); 
    if (error) { alert("Помилка: " + error.message); return; }
    if (data) setExpenses([data[0] as Expense, ...expenses]);
    setIsExpenseModalOpen(false); 
    setExpenseForm({ description: "", category: "Загальні", amount: "", created_at: new Date().toISOString().slice(0, 10) }); 
  };
  
  const handleSaveEmployee = async (e: React.FormEvent) => { 
    e.preventDefault(); if (!employeeForm.name || !userId) return; 
    const newEmp = { user_id: userId, ...employeeForm }; 
    const { data, error } = await supabase.from("employees").insert([newEmp]).select(); 
    if (error) { alert("Помилка: " + error.message); return; }
    if (data) setEmployees([...employees, data[0] as Employee]); 
    setEmployeeForm({ name: "", role: "", phone: "", email: "", password: "" }); setIsEmployeeModalOpen(false); 
  };

  const handleSaveClient = async (e: React.FormEvent) => { 
    e.preventDefault(); if (!userId) return; 
    const newCli = { user_id: userId, ...clientForm }; 
    const { data, error } = await supabase.from("clients").insert([newCli]).select(); 
    if (error) { alert("Помилка: " + error.message); return; }
    if (data) setClients([...clients, data[0] as Client]); 
    setClientForm({ name: "", phone: "" }); setIsClientModalOpen(false); 
  };

  const handleSaveSupplier = async (e: React.FormEvent) => { 
    e.preventDefault(); if (!userId) return; 
    const newSup = { user_id: userId, ...supplierForm }; 
    const { data, error } = await supabase.from("suppliers").insert([newSup]).select(); 
    if (error) { alert("Помилка: " + error.message); return; }
    if (data) setSuppliers([...suppliers, data[0] as Supplier]); 
    setSupplierForm({ name: "", contact: "" }); setIsSupplierModalOpen(false); 
  };

  const handleChangeUserPlan = async (id: string, newPlan: string) => {
    if (!confirm(`Змінити тариф цьому клієнту на "${newPlan}"?`)) return;
    const { error } = await supabase.from("crm_users").update({ plan: newPlan }).eq("id", id);
    if (error) { alert("Помилка оновлення тарифу: " + error.message); } 
    else { setCrmUsersList(crmUsersList.map(u => u.id === id ? { ...u, plan: newPlan } : u)); }
  };

  const handleDeleteCrmUser = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цього клієнта та його доступ?")) return;
    const { error } = await supabase.from("crm_users").delete().eq("id", id);
    if (error) { alert("Помилка видалення: " + error.message); }
    else { setCrmUsersList(crmUsersList.filter(u => u.id !== id)); }
  };

  const handleLogout = async () => { localStorage.removeItem("employee_session"); await supabase.auth.signOut(); router.push("/login"); };

  const handleSendReceiptToTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) { alert("Будь ласка, прикріпіть скріншот оплати!"); return; }
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) { alert("Помилка: Не налаштовано Telegram бота."); return; }
    
    setIsSendingReceipt(true);
    const formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("photo", receiptFile);
    formData.append("caption", `💰 НОВА ОПЛАТА CRM!\nВід клієнта: ${userEmail}\nОбраний тариф: ${selectedPaymentPlan}\nСтатус: Чекає на розблокування доступу!`);

    try {
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, { method: "POST", body: formData });
      if (res.ok) { setReceiptSent(true); } else { alert("Помилка відправки в Telegram. Спробуйте ще раз."); }
    } catch (err) { alert("Не вдалося відправити скріншот. Перевірте з'єднання."); } 
    finally { setIsSendingReceipt(false); }
  };

  // ФУНКЦІЯ: Перехід на безкоштовний тариф після завершення 30 днів
  const handleConfirmFreePlan = async () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    // РАХУЄМО ОДИНИЦІ ТОВАРУ (ШТУКИ) ЗА МІСЯЦЬ!
    const salesThisMonthItems = sales
      .filter(s => s.created_at.startsWith(currentMonth))
      .reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
    
    if (salesThisMonthItems > 20) {
      alert(`Ліміт перевищено!\n\nВи продали ${salesThisMonthItems} речей цього місяця. Безкоштовний тариф дозволяє лише 20 шт.\nОберіть тариф Pro або Business.`);
      return;
    }

    if (!confirm("Перейти на тариф 'Малий бізнес'? Ваш ліміт буде 20 проданих речей на місяць.")) return;

    const { error } = await supabase.from("crm_users").update({ plan: "Малий бізнес" }).eq("email", userEmail.toLowerCase().trim());
    
    if (error) {
      alert("Помилка при зміні тарифу: " + error.message);
    } else {
      setUserPlan("Малий бізнес");
      setIsTrialExpired(false);
      alert("Готово! Ви успішно перейшли на тариф 'Малий бізнес'.");
    }
  };

  const copyCardToClipboard = () => {
    navigator.clipboard.writeText("5355280062698194");
    alert("Номер картки скопійовано!");
  };

  // ==========================================
  // ЕКРАН ОПЛАТИ / ВИБОРУ ТАРИФУ (ПІСЛЯ 30 ДНІВ)
  // ==========================================
  if (isTrialExpired) {
    return (
      <div className="payment-wrapper-full">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          
          .payment-wrapper-full { position: fixed; inset: 0; z-index: 9999; display: flex; width: 100vw; height: 100vh; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; overflow: hidden; background: #F8FAFC; align-items: center; justify-content: center; box-sizing: border-box; }
          
          .payment-split-box { display: flex; width: 100%; height: 100vh; max-width: 100%; background: #FFF; overflow: hidden; box-sizing: border-box; }
          
          .split-left { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 40px 6vw; position: relative; background: #FFFFFF; overflow: hidden; box-sizing: border-box; }
          .split-right { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 40px 6vw; position: relative; background: #F4FDF8; border-left: 1px solid #E2E8F0; overflow: hidden; box-sizing: border-box; }
          
          .header-bar { display: flex; justify-content: space-between; align-items: center; position: absolute; top: 40px; left: 6vw; right: 6vw; z-index: 10; }
          
          .left-center { max-width: 540px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; }
          .right-center { max-width: 500px; margin: 0 auto; width: 100%; }

          .check-icon { width: 64px; height: 64px; background: #10B981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 8px 16px rgba(16,185,129,0.2); }
          .main-heading { font-size: 40px; font-weight: 800; color: #0F172A; margin-bottom: 16px; letter-spacing: -1px; line-height: 1.1; text-align: center; }
          .sub-heading { font-size: 16px; color: #64748B; line-height: 1.6; font-weight: 500; margin-bottom: 40px; text-align: center; max-width: 500px; margin-left: auto; margin-right: auto; }

          .card-box { border: 1px solid #E2E8F0; border-radius: 24px; padding: 32px; background: #FFF; box-shadow: 0 10px 30px rgba(0,0,0,0.02); width: 100%; text-align: left; }
          .card-top { display: flex; align-items: flex-start; gap: 20px; margin-bottom: 24px; }
          .card-icon { width: 64px; height: 64px; background: #ECFDF5; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .card-label { font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; display: block; }
          .card-brand { font-size: 18px; font-weight: 800; color: #047857; margin-bottom: 12px; }
          .card-number { font-size: 32px; font-weight: 800; color: #0F172A; letter-spacing: 2px; margin-bottom: 12px; font-family: 'Plus Jakarta Sans', monospace; white-space: nowrap; }
          .copy-btn { display: inline-flex; align-items: center; gap: 6px; background: #F1F5F9; border: 1px solid #E2E8F0; color: #475569; font-size: 13px; font-weight: 700; cursor: pointer; padding: 8px 16px; border-radius: 10px; transition: all 0.2s; font-family: inherit; }
          .copy-btn:hover { background: #E2E8F0; color: #0F172A; }
          
          .receiver-box { display: flex; align-items: center; gap: 16px; background: #F8FAFC; border: 1px solid #F1F5F9; padding: 20px 24px; border-radius: 16px; margin-top: 24px; }
          .receiver-icon { width: 44px; height: 44px; border-radius: 50%; border: 1px solid #CBD5E1; display: flex; align-items: center; justify-content: center; color: #64748B; background: #FFF; flex-shrink: 0; }
          .receiver-name { font-size: 15px; font-weight: 700; color: #0F172A; margin: 0; }
          .receiver-label { font-size: 12px; color: #64748B; margin: 0 0 4px 0; font-weight: 600; }

          .form-title { font-size: 22px; font-weight: 800; color: #0F172A; margin-bottom: 32px; display: flex; align-items: center; gap: 12px; }
          .form-icon { width: 44px; height: 44px; background: #D1FAE5; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #047857; }
          
          .plan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
          .plan-btn { padding: 12px 10px; border-radius: 16px; border: 2px solid #D1FAE5; cursor: pointer; text-align: center; transition: all 0.2s; background: #FFFFFF; color: #475569; font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: center; line-height: 1.2;}
          .plan-btn.active { border-color: #10B981; background: #ECFDF5; color: #047857; }
          
          .input-label { display: block; font-size: 13px; font-weight: 700; color: #047857; margin-bottom: 8px; }
          .input-box { background: #E6FFFA; border: 1px solid #A7F3D0; padding: 16px; border-radius: 16px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
          .input-box input { border: none; background: transparent; width: 100%; font-size: 15px; font-weight: 600; color: #047857; outline: none; font-family: inherit; }
          
          .upload-box { border: 2px dashed #6EE7B7; border-radius: 20px; padding: 40px; text-align: center; cursor: pointer; background: rgba(255,255,255,0.6); transition: all 0.2s; margin-bottom: 32px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
          .upload-box:hover { border-color: #10B981; background: #ECFDF5; }
          .upload-box.has-file { border-color: #10B981; background: #D1FAE5; border-style: solid; }
          
          .submit-btn { width: 100%; background: #10B981; color: #FFF; border: none; padding: 20px; border-radius: 16px; font-weight: 800; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s; box-shadow: 0 10px 25px rgba(16,185,129,0.3); font-family: inherit; }
          .submit-btn.free { background: #0F172A; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.2); }
          .submit-btn:hover { transform: translateY(-2px); }
          .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }

          .logout-btn { position: absolute; top: 40px; right: 6vw; background: transparent; border: none; padding: 10px 16px; color: #64748B; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; border-radius: 12px; font-family: inherit; z-index: 50;}
          .logout-btn:hover { color: #0F172A; background: #E2E8F0; }

          /* Мобільна адаптація */
          @media (max-width: 1024px) {
            .payment-wrapper-full { display: block; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }
            .payment-split-box { flex-direction: column; height: auto; min-height: 100vh; overflow: visible; width: 100%; }
            .split-left, .split-right { width: 100%; padding: 32px 20px; border: none; box-sizing: border-box; overflow: visible; }
            .split-right { padding-bottom: 60px; }
            .header-bar { position: relative; top: 0; left: 0; right: 0; margin-bottom: 32px; width: 100%; display: flex; box-sizing: border-box; }
            .logout-btn { position: relative; top: 0; right: 0; margin: 0 0 32px 0; width: 100%; display: flex; justify-content: center; background: #F1F5F9; border-radius: 14px; box-sizing: border-box; }
            .mobile-hide { display: none !important; }
            .main-heading { font-size: 28px; line-height: 1.2; word-wrap: break-word; }
            .sub-heading { font-size: 14px; padding: 0; }
            .card-box { padding: 20px; flex-direction: column; align-items: flex-start; gap: 20px; word-wrap: break-word; box-sizing: border-box; }
            .card-top { flex-direction: column; gap: 16px; width: 100%; }
            .card-number { font-size: 24px; white-space: normal; letter-spacing: 1px; word-break: break-all; }
            .receiver-box { width: 100%; padding: 16px; box-sizing: border-box; }
            .form-box { padding: 20px; box-sizing: border-box; }
            .plan-grid { grid-template-columns: 1fr; gap: 8px; }
            .plan-btn { padding: 14px; font-size: 14px; }
            .upload-box { padding: 24px 16px; }
          }
        `}</style>
        
        <div className="payment-split-box">
          <div className="split-left">
            <div className="header-bar">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", background: "#047857", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BarChart2 color="#FFF" size={20} />
                </div>
                <div>
                  <h1 style={{ fontWeight: "800", fontSize: "16px", color: "#0F172A", margin: 0, lineHeight: 1.2 }}>Price Drop</h1>
                  <p style={{ fontSize: "11px", color: "#64748B", margin: 0, fontWeight: "600" }}>Business CRM</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F0FDF4", color: "#047857", padding: "8px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                <ShieldCheck size={16} /> <span className="mobile-hide">Безпечно та надійно</span>
              </div>
            </div>

            <div className="left-center">
              <div className="check-icon"><Check size={36} color="#FFF" strokeWidth={3} /></div>
              <h2 className="main-heading">Час обрати тариф!</h2>
              <p className="sub-heading">Ваш пробний період завершено. Ви можете обрати платний тариф для необмежених можливостей, або залишитись на безкоштовному (до 20 проданих речей на місяць).</p>
              
              <div className="card-box">
                <div className="card-top">
                  <div className="card-icon"><CreditCard size={32} color="#10B981" /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span className="card-label">Реквізити для оплати</span>
                    <div className="card-brand">Price Drop</div>
                    <div className="card-number">5355 2800 6269 8194</div>
                    <button onClick={copyCardToClipboard} className="copy-btn"><Copy size={14} /> Скопіювати номер картки</button>
                  </div>
                </div>
                <div className="receiver-box">
                  <div className="receiver-icon"><User size={20} /></div>
                  <div><p className="receiver-label">Отримувач</p><p className="receiver-name">Петриляк Давид</p></div>
                </div>
              </div>
            </div>
          </div>

          <div className="split-right">
            <button onClick={handleLogout} className="logout-btn"><LogOut size={16} /> Вийти з акаунту</button>
            
            <div className="right-center">
              <h3 className="form-title">
                <div className="form-icon"><Send size={20} style={{ transform: "rotate(-15deg) translateY(-1px) translateX(-1px)" }} /></div>
                Підтвердження
              </h3>

              {receiptSent ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <CheckCircle size={72} color="#10B981" style={{ margin: "0 auto 20px auto" }} />
                  <p style={{ fontSize: "24px", fontWeight: "800", color: "#047857", margin: "0 0 12px 0" }}>Квитанцію надіслано!</p>
                  <p style={{ fontSize: "16px", color: "#065F46", lineHeight: "1.6" }}>Ми перевіримо оплату і розблокуємо доступ протягом кількох годин.</p>
                </div>
              ) : (
                <form onSubmit={handleSendReceiptToTelegram}>
                  <label className="input-label">Оберіть потрібний тариф</label>
                  <div className="plan-grid">
                    <div onClick={() => setSelectedPaymentPlan("Малий бізнес ($0/міс)")} className={`plan-btn ${selectedPaymentPlan === "Малий бізнес ($0/міс)" ? "active" : ""}`}>Малий бізнес<br/>($0 / міс)</div>
                    <div onClick={() => setSelectedPaymentPlan("Pro ($5/міс)")} className={`plan-btn ${selectedPaymentPlan === "Pro ($5/міс)" ? "active" : ""}`}>Pro<br/>($5 / міс)</div>
                    <div onClick={() => setSelectedPaymentPlan("Business ($8/міс)")} className={`plan-btn ${selectedPaymentPlan === "Business ($8/міс)" ? "active" : ""}`}>Business<br/>($8 / міс)</div>
                  </div>

                  {selectedPaymentPlan === "Малий бізнес ($0/міс)" ? (
                    <div style={{ marginTop: "32px" }}>
                      <div style={{ backgroundColor: "#F1F5F9", padding: "20px", borderRadius: "16px", border: "1px solid #E2E8F0", marginBottom: "24px" }}>
                        <h4 style={{ margin: "0 0 8px 0", color: "#0F172A", fontSize: "15px", fontWeight: 800 }}>Безкоштовний тариф</h4>
                        <p style={{ fontSize: "14px", color: "#64748B", margin: 0, lineHeight: 1.5 }}>Ви можете продовжити користуватися системою безкоштовно. Ліміт: <b style={{ color: "#0F172A" }}>20 проданих речей</b> на поточний місяць. Квитанція про оплату не потрібна.</p>
                      </div>
                      <button type="button" onClick={handleConfirmFreePlan} className="submit-btn free">
                         Перейти на Безкоштовний <ArrowRight size={22} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "8px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", height: "100%" }}>
                          <label className="input-label">Ваша пошта</label>
                          <div className="input-box" style={{ margin: "0", flex: 1, padding: "0 16px" }}>
                            <Mail size={16} color="#047857" style={{ flexShrink: 0 }} />
                            <input type="text" readOnly value={userEmail} />
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", height: "100%" }}>
                          <label className="input-label">Скріншот квитанції</label>
                          <div className={`upload-box ${receiptFile ? 'has-file' : ''}`} onClick={() => receiptInputRef.current?.click()} style={{ padding: "12px", margin: "0", flex: 1 }}>
                            {receiptFile ? (
                              <div style={{ color: "#047857", fontWeight: "800", fontSize: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", textAlign: "center" }}><CheckCircle size={20}/> {receiptFile.name}</div>
                            ) : (
                              <div style={{ color: "#047857", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "100%" }}>
                                <UploadCloud size={20} style={{ color: "#10B981" }} />
                                <span style={{ fontSize: "12px", fontWeight: "700" }}>Додати фото</span>
                              </div>
                            )}
                            <input ref={receiptInputRef} type="file" accept="image/*" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} style={{ display: "none" }} />
                          </div>
                        </div>
                      </div>

                      <button type="submit" disabled={isSendingReceipt || !receiptFile} className="submit-btn" style={{ marginTop: "24px" }}>
                         {isSendingReceipt ? <Loader2 size={24} className="animate-spin" /> : <Send size={22} style={{ transform: "rotate(-15deg) translateY(-2px)" }} />}
                         {isSendingReceipt ? "Відправка..." : "Надіслати квитанцію"} <ArrowRight size={22} />
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ЗВИЧАЙНИЙ РЕНДЕР ДАШБОРДУ
  // ==========================================
  const visibleSales = userRole === "employee" ? sales.filter(s => s.employee_name === userEmail) : sales;
  const visibleExpenses = userRole === "employee" ? [] : expenses;

  const filteredSales = visibleSales.filter(s => {
    if (!s.created_at) return true;
    if (filterMode === "month") return s.created_at.slice(0, 7) === selectedMonth;
    if (filterMode === "date") return s.created_at.slice(0, 10) === selectedDate;
    return true;
  });
  
  const filteredExpenses = visibleExpenses.filter(e => {
    if (!e.created_at) return true;
    if (filterMode === "month") return e.created_at.slice(0, 7) === selectedMonth;
    if (filterMode === "date") return e.created_at.slice(0, 10) === selectedDate;
    return true;
  });

  let totalTurnover = 0;
  let totalExpenses = filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  let totalGrossProfit = 0;

  filteredSales.forEach(s => {
    if (s.status === "Отримано") {
      totalTurnover += Number(s.total_price || 0);
      totalGrossProfit += (s.profit !== undefined ? s.profit : (Number(s.total_price) - Number(s.cost_price)));
    } else if (s.status === "В дорозі" || s.status === "Відмова") {
      totalTurnover += Number(s.prepayment || 0);
      totalGrossProfit += Number(s.prepayment || 0);
    }
  });

  const netProfit = totalGrossProfit - totalExpenses;
  const totalItemsSold = filteredSales.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
  const totalInventoryRetail = products.reduce((acc, p) => acc + (p.price * (p.quantity || 0)), 0);
  const totalInventoryCost = products.reduce((acc, p) => acc + ((p.cost_price || 0) * (p.quantity || 0)), 0);

  const chartPoints = (() => {
    const pts = [];
    const daysOfWeekFull = ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayLabel = daysOfWeekFull[d.getDay()];
      
      const sForDay = visibleSales.filter(s => s.created_at.startsWith(dateStr));
      const eForDay = visibleExpenses.filter(e => e.created_at.startsWith(dateStr));
      
      const dayProfit = sForDay.reduce((acc, curr) => {
        if (curr.status === "Отримано") return acc + (curr.profit !== undefined ? curr.profit : (Number(curr.total_price || 0) - Number(curr.cost_price || 0)));
        return acc + Number(curr.prepayment || 0);
      }, 0) - eForDay.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
      
      pts.push({ label: dayLabel, date: d.getDate(), val: dayProfit > 0 ? dayProfit : 0 });
    }
    return pts;
  })();

  const allVals = chartPoints.map(p => p.val); 
  const maxVal = Math.max(...allVals, 100); 
  
  const allMenuItems = [ 
    { name: "Головна", icon: Home }, { name: "Склад", icon: Package }, 
    { name: "Продажі", icon: ShoppingCart }, { name: "Витрати", icon: CreditCard }, 
    { name: "Звіти", icon: BarChart2 }, { name: "Співробітники", icon: Briefcase }, 
    { name: "Клієнти", icon: Users }, { name: "Постачальники", icon: Truck }, 
    { name: "Аналітика", icon: PieChart }, { name: "Налаштування", icon: Settings },
    { name: "Підтримка", icon: Headset }
  ];

  if (userEmail === SUPER_ADMIN_EMAIL) {
    allMenuItems.splice(10, 0, { name: "Супер-Адмін", icon: Shield }); 
  }

  const menuItems = userRole === "employee" 
    ? allMenuItems.filter(item => ["Головна", "Склад", "Продажі", "Клієнти", "Аналітика", "Налаштування", "Підтримка"].includes(item.name)) 
    : allMenuItems;

  if (loading) return <div style={{ display: "flex", height: "100vh", backgroundColor: "#F8FAFC", alignItems: "center", justifyItems: "center" }}><Loader2 className="animate-spin text-teal-600 w-8 h-8 mx-auto" /></div>;

  const selectedProduct = products.find(p => p.id === saleForm.product_id);

  return (
    <div className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .app-container { display: flex; min-height: 100vh; background-color: #F8FAFC; color: #0F172A; font-family: 'Inter', system-ui, -apple-system, sans-serif; overflow-x: hidden; position: relative; }
        
        .sidebar { width: 240px; background-color: #FFFFFF; border-right: 1px solid #E2E8F0; display: flex; flex-direction: column; justify-content: space-between; padding: 16px; flex-shrink: 0; transition: transform 0.3s ease; z-index: 40; }
        .main-content { flex: 1; display: flex; flex-direction: column; overflow-x: hidden; width: 100%; position: relative; }
        .header { height: 72px; background-color: #FFFFFF; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; position: sticky; top: 0; z-index: 10; }
        .page-container { padding: 24px 28px; display: flex; flex-direction: column; gap: 24px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .grid-2-asym { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
        .grid-1 { display: grid; grid-template-columns: 1fr; gap: 16px; }
        .card { background-color: #FFFFFF; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); padding: 24px; border: 1px solid #F1F5F9; }
        
        /* ЗАБЛОКОВАНІ ВІД СКРОЛУ МОДАЛКИ (Фіксовані) */
        .modal-overlay-fixed { position: fixed; inset: 0; background-color: rgba(15,23,42,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 16px; overflow: hidden; }
        .modal-box-fixed { background-color: #FFF; border-radius: 24px; width: 100%; max-width: 560px; padding: 32px 36px; max-height: 90vh; overflow-y: auto; overflow-x: hidden; box-shadow: 0 24px 48px rgba(0,0,0,0.08); box-sizing: border-box; }
        
        .table-responsive { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        
        .table-row { border-bottom: 1px solid #F8FAFC; }
        .table-cell { padding: 16px 12px; vertical-align: middle; }
        .table-head-cell { border-bottom: 2px solid #F1F5F9; font-weight: 600; color: #64748B; padding: 12px; }
        
        .menu-toggle { display: none; background: transparent; border: none; cursor: pointer; color: #0F172A; padding: 4px; }
        .mobile-overlay { display: none; }
        .bottom-nav { display: none; }
        
        .header-controls { display: flex; align-items: center; gap: 12px; }
        .styled-date-input { padding: 10px 14px; border-radius: 12px; border: 1px solid #E2E8F0; font-size: 14px; font-weight: 700; color: #0F172A; background-color: #FFF; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .styled-date-input:hover { border-color: #1A9682; }

        .desktop-nowrap { white-space: nowrap; }

        @media (max-width: 1024px) { .grid-4 { grid-template-columns: repeat(2, 1fr); } .grid-2-asym { grid-template-columns: 1fr; } }
        
        /* МОБІЛЬНА АДАПТАЦІЯ */
        @media (max-width: 768px) {
          .app-container { overflow-x: hidden; }
          .sidebar { position: fixed; height: 100vh; transform: translateX(-100%); } .sidebar.open { transform: translateX(0); }
          .mobile-overlay.open { display: block; position: fixed; inset: 0; background: rgba(15,23,42,0.4); backdrop-filter: blur(2px); z-index: 30; }
          .menu-toggle { display: block; } 
          
          .header { padding: 0 16px; height: 60px; } 
          .header h2 { font-size: 16px !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 130px; }
          .header-controls { gap: 6px !important; justify-content: flex-end; }
          .header-select-wrapper { min-width: 80px !important; width: 85px !important; flex-shrink: 1; }
          .header-select-trigger { padding: 6px 10px !important; font-size: 11px !important; border-radius: 8px !important; }
          .styled-date-input { padding: 6px 10px !important; font-size: 11px !important; min-width: 85px !important; border-radius: 8px !important; height: auto !important; flex-shrink: 1; }
          .desktop-nowrap { max-width: 60px; display: inline-block; overflow: hidden; text-overflow: ellipsis; vertical-align: middle; }
          .styled-date-input svg { width: 14px !important; height: 14px !important; }
          
          .page-container { padding: 16px; gap: 16px; padding-bottom: 100px; }
          .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }
          .bottom-nav { display: flex; justify-content: space-around; align-items: center; position: fixed; bottom: 0; left: 0; right: 0; height: 80px; background: #FFFFFF; box-shadow: 0 -4px 20px rgba(0,0,0,0.05); z-index: 50; padding-bottom: env(safe-area-inset-bottom); border-top-left-radius: 24px; border-top-right-radius: 24px; }
          .nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; border: none; background: transparent; color: #94A3B8; font-size: 10px; font-weight: 600; cursor: pointer; padding: 8px; } .nav-item.active { color: #0D9488; }
          .add-btn-wrapper { position: relative; top: -20px; } .add-btn { width: 56px; height: 56px; border-radius: 50%; background: #0D9488; border: 4px solid #F8FAFC; display: flex; justify-content: center; align-items: center; box-shadow: 0 8px 16px rgba(13, 148, 136, 0.3); cursor: pointer; color: white; }
          .card { padding: 16px; border-radius: 16px; }
          .modal-box-fixed { padding: 20px !important; }
        }
        @media print {
          .print-modal { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; background: white !important; box-shadow: none !important; border: none !important; max-width: 100% !important; padding: 0 !important; }
          .hide-on-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
      
      <div className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

      <aside className={`sidebar hide-on-print ${isMobileMenuOpen ? 'open' : ''}`}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", marginBottom: "20px" }}>
            <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.15)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M13 10L10 14h4l-3 4"></path></svg>
            </div>
            <div>
              <h1 style={{ fontWeight: "800", fontSize: "16px", lineHeight: "1.2" }}>Price Drop</h1>
              <p style={{ fontSize: "12px", color: "#64748B", fontWeight: "500" }}>{businessName}</p>
            </div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {menuItems.map((item) => {
              const Icon = item.icon; const isActive = activeTab === item.name;
              return (
                <button key={item.name} onClick={() => { setActiveTab(item.name); setIsMobileMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "10px 14px", borderRadius: "12px", fontSize: "14px", fontWeight: isActive ? "700" : "500", border: "none", cursor: "pointer", backgroundColor: isActive ? "#F0FDFA" : "transparent", color: isActive ? "#0D9488" : "#475569", textAlign: "left" }}>
                  <Icon style={{ width: "18px", height: "18px", color: isActive ? "#0D9488" : "#64748B" }} /><span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#F8FAFC", borderRadius: "12px" }}>
            <div style={{ width: "36px", height: "36px", backgroundColor: "#0F172A", color: "#FFFFFF", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "bold" }}>{userRole === "employee" ? "EM" : "PD"}</div>
            <div style={{ flex: 1, overflow: "hidden" }}><p style={{ fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>{userEmail}</p><p style={{ fontSize: "11px", color: "#64748B", margin: 0 }}>{userRole === "employee" ? "Менеджер" : "Адміністратор"}</p></div>
          </div>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "10px 14px", borderRadius: "12px", fontSize: "13px", fontWeight: "600", color: "#EF4444", backgroundColor: "transparent", border: "none", cursor: "pointer" }}>
            <LogOut style={{ width: "16px", height: "16px" }} /><span>Вийти</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header hide-on-print">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(true)}><Menu size={24} /></button>
            <h2 style={{ fontSize: "22px", fontWeight: "800", margin: 0 }}>{activeTab}</h2>
          </div>
          
          <div className="header-controls">
            <CustomSelect 
              value={filterMode} onChange={(val: any) => setFilterMode(val)} 
              options={[ {value: "month", label: "За місяць"}, {value: "date", label: "За день"} ]}
              wrapperClassName="header-select-wrapper"
              triggerClassName="header-select-trigger"
              triggerStyle={{ padding: "10px 14px", borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "14px", fontWeight: 700, color: "#0F172A", backgroundColor: "#FFF", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}
              dropdownStyle={{ right: 0, left: "auto", minWidth: "160px" }}
            />
            <CustomCalendar mode={filterMode} value={filterMode === "month" ? selectedMonth : selectedDate} onChange={(val: string) => filterMode === "month" ? setSelectedMonth(val) : setSelectedDate(val)} />
          </div>
        </header>

        <div className={`page-container print-container ${selectedClientForDetails ? "hide-on-print" : ""}`}>
          
          {/* СУПЕР-АДМІН (ВЛАСНИК CRM) */}
          {activeTab === "Супер-Адмін" && userRole === "owner" && (
            <div className="card">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px", gap: "8px", textAlign: "center" }}>
                <div>
                  <h3 style={{ fontSize: "22px", fontWeight: "800", margin: "0 0 4px 0", color: "#0F172A" }}>Керування підписками</h3>
                  <p style={{ fontSize: "14px", color: "#64748B", fontWeight: "600", margin: 0 }}>(Ви власник CRM додатку)</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#F8FAFC", padding: "10px 16px", borderRadius: "12px", border: "1px solid #E2E8F0", width: "100%", maxWidth: "400px", marginTop: "8px" }}>
                  <Search size={18} color="#94A3B8" />
                  <input 
                    type="text" 
                    placeholder="Пошук за email..." 
                    value={adminSearch} 
                    onChange={e => setAdminSearch(e.target.value)}
                    style={{ border: "none", background: "transparent", outline: "none", fontSize: "14px", width: "100%", fontWeight: "500", color: "#0F172A" }}
                  />
                </div>
              </div>
              
              <div className="grid-3" style={{ marginBottom: "32px" }}>
                 <div style={{ padding: "20px", backgroundColor: "#F8FAFC", borderRadius: "16px", border: "1px solid #F1F5F9" }}>
                    <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "6px", fontWeight: "600" }}>Всього клієнтів</p>
                    <p style={{ fontSize: "28px", color: "#0F172A", fontWeight: "800", margin: 0 }}>{crmUsersList.length}</p>
                 </div>
                 <div style={{ padding: "20px", backgroundColor: "#ECFDF5", borderRadius: "16px", border: "1px solid #A7F3D0" }}>
                    <p style={{ fontSize: "13px", color: "#065F46", marginBottom: "6px", fontWeight: "600" }}>На Пробному / Безкоштовному</p>
                    <p style={{ fontSize: "28px", color: "#047857", fontWeight: "800", margin: 0 }}>{crmUsersList.filter(u => u.plan.includes("Безкоштовно") || u.plan.includes("Пробний") || u.plan.includes("Малий")).length}</p>
                 </div>
                 <div style={{ padding: "20px", backgroundColor: "#EFF6FF", borderRadius: "16px", border: "1px solid #BFDBFE" }}>
                    <p style={{ fontSize: "13px", color: "#1E3A8A", marginBottom: "6px", fontWeight: "600" }}>На Платному (Pro/Business)</p>
                    <p style={{ fontSize: "28px", color: "#1D4ED8", fontWeight: "800", margin: 0 }}>{crmUsersList.filter(u => u.plan.includes("Pro") || u.plan.includes("Business")).length}</p>
                 </div>
              </div>

              <div className="table-responsive">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "600px" }}>
                  <thead>
                    <tr>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Email клієнта</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Дата реєстрації</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Дні у системі</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Керування Тарифом</th>
                      <th className="table-head-cell" style={{ textAlign: "center" }}>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crmUsersList.filter(u => u.email.toLowerCase().includes(adminSearch.toLowerCase())).map(u => {
                      const days = Math.floor((new Date().getTime() - new Date(u.created_at).getTime()) / (1000 * 3600 * 24));
                      const isPaid = u.plan.includes("Pro") || u.plan.includes("Business") || u.plan.includes("Безліміт");
                      const isExpired = days >= 30;
                      return (
                        <tr key={u.id} className="table-row">
                          <td className="table-cell" style={{ fontWeight: "700", color: "#0F172A" }}>{u.email}</td>
                          <td className="table-cell" style={{ color: "#64748B", fontWeight: "500" }}>{new Date(u.created_at).toLocaleDateString('uk-UA')}</td>
                          <td className="table-cell" style={{ fontWeight: "800", color: isExpired && !isPaid ? "#EF4444" : "#10B981" }}>{Math.max(0, days)} днів</td>
                          <td className="table-cell">
                            <select 
                              value={u.plan} 
                              onChange={(e) => handleChangeUserPlan(u.id, e.target.value)}
                              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", fontWeight: "700", backgroundColor: isPaid ? "#DBEAFE" : "#F1F5F9", color: isPaid ? "#1D4ED8" : "#475569", cursor: "pointer", outline: "none" }}
                            >
                              <option value="Пробний період">Пробний період (30 днів)</option>
                              <option value="Малий бізнес">Малий бізнес (Безкошт)</option>
                              <option value="Pro">Pro ($5)</option>
                              <option value="Business">Business ($8)</option>
                              <option value="Безліміт (Супер-Адмін)">Безліміт (Супер-Адмін)</option>
                            </select>
                          </td>
                          <td className="table-cell" style={{ textAlign: "center" }}>
                            <button onClick={() => handleDeleteCrmUser(u.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#EF4444", padding: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center" }} title="Видалити клієнта">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ГОЛОВНА СТОРІНКА */}
          {activeTab === "Головна" && (
            <>
              <div className={userRole === "owner" ? "grid-4" : "grid-2"}>
                <div className="card" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", margin: 0 }}>{userRole === "owner" ? "Чистий прибуток" : "Мій чистий прибуток"}</p>
                    <h3 style={{ fontSize: "28px", fontWeight: "800", margin: "6px 0 4px 0", lineHeight: "1.2" }}><FormatMoney amount={netProfit} /></h3>
                    <div style={{ color: netProfit >= 0 ? "#10B981" : "#EF4444", fontSize: "12px", fontWeight: "600" }}>{filterMode === 'month' ? selectedMonth : selectedDate}</div>
                  </div>
                  <div style={{ width: "48px", height: "48px", backgroundColor: "#ECFDF5", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}><Wallet size={24} /></div>
                </div>
                <div className="card" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", margin: 0 }}>{userRole === "owner" ? "Оборот (в касі)" : "Мій Оборот"}</p>
                    <h3 style={{ fontSize: "28px", fontWeight: "800", margin: "6px 0 4px 0", lineHeight: "1.2" }}><FormatMoney amount={totalTurnover} /></h3>
                    <div style={{ color: "#3B82F6", fontSize: "12px", fontWeight: "600" }}>{filteredSales.length} продажів</div>
                  </div>
                  <div style={{ width: "48px", height: "48px", backgroundColor: "#EFF6FF", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#3B82F6" }}><TrendingUp size={24} /></div>
                </div>
                {userRole === "owner" && (
                  <div className="card" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", margin: 0 }}>Витрати</p>
                      <h3 style={{ fontSize: "28px", fontWeight: "800", margin: "6px 0 4px 0", lineHeight: "1.2" }}><FormatMoney amount={totalExpenses} /></h3>
                      <div style={{ color: "#EF4444", fontSize: "12px", fontWeight: "600" }}>{filteredExpenses.length} записів</div>
                    </div>
                    <div style={{ width: "48px", height: "48px", backgroundColor: "#FEF2F2", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444" }}><CreditCard size={24} /></div>
                  </div>
                )}
                <div className="card" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", margin: 0 }}>Товарів на складі</p>
                    <h3 style={{ fontSize: "28px", fontWeight: "800", color: "#0F172A", margin: "6px 0 4px 0", lineHeight: "1.2" }}><FormatNumber num={products.reduce((a, b) => a + (Number(b.quantity) || 0), 0)} /> <span style={{ fontSize: "16px", fontWeight: "600", color: "#64748B" }}>шт.</span></h3>
                    <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0, fontWeight: "500" }}>{products.length} позицій</p>
                  </div>
                  <div style={{ width: "48px", height: "48px", backgroundColor: "#F5F3FF", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#8B5CF6" }}><Package size={24} /></div>
                </div>
              </div>

              <div className={userRole === "owner" ? "grid-2-asym" : "grid-1"}>
                {userRole === "owner" && (
                  <div className="card" style={{ overflow: "hidden", padding: 0 }}>
                    <div style={{ padding: "24px 24px 0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <div>
                        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A", margin: 0 }}>Динаміка прибутку</h3>
                        <p style={{ fontSize: "13px", color: "#64748B", fontWeight: "500", marginTop: "4px" }}>За останні 7 днів</p>
                      </div>
                    </div>
                    
                    <div style={{ width: "100%", height: "240px", position: "relative" }}>
                      <svg viewBox="0 0 500 240" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                        <defs>
                          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34D399" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.15" floodColor="#059669"/>
                          </filter>
                        </defs>

                        <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="5" />
                        <line x1="0" y1="90" x2="500" y2="90" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="5" />
                        <line x1="0" y1="140" x2="500" y2="140" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="5" />
                        <line x1="0" y1="190" x2="500" y2="190" stroke="#E2E8F0" strokeWidth="2" />
                        
                        {chartPoints.map((pt, idx) => {
                          const barWidth = 36;
                          const gap = (500 - (7 * barWidth)) / 8;
                          const chartYBottom = 190;
                          const maxBarHeight = 140;
                          const barH = maxVal > 0 ? (pt.val / maxVal) * maxBarHeight : 0;
                          
                          const x = gap + idx * (barWidth + gap);
                          const y = chartYBottom - barH;

                          return (
                            <g key={idx}>
                              <rect x={x} y={y} width={barWidth} height={barH} rx="6" fill="url(#barGrad)" filter="url(#glow)" />
                              <text x={x + barWidth/2} y={chartYBottom + 20} textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="700">{pt.label}</text>
                              <text x={x + barWidth/2} y={chartYBottom + 36} textAnchor="middle" fill="#94A3B8" fontSize="10">{pt.date}</text>
                              {pt.val > 0 && (
                                <text x={x + barWidth/2} y={y - 8} textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="800">{pt.val.toLocaleString('uk-UA')}</text>
                              )}
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                )}
                
                <div className="card">
                  <h3 style={{ fontSize: "16px", fontWeight: "800", margin: "0 0 16px 0" }}>Швидкі дії</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <button onClick={() => setIsSaleModalOpen(true)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderRadius: "14px", border: "none", backgroundColor: "#1A9682", color: "#FFF", cursor: "pointer", fontWeight: "700", fontSize: "14px", boxShadow: "0 4px 12px rgba(26, 150, 130, 0.2)" }}><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><ShoppingCart size={20} /> Провести продажу</span><Plus size={20} /></button>
                    {userRole === "owner" && (
                      <button onClick={() => setIsProductModalOpen(true)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderRadius: "14px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", cursor: "pointer", fontWeight: "600", fontSize: "14px", color: "#0F172A" }}><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Package size={20} color="#1A9682" /> Додати товар</span><Plus size={20} color="#94A3B8" /></button>
                    )}
                    {userRole === "owner" && (
                      <button onClick={() => setIsExpenseModalOpen(true)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderRadius: "14px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", cursor: "pointer", fontWeight: "600", fontSize: "14px", color: "#0F172A" }}><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><CreditCard size={20} color="#F59E0B" /> Внести витрату</span><Plus size={20} color="#94A3B8" /></button>
                    )}
                  </div>
                </div>
              </div>

              <div className={userRole === "owner" ? "grid-2 mt-4" : "grid-1 mt-4"} style={{ marginTop: "16px" }}>
                <div className="card">
                  <h3 style={{ fontSize: "16px", fontWeight: "800", margin: "0 0 16px 0", color: "#0F172A" }}>Останні продажі</h3>
                  <div className="table-responsive">
                    <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                      <tbody>
                        {filteredSales.length === 0 && <tr><td style={{ color: "#94A3B8" }}>Немає продажів</td></tr>}
                        {filteredSales.slice(0, 5).map(s => (
                          <tr key={s.id} className="table-row">
                            <td className="table-cell" style={{ padding: "12px 0" }}>
                              <span style={{ fontWeight: 700, color: "#0F172A" }}>{s.product_name}</span> {s.selected_size ? <span style={{color: "#94A3B8"}}>({s.selected_size})</span> : ""}
                              <br/><span style={{ color: "#64748B", fontSize: "11px" }}>{s.customer_name || "Роздріб"}</span>
                            </td>
                            <td className="table-cell" style={{ textAlign: "right", fontWeight: 800, color: "#0F172A" }}>
                              <FormatMoney amount={s.total_price} />
                              <br/><span style={{ fontSize: "11px", color: "#10B981" }}>{new Date(s.created_at).toLocaleDateString('uk-UA')}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {userRole === "owner" && (
                  <div className="card">
                    <h3 style={{ fontSize: "16px", fontWeight: "800", margin: "0 0 16px 0", color: "#0F172A" }}>Останні витрати</h3>
                    <div className="table-responsive">
                      <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                        <tbody>
                          {filteredExpenses.length === 0 && <tr><td style={{ color: "#94A3B8" }}>Немає витрат</td></tr>}
                          {filteredExpenses.slice(0, 5).map(e => (
                            <tr key={e.id} className="table-row">
                              <td className="table-cell" style={{ padding: "12px 0" }}>
                                <span style={{ fontWeight: 700, color: "#0F172A" }}>{e.description}</span>
                                <br/><span style={{ color: "#64748B", fontSize: "11px" }}>{e.category}</span>
                              </td>
                              <td className="table-cell" style={{ textAlign: "right", fontWeight: 800, color: "#EF4444" }}>
                                -<FormatMoney amount={e.amount} />
                                <br/><span style={{ fontSize: "11px", color: "#94A3B8" }}>{new Date(e.created_at).toLocaleDateString('uk-UA')}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* СКЛАД */}
          {activeTab === "Склад" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className={userRole === "owner" ? "grid-3" : "grid-1"}>
                <div className="card">
                  <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", margin: 0 }}>Загальна кількість товарів</p>
                  <h3 style={{ fontSize: "28px", fontWeight: "800", color: "#0F172A", margin: "6px 0 0 0" }}><FormatNumber num={products.reduce((a, b) => a + (Number(b.quantity) || 0), 0)} /> <span style={{ fontSize: "14px", color: "#64748B" }}>шт.</span></h3>
                </div>
                {userRole === "owner" && (
                  <>
                    <div className="card">
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", margin: 0 }}>Вартість за продажною ціною</p>
                      <h3 style={{ fontSize: "28px", fontWeight: "800", color: "#0F172A", margin: "6px 0 0 0" }}><FormatMoney amount={totalInventoryRetail} /></h3>
                    </div>
                    <div className="card">
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", margin: 0 }}>Вартість за собівартістю</p>
                      <h3 style={{ fontSize: "28px", fontWeight: "800", color: "#3B82F6", margin: "6px 0 0 0" }}><FormatMoney amount={totalInventoryCost} /></h3>
                    </div>
                  </>
                )}
              </div>

              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <div><h3 style={{ fontSize: "18px", fontWeight: "800", margin: 0 }}>Асортимент</h3></div>
                  {userRole === "owner" && (
                    <button onClick={() => setIsProductModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0D9488", color: "#FFFFFF", border: "none", padding: "10px 16px", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(13, 148, 136, 0.2)" }}>
                      <Plus size={18} /><span>Додати</span>
                    </button>
                  )}
                </div>
                <div className="table-responsive">
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "600px" }}>
                    <thead>
                      <tr>
                        <th className="table-head-cell" style={{ textAlign: "left" }}>Фото</th>
                        <th className="table-head-cell" style={{ textAlign: "left" }}>Назва</th>
                        <th className="table-head-cell" style={{ textAlign: "left" }}>Ціна</th>
                        {userRole === "owner" && <th className="table-head-cell" style={{ textAlign: "left" }}>Собівартість</th>}
                        <th className="table-head-cell" style={{ textAlign: "left" }}>Розміри / Залишок</th>
                        {userRole === "owner" && <th className="table-head-cell" style={{ textAlign: "right" }}>Дії</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod) => (
                        <tr key={prod.id} className="table-row">
                          <td className="table-cell">{prod.image_url ? <img src={prod.image_url} style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "10px" }} /> : <div style={{ width: "48px", height: "48px", backgroundColor: "#F1F5F9", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><ImageIcon size={20} color="#94A3B8" /></div>}</td>
                          <td className="table-cell" style={{ fontWeight: "700", color: "#0F172A" }}>{prod.name}</td>
                          <td className="table-cell" style={{ fontWeight: "700" }}><FormatMoney amount={prod.price} /></td>
                          {userRole === "owner" && <td className="table-cell" style={{ color: "#64748B", fontWeight: "600" }}><FormatMoney amount={prod.cost_price || 0} /></td>}
                          <td className="table-cell">
                            {prod.type === "clothing" ? (
                              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "6px" }}>
                                {Object.entries(prod.sizes || {}).filter(([_, count]) => count > 0).map(([size, count]) => <span key={size} style={{ fontSize: "11px", padding: "4px 8px", borderRadius: "6px", backgroundColor: "#F1F5F9", color: "#475569", fontWeight: "700" }}>{size}: {String(count)}</span>)}
                              </div>
                            ) : null}
                            <div style={{ fontWeight: "800", color: "#0D9488" }}><FormatNumber num={prod.quantity} /> шт.</div>
                          </td>
                          {userRole === "owner" && (
                            <td className="table-cell" style={{ textAlign: "right" }}>
                              <button onClick={() => handleDeleteProduct(prod.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#EF4444", padding: "8px" }}><Trash2 size={18} /></button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ПРОДАЖІ */}
          {activeTab === "Продажі" && (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 24px 0" }}>Журнал продажів</h3>
                <button onClick={() => setIsSaleModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#1A9682", color: "#FFFFFF", border: "none", padding: "10px 16px", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(26, 150, 130, 0.2)" }}><Plus size={18} /><span>Продати</span></button>
              </div>
              <div className="table-responsive">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "700px" }}>
                  <thead>
                    <tr>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Клієнт / Статус</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Товар</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>ТТН / Дата</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Сума</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Дії зі статусом</th>
                      <th className="table-head-cell" style={{ textAlign: "right" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map((s) => (
                      <tr key={s.id} className="table-row">
                        <td className="table-cell">
                          <p style={{ fontWeight: "700", color: "#0F172A", margin: "0 0 6px 0" }}>{s.customer_name || "Роздрібний покупець"}</p>
                          <span style={{ fontSize: "11px", fontWeight: "700", padding: "4px 8px", borderRadius: "6px", backgroundColor: s.status === 'Отримано' ? '#ECFDF5' : s.status === 'Відмова' ? '#FEF2F2' : '#FFFBEB', color: s.status === 'Отримано' ? '#059669' : s.status === 'Відмова' ? '#DC2626' : '#D97706' }}>
                            {s.status}
                          </span>
                        </td>
                        <td className="table-cell"><span style={{ fontWeight: "700", color: "#0F172A" }}>{s.product_name}</span> {s.selected_size ? <span style={{ color: "#64748B", fontWeight: "600" }}>({s.selected_size})</span> : ""}<br/><span style={{ fontSize: "12px", color: "#0D9488", fontWeight: "700" }}>{s.quantity || 1} шт.</span></td>
                        <td className="table-cell">
                          {s.ttn ? <span style={{ fontFamily: "monospace", backgroundColor: "#F1F5F9", padding: "4px 8px", borderRadius: "6px", fontWeight: "600", color: "#0F172A" }}>{s.ttn}</span> : <span style={{ color: "#94A3B8" }}>—</span>}
                          <br/><span style={{ fontSize: "12px", color: "#64748B", fontWeight: "500", marginTop: "4px", display: "inline-block" }}>{new Date(s.created_at).toLocaleDateString('uk-UA')}</span>
                        </td>
                        <td className="table-cell">
                          <p style={{ margin: 0, fontWeight: "800", fontSize: "15px", color: "#0F172A" }}><FormatMoney amount={s.total_price} /></p>
                          {s.prepayment > 0 && <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#0D9488", fontWeight: "600" }}>Перед: <FormatMoney amount={s.prepayment} /></p>}
                        </td>
                        <td className="table-cell">
                          {s.status === 'В дорозі' && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                              <button onClick={() => handleUpdateSaleStatus(s, "Отримано")} style={{ border: "none", backgroundColor: "#10B981", color: "#FFF", padding: "8px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "700" }}><CheckCircle size={16}/> Отримано</button>
                              <button onClick={() => handleUpdateSaleStatus(s, "Відмова")} style={{ border: "none", backgroundColor: "#EF4444", color: "#FFF", padding: "8px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "700" }}><XCircle size={16}/> Відмова</button>
                            </div>
                          )}
                        </td>
                        <td className="table-cell" style={{ textAlign: "right" }}>
                          {userRole === "owner" && (
                            <button onClick={() => handleDeleteSale(s.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#EF4444", padding: "8px" }}><Trash2 size={18} /></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ВИТРАТИ */}
          {activeTab === "Витрати" && userRole === "owner" && (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 24px 0" }}>Всі витрати</h3>
                <button onClick={() => setIsExpenseModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0D9488", color: "#FFFFFF", border: "none", padding: "10px 16px", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}><Plus size={18} /><span>Внести</span></button>
              </div>
              <div className="table-responsive">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "400px" }}>
                  <thead>
                    <tr>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Дата</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Опис</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Категорія</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Сума</th>
                      <th className="table-head-cell" style={{ textAlign: "right" }}>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="table-row">
                        <td className="table-cell" style={{ color: "#64748B", fontWeight: "500" }}>{new Date(exp.created_at).toLocaleDateString('uk-UA')}</td>
                        <td className="table-cell" style={{ fontWeight: "700", color: "#0F172A" }}>{exp.description}</td>
                        <td className="table-cell" style={{ color: "#64748B", fontWeight: "500" }}>{exp.category}</td>
                        <td className="table-cell" style={{ color: "#EF4444", fontWeight: "800" }}>-<FormatMoney amount={exp.amount} /></td>
                        <td className="table-cell" style={{ textAlign: "right" }}>
                          <button onClick={() => handleDeleteExpense(exp.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#EF4444", padding: "8px" }}><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ЗВІТИ */}
          {activeTab === "Звіти" && userRole === "owner" && (
            <div className="card">
              <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "800", margin: 0 }}>Підсумки: {filterMode === 'month' ? selectedMonth : selectedDate}</h3>
                <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0F172A", color: "#FFFFFF", border: "none", padding: "10px 16px", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}><Printer size={18} /><span>PDF Звіт</span></button>
              </div>
              
              <div className="grid-4" style={{ marginBottom: "32px" }}>
                <div style={{ padding: "20px", backgroundColor: "#F8FAFC", borderRadius: "16px", border: "1px solid #F1F5F9" }}>
                  <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "6px", fontWeight: "600" }}>Оборот</p><p style={{ fontSize: "28px", color: "#3B82F6", fontWeight: "800", margin: 0 }}><FormatMoney amount={totalTurnover} /></p>
                </div>
                <div style={{ padding: "20px", backgroundColor: "#F8FAFC", borderRadius: "16px", border: "1px solid #F1F5F9" }}>
                  <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "6px", fontWeight: "600" }}>Продано одиниць</p><p style={{ fontSize: "28px", color: "#8B5CF6", fontWeight: "800", margin: 0 }}><FormatNumber num={totalItemsSold} /> <span style={{ fontSize: "16px", fontWeight: "600" }}>шт.</span></p>
                </div>
                <div style={{ padding: "20px", backgroundColor: "#F8FAFC", borderRadius: "16px", border: "1px solid #F1F5F9" }}>
                  <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "6px", fontWeight: "600" }}>Витрати</p><p style={{ fontSize: "28px", color: "#EF4444", fontWeight: "800", margin: 0 }}><FormatMoney amount={totalExpenses} /></p>
                </div>
                <div style={{ padding: "20px", backgroundColor: "#F8FAFC", borderRadius: "16px", border: "1px solid #F1F5F9" }}>
                  <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "6px", fontWeight: "600" }}>Чистий результат</p><p style={{ fontSize: "28px", color: netProfit >= 0 ? "#10B981" : "#EF4444", fontWeight: "800", margin: 0 }}><FormatMoney amount={netProfit} /></p>
                </div>
              </div>

              <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0F172A", marginBottom: "16px", marginTop: "32px", borderTop: "1px solid #F1F5F9", paddingTop: "24px" }}>Деталізація проданих товарів</h4>
              <div className="table-responsive">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "700px" }}>
                  <thead>
                    <tr>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Дата продажу</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Назва товару</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Дані клієнта / ТТН</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Кількість</th>
                      <th className="table-head-cell" style={{ textAlign: "right" }}>Сума продажу</th>
                      <th className="table-head-cell" style={{ textAlign: "right" }}>Чистий дохід</th> 
                      <th className="table-head-cell no-print" style={{ textAlign: "right" }}>Дії</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "#94A3B8", paddingTop: "20px" }}>Немає проданих товарів за цей період</td></tr>}
                    {filteredSales.map(s => {
                      const itemProfit = s.profit !== undefined ? s.profit : (Number(s.total_price) - Number(s.cost_price));
                      return (
                        <tr key={s.id} className="table-row">
                          <td className="table-cell" style={{ color: "#64748B", fontWeight: "600" }}>{new Date(s.created_at).toLocaleDateString('uk-UA')}</td>
                          <td className="table-cell" style={{ fontWeight: "700", color: "#0F172A" }}>{s.product_name} {s.selected_size ? <span style={{ color: "#94A3B8" }}>({s.selected_size})</span> : ""}</td>
                          <td className="table-cell">
                            <p style={{ fontWeight: "700", margin: "0 0 4px 0", color: "#0F172A" }}>{s.customer_name || "Роздрібний покупець"}</p>
                            <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "600", backgroundColor: "#F1F5F9", padding: "4px 8px", borderRadius: "6px" }}>
                              {s.ttn ? `ТТН: ${s.ttn}` : "Оплата без ТТН"}
                            </span>
                          </td>
                          <td className="table-cell" style={{ fontWeight: "700", color: "#0D9488" }}>{s.quantity} шт.</td>
                          <td className="table-cell" style={{ fontWeight: "800", color: "#0F172A", textAlign: "right" }}><FormatMoney amount={s.total_price} /></td>
                          <td className="table-cell" style={{ fontWeight: "800", color: itemProfit >= 0 ? "#10B981" : "#EF4444", textAlign: "right" }}><FormatMoney amount={itemProfit} showSign={true}/></td>
                          <td className="table-cell no-print" style={{ textAlign: "right" }}>
                            <button onClick={() => handleDeleteSale(s.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#EF4444", padding: "8px" }} title="Видалити продаж"><Trash2 size={18} /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* СПІВРОБІТНИКИ */}
          {activeTab === "Співробітники" && userRole === "owner" && (
            <div className="card">
              <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "800", margin: 0 }}>Команда та Аналітика</h3>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0F172A", color: "#FFFFFF", border: "none", padding: "10px 16px", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}><Printer size={18} /><span>PDF Звіт</span></button>
                  <button onClick={() => setIsEmployeeModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0D9488", color: "#FFFFFF", border: "none", padding: "10px 16px", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}><Plus size={18} /><span>Додати</span></button>
                </div>
              </div>
              
              <div style={{ display: "none" }} className="print:block mb-6">
                <h2 style={{ fontSize: "24px", fontWeight: "800" }}>Звіт по співробітниках</h2>
                <p style={{ color: "#64748B" }}>Створено: {new Date().toLocaleDateString('uk-UA')}</p>
              </div>
              <div className="table-responsive">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "600px" }}>
                  <thead>
                    <tr>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>ПІБ / Роль</th>
                      <th className="table-head-cell no-print" style={{ textAlign: "left" }}>Доступ</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Кількість та продані товари</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Оборот</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Прибуток</th>
                      <th className="table-head-cell no-print" style={{ textAlign: "center" }}>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => {
                      const empSales = sales.filter(s => s.employee_name === emp.email || s.employee_name === emp.name);
                      const empTurnover = empSales.reduce((acc, s) => acc + (s.status === 'Отримано' ? Number(s.total_price) : Number(s.prepayment)), 0);
                      const empProfit = empSales.reduce((acc, s) => acc + (s.status === 'Отримано' ? (s.profit !== undefined ? s.profit : (Number(s.total_price) - Number(s.cost_price))) : Number(s.prepayment)), 0);
                      
                      const soldItemsMap: Record<string, number> = {};
                      empSales.forEach(s => {
                        soldItemsMap[s.product_name] = (soldItemsMap[s.product_name] || 0) + s.quantity;
                      });
                      const soldItemsList = Object.entries(soldItemsMap).map(([name, qty]) => `${name} (${qty} шт)`).join(', ');
                      
                      return (
                        <tr key={emp.id} className="table-row">
                          <td className="table-cell" style={{ verticalAlign: "top" }}>
                            <span style={{ fontWeight: "700", color: "#0F172A", display: "block" }}>{emp.name}</span>
                            <span style={{ fontSize: "11px", backgroundColor: "#F1F5F9", padding: "4px 8px", borderRadius: "6px", color: "#475569", fontWeight: "700", marginTop: "6px", display: "inline-block" }}>{emp.role}</span>
                          </td>
                          <td className="table-cell no-print" style={{ color: "#64748B", fontSize: "12px", verticalAlign: "top" }}>Л: <b style={{ color: "#0F172A" }}>{emp.email || "—"}</b><br/>П: <b style={{ color: "#0F172A" }}>{emp.password || "—"}</b></td>
                          <td className="table-cell" style={{ verticalAlign: "top" }}>
                            <div style={{ fontWeight: "800", color: "#0F172A" }}>Всього {empSales.length} продажів</div>
                            <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px", lineHeight: "1.4", maxWidth: "250px" }}>
                              {soldItemsList || "Ще немає продажів"}
                            </div>
                          </td>
                          <td className="table-cell" style={{ color: "#3B82F6", fontWeight: "800", verticalAlign: "top" }}><FormatMoney amount={empTurnover} /></td>
                          <td className="table-cell" style={{ color: "#10B981", fontWeight: "800", verticalAlign: "top" }}><FormatMoney amount={empProfit} /></td>
                          <td className="table-cell no-print" style={{ textAlign: "center", verticalAlign: "top" }}>
                            <button onClick={() => handleDeleteEmployee(emp.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#EF4444", padding: "8px" }}>
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* КЛІЄНТИ ТА АКТ ЗВІРКИ (ІСТОРІЯ) */}
          {activeTab === "Клієнти" && (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 24px 0" }}>База клієнтів</h3>
                <button onClick={() => setIsClientModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0D9488", color: "#FFFFFF", border: "none", padding: "10px 16px", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}><Plus size={18} /><span>Додати</span></button>
              </div>
              <div className="table-responsive">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "400px" }}>
                  <thead>
                    <tr>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Ім’я клієнта</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Телефон</th>
                      <th className="table-head-cell no-print" style={{ textAlign: "left" }}>Статистика</th>
                      {userRole === "owner" && (
                        <th className="table-head-cell no-print" style={{ textAlign: "right" }}>Дії</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((cli) => {
                      const clientSales = sales.filter(s => s.customer_name === cli.name);
                      const totalC = clientSales.reduce((acc, s) => acc + (s.status === 'Отримано' ? Number(s.total_price) : Number(s.prepayment)), 0);
                      
                      return (
                        <tr key={cli.id} className="table-row">
                          <td className="table-cell" style={{ fontWeight: "700", color: "#0F172A" }}>{cli.name}</td>
                          <td className="table-cell" style={{ color: "#64748B", fontWeight: "600" }}>{cli.phone}</td>
                          <td className="table-cell no-print" style={{ color: "#64748B", fontSize: "12px" }}>
                            Замовлень: <b style={{ color: "#0F172A" }}>{clientSales.length}</b><br/>
                            Оборот: <b style={{ color: "#3B82F6" }}><FormatMoney amount={totalC} /></b>
                          </td>
                          {userRole === "owner" && (
                            <td className="table-cell no-print" style={{ textAlign: "right" }}>
                              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "8px" }}>
                                <button onClick={() => setSelectedClientForDetails(cli)} style={{ border: "none", background: "#EFF6FF", color: "#3B82F6", padding: "8px 12px", borderRadius: "8px", fontWeight: 700, fontSize: "12px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "4px" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#DBEAFE"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#EFF6FF"}>
                                  <FileText size={14} /> Історія
                                </button>
                                <button onClick={() => handleDeleteClient(cli.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#EF4444", padding: "8px", display: "flex", alignItems: "center" }}><Trash2 size={18} /></button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ПОСТАЧАЛЬНИКИ */}
          {activeTab === "Постачальники" && userRole === "owner" && (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 24px 0" }}>Постачальники</h3>
                <button onClick={() => setIsSupplierModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0D9488", color: "#FFFFFF", border: "none", padding: "10px 16px", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}><Plus size={18} /><span>Додати</span></button>
              </div>
              <div className="table-responsive">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "400px" }}>
                  <thead>
                    <tr>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Компанія / Особа</th>
                      <th className="table-head-cell" style={{ textAlign: "left" }}>Контакт</th>
                      <th className="table-head-cell" style={{ textAlign: "right" }}>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((sup) => (
                      <tr key={sup.id} className="table-row">
                        <td className="table-cell" style={{ fontWeight: "700", color: "#0F172A" }}>{sup.name}</td>
                        <td className="table-cell" style={{ color: "#64748B", fontWeight: "600" }}>{sup.contact}</td>
                        <td className="table-cell" style={{ textAlign: "right" }}>
                          <button onClick={() => handleDeleteSupplier(sup.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#EF4444", padding: "8px" }}>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* АНАЛІТИКА */}
          {activeTab === "Аналітика" && (
            <div className="card">
              <h3 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 24px 0" }}>
                {userRole === "employee" ? "Моя аналітика продажів" : "Загальна аналітика"}
              </h3>
              <div className="grid-2">
                <div style={{ padding: "20px", backgroundColor: "#F8FAFC", borderRadius: "16px", border: "1px solid #F1F5F9" }}>
                  <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "6px", fontWeight: "600" }}>Середній чек</p>
                  <p style={{ fontSize: "28px", color: "#0F172A", fontWeight: "800", margin: 0 }}><FormatMoney amount={filteredSales.length > 0 ? (totalTurnover / filteredSales.length) : 0} /></p>
                </div>
                <div style={{ padding: "20px", backgroundColor: "#F8FAFC", borderRadius: "16px", border: "1px solid #F1F5F9" }}>
                  <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "6px", fontWeight: "600" }}>Маржинальність</p>
                  <p style={{ fontSize: "28px", color: netProfit >= 0 ? "#10B981" : "#EF4444", fontWeight: "800", margin: 0 }}>
                    {totalTurnover > 0 ? ((totalGrossProfit / totalTurnover) * 100).toFixed(1) : "0"}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* НАЛАШТУВАННЯ */}
          {activeTab === "Налаштування" && (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", margin: 0 }}>Профіль та Налаштування</h3>
                
                {userRole === "owner" && (
                  <button onClick={() => setIsTrialExpired(true)} style={{ backgroundColor: "#F1F5F9", border: "1px solid #E2E8F0", padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: "700", color: "#475569", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#E2E8F0"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#F1F5F9"}>
                    Тестувати екран оплати
                  </button>
                )}
              </div>

              <div className="grid-2">
                <div style={{ backgroundColor: "#F8FAFC", padding: "24px", borderRadius: "20px", border: "1px solid #F1F5F9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                    <div style={{ width: "48px", height: "48px", backgroundColor: "#E2E8F0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}><User size={24} /></div>
                    <div>
                      <p style={{ fontSize: "12px", color: "#64748B", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px 0" }}>Акаунт</p>
                      <p style={{ fontSize: "16px", fontWeight: "800", color: "#0F172A", margin: 0 }}>{userEmail}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                    Рівень доступу: <span style={{ color: "#0D9488", backgroundColor: "#F0FDFA", padding: "4px 10px", borderRadius: "8px" }}>{userRole === "employee" ? "Менеджер (Співробітник)" : "Власник бізнесу"}</span>
                  </div>
                </div>

                {userRole === "owner" && (
                  <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "20px", border: "1px solid #A7F3D0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                      <div style={{ width: "48px", height: "48px", backgroundColor: "#D1FAE5", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#047857" }}><ShieldCheck size={24} /></div>
                      <div>
                        <p style={{ fontSize: "12px", color: "#065F46", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px 0" }}>Поточний тариф</p>
                        <p style={{ fontSize: "20px", fontWeight: "800", color: "#047857", margin: 0 }}>{userPlan}</p>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #A7F3D0", paddingTop: "16px" }}>
                      <div>
                        <p style={{ fontSize: "12px", color: "#065F46", fontWeight: "600", margin: "0 0 4px 0" }}>Наступна оплата:</p>
                        <p style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", margin: 0 }}>{paymentDateStr}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "12px", color: "#065F46", fontWeight: "600", margin: "0 0 4px 0" }}>Залишилось:</p>
                        <p style={{ fontSize: "15px", fontWeight: "800", color: daysToPay <= 3 && userPlan.includes("Пробний") ? "#EF4444" : "#059669", margin: 0 }}>
                          {daysToPay === 999 ? "Назавжди" : (daysToPay > 0 ? `${daysToPay} днів` : "Час вийшов")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ПІДТРИМКА */}
          {activeTab === "Підтримка" && (
            <div className="card" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", padding: "40px 20px" }}>
              <div style={{ width: "64px", height: "64px", backgroundColor: "#ECFDF5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px auto" }}>
                <Headset size={32} color="#10B981" />
              </div>
              <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#0F172A", margin: "0 0 12px 0" }}>Служба підтримки</h3>
              <p style={{ fontSize: "15px", color: "#64748B", marginBottom: "32px", lineHeight: "1.5" }}>
                Виникли питання чи проблеми з роботою CRM? Зв'яжіться з нами, і ми допоможемо все вирішити!
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <a href="tel:+380983651622" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", padding: "16px", borderRadius: "16px", color: "#0F172A", textDecoration: "none", fontWeight: "700", fontSize: "16px", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F1F5F9"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#F8FAFC"}>
                  <Phone size={20} color="#3B82F6" /> +38 098 365 16 22
                </a>
                
                <a href="https://t.me/davyd.petryliak" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", backgroundColor: "#F0FDF4", border: "1px solid #A7F3D0", padding: "16px", borderRadius: "16px", color: "#047857", textDecoration: "none", fontWeight: "700", fontSize: "16px", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#D1FAE5"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#F0FDF4"}>
                  <Send size={20} color="#10B981" /> Написати в Telegram
                </a>
              </div>
            </div>
          )}

        </div>
      </main>

      <div className="bottom-nav no-print">
        <button onClick={() => setActiveTab("Головна")} className={`nav-item ${activeTab === "Головна" ? "active" : ""}`}>
          <Home size={22} /><span>Головна</span>
        </button>
        <button onClick={() => setActiveTab("Склад")} className={`nav-item ${activeTab === "Склад" ? "active" : ""}`}>
          <Package size={22} /><span>Склад</span>
        </button>
        <div className="add-btn-wrapper">
          <button className="add-btn" onClick={() => setIsSaleModalOpen(true)}>
            <Plus size={28} />
          </button>
        </div>
        <button onClick={() => setActiveTab("Продажі")} className={`nav-item ${activeTab === "Продажі" ? "active" : ""}`}>
          <ShoppingCart size={22} /><span>Продажі</span>
        </button>
        <button onClick={() => setActiveTab("Звіти")} className={`nav-item ${activeTab === "Звіти" ? "active" : ""}`}>
          <PieChart size={22} /><span>Звіти</span>
        </button>
      </div>

      {/* УСІ МОДАЛЬНІ ВІКНА (ДОДАВАННЯ ТОВАРУ, ПРОДАЖУ, ВИТРАТ ТОЩО) ТУТ */}
      {isProductModalOpen && (
        <div className="modal-overlay-fixed">
          <div className="modal-box-fixed">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "800", margin: 0 }}>Новий товар</h3>
              <button onClick={() => setIsProductModalOpen(false)} style={{ border: "none", backgroundColor: "#F1F5F9", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px", display: "block" }}>Тип товару</label>
                <CustomSelect 
                  value={productForm.type} 
                  onChange={(val: any) => setProductForm({ ...productForm, type: val as "clothing" | "simple" })} 
                  options={[ {value: "clothing", label: "Одяг (з розмірами S, M, L)"}, {value: "simple", label: "Простий товар (Кава, аксесуари)"} ]}
                  triggerStyle={{ padding: "14px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "14px", fontWeight: "600", width: "100%", backgroundColor: "#F8FAFC" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px", display: "block" }}>Фото товару</label>
                <div onClick={() => fileInputRef.current?.click()} style={{ border: "2px dashed #CBD5E1", borderRadius: "16px", padding: "24px", textAlign: "center", cursor: "pointer", backgroundColor: "#F8FAFC", transition: "all 0.2s" }}>
                  {imagePreview ? <img src={imagePreview} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "12px", margin: "0 auto" }} /> : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#64748B" }}><ImageIcon size={32} color="#0D9488" style={{ marginBottom: "8px" }} /><span style={{ fontSize: "13px", fontWeight: "600" }}>Обрати фотографію</span></div>}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                </div>
              </div>
              <input required type="text" placeholder="Назва товару" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} style={{ padding: "14px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "14px", width: "100%" }} />
              <input required type="number" placeholder="Ціна продажу (₴)" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} style={{ padding: "14px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "14px", width: "100%" }} />
              <input type="number" placeholder="Собівартість закупки (₴)" value={productForm.costPrice} onChange={e => setProductForm({...productForm, costPrice: e.target.value})} style={{ padding: "14px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "14px", width: "100%" }} />
              
              {productForm.type === "clothing" ? (
                <div style={{ backgroundColor: "#F8FAFC", padding: "16px", borderRadius: "16px", border: "1px solid #F1F5F9" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "12px", display: "block" }}>Залишки по розмірах</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                    {["S", "M", "L", "XL", "XXL"].map((sz) => (
                      <div key={sz} style={{ textAlign: "center" }}>
                        <span style={{ fontSize: "12px", fontWeight: "800", color: "#0F172A", display: "block", marginBottom: "6px" }}>{sz}</span>
                        <input type="number" min="0" value={productForm.sizes[sz] || ""} onChange={e => setProductForm({...productForm, sizes: {...productForm.sizes, [sz]: e.target.value}})} style={{ width: "100%", padding: "10px 4px", borderRadius: "8px", border: "1px solid #CBD5E1", textAlign: "center", fontWeight: "600" }} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <input required type="number" placeholder="Загальна кількість на складі" value={productForm.simpleQuantity} onChange={e => setProductForm({...productForm, simpleQuantity: e.target.value})} style={{ padding: "14px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "14px", width: "100%" }} />
              )}
              
              <button type="submit" style={{ width: "100%", backgroundColor: "#0D9488", color: "#FFF", border: "none", padding: "16px", borderRadius: "12px", fontWeight: "800", fontSize: "15px", cursor: "pointer", marginTop: "8px", boxShadow: "0 4px 12px rgba(13, 148, 136, 0.2)" }}>Зберегти товар</button>
            </form>
          </div>
        </div>
      )}

      {isSaleModalOpen && (
        <div className="modal-overlay-fixed">
          <div className="modal-box-fixed">
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "16px", backgroundColor: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ShoppingCart size={24} color="#1A9682" />
                </div>
                <div>
                  <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#0F172A", margin: "0 0 4px 0" }}>Провести продаж</h3>
                  <p style={{ fontSize: "14px", color: "#64748B", margin: 0, fontWeight: "500" }}>Оберіть спосіб оплати</p>
                </div>
              </div>
              <button onClick={() => setIsSaleModalOpen(false)} style={{ border: "none", backgroundColor: "#F1F5F9", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B", transition: "all 0.2s", flexShrink: 0 }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveSale}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div onClick={() => setSaleForm({...saleForm, payment_type: "full"})} style={{ border: saleForm.payment_type === "full" ? "2px solid #1A9682" : "1px solid #E2E8F0", borderRadius: "16px", padding: "16px", cursor: "pointer", position: "relative", backgroundColor: saleForm.payment_type === "full" ? "#F2FBF9" : "#FFF", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px", transition: "all 0.2s" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: saleForm.payment_type === "full" ? "#D1FAE5" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CreditCard size={20} color={saleForm.payment_type === "full" ? "#1A9682" : "#64748B"} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "14px", color: "#0F172A", marginBottom: "4px", whiteSpace: "nowrap" }}>Повна оплата</div>
                    <div style={{ fontSize: "11px", color: "#64748B", lineHeight: "1.3" }}>Оплата одразу, без комісій</div>
                  </div>
                  <div style={{ position: "absolute", top: "12px", right: "12px", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: saleForm.payment_type === "full" ? "#1A9682" : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {saleForm.payment_type === "full" && <Check size={12} color="#FFF" />}
                  </div>
                </div>

                <div onClick={() => setSaleForm({...saleForm, payment_type: "cod"})} style={{ border: saleForm.payment_type === "cod" ? "2px solid #1A9682" : "1px solid #E2E8F0", borderRadius: "16px", padding: "16px", cursor: "pointer", position: "relative", backgroundColor: saleForm.payment_type === "cod" ? "#F2FBF9" : "#FFF", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px", transition: "all 0.2s" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: saleForm.payment_type === "cod" ? "#D1FAE5" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Package size={20} color={saleForm.payment_type === "cod" ? "#1A9682" : "#64748B"} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "14px", color: "#0F172A", marginBottom: "4px", whiteSpace: "nowrap" }}>Накладений платіж</div>
                    <div style={{ fontSize: "11px", color: "#64748B", lineHeight: "1.3" }}>Оплата при отриманні</div>
                  </div>
                  <div style={{ position: "absolute", top: "12px", right: "12px", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: saleForm.payment_type === "cod" ? "#1A9682" : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {saleForm.payment_type === "cod" && <Check size={12} color="#FFF" />}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
                
                <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#FFF" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Package size={20} color="#64748B" /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Товар</label>
                    <CustomSelect 
                      value={saleForm.product_id}
                      onChange={(val: any) => handleSelectProductForSale(val)}
                      options={products.map(p => ({ value: p.id, label: `${p.name} (В наявності: ${p.quantity})` }))}
                      placeholder="Оберіть товар зі складу"
                      triggerStyle={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", width: "100%", padding: 0 }}
                    />
                  </div>
                </div>

                {selectedProduct && selectedProduct.type === "clothing" && (
                  <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#FFF" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Hash size={20} color="#64748B" /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Розмір</label>
                      <CustomSelect 
                        value={saleForm.selected_size}
                        onChange={(val: any) => handleSaleQuantityOrSizeChange(saleForm.quantity, val)}
                        options={Object.entries(selectedProduct.sizes || {}).filter(([_, count]) => count > 0).map(([sz, cnt]) => ({ value: sz, label: `${sz} (В наявності: ${String(cnt)} шт.)` }))}
                        placeholder="Оберіть розмір"
                        triggerStyle={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", width: "100%", padding: 0 }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#FFF" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><User size={20} color="#64748B" /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Клієнт / Покупець</label>
                    <CustomSelect 
                      value={saleForm.customer_type} 
                      onChange={(val: any) => setSaleForm({...saleForm, customer_type: val, customer_name: ""})} 
                      options={[
                        { value: "Роздрібний покупець", label: "Роздрібний покупець" },
                        { value: "З бази клієнтів", label: "Обрати з бази клієнтів" },
                        { value: "Новий покупець", label: "Ввести ім'я вручну" }
                      ]}
                      triggerStyle={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", width: "100%", padding: 0 }}
                    />
                  </div>
                </div>

                {saleForm.customer_type === "З бази клієнтів" && (
                  <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#FFF" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <CustomSelect 
                        value={saleForm.customer_name}
                        onChange={(val: any) => setSaleForm({...saleForm, customer_name: val})}
                        options={clients.map(c => ({ value: c.name, label: `${c.name} (${c.phone})` }))}
                        placeholder="-- Оберіть клієнта зі списку --"
                        triggerStyle={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", width: "100%", padding: 0 }}
                      />
                    </div>
                  </div>
                )}

                {saleForm.customer_type === "Новий покупець" && (
                  <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#FFF" }}>
                    <input required type="text" placeholder="Введіть ПІБ клієнта" value={saleForm.customer_name} onChange={e => setSaleForm({...saleForm, customer_name: e.target.value})} style={{ width: "100%", border: "none", background: "transparent", outline: "none", fontSize: "15px", fontWeight: 700, color: "#0F172A", padding: 0 }} />
                  </div>
                )}

                {saleForm.payment_type === "cod" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div style={{ border: "1px solid #1A9682", borderRadius: "16px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#F2FBF9" }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#1A9682", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Передоплата (₴)</label>
                        <input required type="number" min="0" value={saleForm.prepayment} onChange={e => setSaleForm({...saleForm, prepayment: e.target.value})} style={{ width: "100%", border: "none", background: "transparent", outline: "none", fontSize: "16px", fontWeight: 800, color: "#0F172A", padding: 0 }} />
                      </div>
                    </div>
                    <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#FFF" }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Номер ТТН</label>
                        <input required type="text" placeholder="2045..." value={saleForm.ttn} onChange={e => setSaleForm({...saleForm, ttn: e.target.value})} style={{ width: "100%", border: "none", background: "transparent", outline: "none", fontSize: "16px", fontWeight: 700, color: "#0F172A", padding: 0 }} />
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#FFF" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Hash size={20} color="#64748B" /></div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Кількість</label>
                      <input required type="number" min="1" value={saleForm.quantity} onChange={e => handleSaleQuantityOrSizeChange(e.target.value)} style={{ width: "100%", border: "none", background: "transparent", outline: "none", fontSize: "16px", fontWeight: 800, color: "#0F172A", padding: 0 }} />
                    </div>
                  </div>
                  
                  <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#FFF" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Coins size={20} color="#64748B" /></div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Загальна сума (₴)</label>
                      <input required type="number" value={saleForm.total_price} onChange={e => setSaleForm({...saleForm, total_price: e.target.value})} style={{ width: "100%", border: "none", background: "transparent", outline: "none", fontSize: "16px", fontWeight: 800, color: "#0F172A", padding: 0 }} />
                    </div>
                  </div>
                </div>

              </div>
              
              <button type="submit" style={{ width: "100%", backgroundColor: "#1A9682", color: "#FFF", border: "none", padding: "18px", borderRadius: "16px", fontWeight: "800", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 10px 25px rgba(26,150,130,0.25)", transition: "all 0.2s" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#FFF", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={16} color="#1A9682" /></div>
                Завершити продаж <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      {isExpenseModalOpen && (
        <div className="modal-overlay-fixed">
          <div className="modal-box-fixed">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "800", margin: 0 }}>Внести витрату</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} style={{ border: "none", backgroundColor: "#F1F5F9", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveExpense} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <input required type="date" value={expenseForm.created_at} onChange={e => setExpenseForm({...expenseForm, created_at: e.target.value})} style={{ padding: "14px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "14px", width: "100%", color: "#0F172A", fontWeight: "600" }} />
              <input required type="text" placeholder="Опис (Реклама, Оренда, Пакування)" value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} style={{ padding: "14px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "14px", width: "100%" }} />
              <input required type="number" placeholder="Сума (₴)" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} style={{ padding: "14px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "14px", width: "100%", fontWeight: "600", color: "#EF4444" }} />
              <button type="submit" style={{ width: "100%", backgroundColor: "#F59E0B", color: "#FFF", border: "none", padding: "16px", borderRadius: "12px", fontWeight: "800", fontSize: "15px", cursor: "pointer", marginTop: "8px", boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)" }}>Зберегти витрату</button>
            </form>
          </div>
        </div>
      )}

      {isEmployeeModalOpen && (
        <div className="modal-overlay-fixed">
          <div className="modal-box-fixed">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "800", margin: 0 }}>Новий співробітник</h3>
              <button onClick={() => setIsEmployeeModalOpen(false)} style={{ border: "none", backgroundColor: "#F1F5F9", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveEmployee} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <input required type="text" placeholder="ПІБ" value={employeeForm.name} onChange={e => setEmployeeForm({...employeeForm, name: e.target.value})} style={{ padding: "14px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "14px", width: "100%" }} />
              <input required type="text" placeholder="Посада (напр. Менеджер з продажів)" value={employeeForm.role} onChange={e => setEmployeeForm({...employeeForm, role: e.target.value})} style={{ padding: "14px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "14px", width: "100%" }} />
              <input required type="email" placeholder="Email (Для входу в кабінет)" value={employeeForm.email} onChange={e => setEmployeeForm({...employeeForm, email: e.target.value})} style={{ padding: "14px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "14px", width: "100%" }} />
              <input required type="text" placeholder="Створити пароль" value={employeeForm.password} onChange={e => setEmployeeForm({...employeeForm, password: e.target.value})} style={{ padding: "14px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "14px", width: "100%" }} />
              <button type="submit" style={{ width: "100%", backgroundColor: "#0D9488", color: "#FFF", border: "none", padding: "16px", borderRadius: "12px", fontWeight: "800", fontSize: "15px", cursor: "pointer", marginTop: "8px", boxShadow: "0 4px 12px rgba(13, 148, 136, 0.3)" }}>Створити акаунт</button>
            </form>
          </div>
        </div>
      )}

      {isClientModalOpen && (
        <div className="modal-overlay-fixed">
          <div className="modal-box-fixed">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "800", margin: "0 0 24px 0" }}>Додати клієнта</h3>
              <button onClick={() => setIsClientModalOpen(false)} style={{ border: "none", backgroundColor: "#F1F5F9", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveClient} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <input required type="text" placeholder="Ім'я клієнта" value={clientForm.name} onChange={e => setClientForm({...clientForm, name: e.target.value})} style={{ padding: "14px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "14px", width: "100%" }} />
              <input type="text" placeholder="Телефон" value={clientForm.phone} onChange={e => setClientForm({...clientForm, phone: e.target.value})} style={{ padding: "14px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "14px", width: "100%" }} />
              <button type="submit" style={{ width: "100%", backgroundColor: "#0D9488", color: "#FFF", border: "none", padding: "16px", borderRadius: "12px", fontWeight: "800", fontSize: "15px", cursor: "pointer", marginTop: "8px", boxShadow: "0 4px 12px rgba(13, 148, 136, 0.3)" }}>Зберегти</button>
            </form>
          </div>
        </div>
      )}

      {selectedClientForDetails && (
        <div className="modal-overlay-fixed" style={{ zIndex: 1000 }}>
          <div className="modal-box-fixed print-modal" style={{ maxWidth: "800px" }}>
            
            <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#3B82F6" }}>
                  <User size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#0F172A", margin: "0 0 4px 0" }}>Картка клієнта: {selectedClientForDetails.name}</h3>
                  <p style={{ fontSize: "13px", color: "#64748B", margin: 0, fontWeight: "500" }}>{selectedClientForDetails.phone || "Телефон не вказано"}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0F172A", color: "#FFFFFF", border: "none", padding: "8px 14px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}><Printer size={16} /><span>PDF Виписка</span></button>
                <button onClick={() => setSelectedClientForDetails(null)} style={{ border: "none", backgroundColor: "#F1F5F9", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}><X size={20} /></button>
              </div>
            </div>

            <div style={{ display: "none" }} className="print:block mb-6">
              <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "4px" }}>Акт звірки / Історія замовлень</h2>
              <p style={{ color: "#0F172A", fontSize: "16px", fontWeight: 700 }}>Клієнт: {selectedClientForDetails.name} ({selectedClientForDetails.phone})</p>
              <p style={{ color: "#64748B", fontSize: "12px", marginTop: "4px" }}>Створено: {new Date().toLocaleDateString('uk-UA')}</p>
            </div>

            {(() => {
              const clientSales = sales.filter(s => s.customer_name === selectedClientForDetails.name);
              const totalTurnover = clientSales.reduce((acc, s) => acc + (s.status === 'Отримано' ? Number(s.total_price) : Number(s.prepayment)), 0);
              const totalProfit = clientSales.reduce((acc, s) => acc + (s.status === 'Отримано' ? (s.profit !== undefined ? s.profit : (Number(s.total_price) - Number(s.cost_price))) : Number(s.prepayment)), 0);
              const totalItems = clientSales.reduce((acc, s) => acc + Number(s.quantity), 0);

              return (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
                    <div style={{ padding: "16px", backgroundColor: "#F8FAFC", borderRadius: "16px", border: "1px solid #F1F5F9" }}>
                      <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "4px", fontWeight: "600" }}>Взято товарів</p>
                      <p style={{ fontSize: "24px", color: "#0F172A", fontWeight: "800", margin: 0 }}>{totalItems} шт.</p>
                    </div>
                    <div style={{ padding: "16px", backgroundColor: "#F8FAFC", borderRadius: "16px", border: "1px solid #F1F5F9" }}>
                      <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "4px", fontWeight: "600" }}>Оборот по клієнту</p>
                      <p style={{ fontSize: "24px", color: "#3B82F6", fontWeight: "800", margin: 0 }}><FormatMoney amount={totalTurnover} /></p>
                    </div>
                    <div style={{ padding: "16px", backgroundColor: "#F8FAFC", borderRadius: "16px", border: "1px solid #F1F5F9" }}>
                      <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "4px", fontWeight: "600" }}>Чистий дохід</p>
                      <p style={{ fontSize: "24px", color: totalProfit >= 0 ? "#10B981" : "#EF4444", fontWeight: "800", margin: 0 }}><FormatMoney amount={totalProfit} showSign={true}/></p>
                    </div>
                  </div>

                  <h4 style={{ fontSize: "15px", fontWeight: "800", color: "#0F172A", marginBottom: "12px" }}>Детальний список операцій</h4>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "600px" }}>
                      <thead>
                        <tr>
                          <th className="table-head-cell" style={{ textAlign: "left" }}>Дата</th>
                          <th className="table-head-cell" style={{ textAlign: "left" }}>Товар</th>
                          <th className="table-head-cell" style={{ textAlign: "left" }}>К-сть</th>
                          <th className="table-head-cell" style={{ textAlign: "right" }}>Сума</th>
                          <th className="table-head-cell" style={{ textAlign: "right" }}>Дохід</th>
                          <th className="table-head-cell" style={{ textAlign: "left" }}>Статус / ТТН</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                        {clientSales.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "#94A3B8", padding: "20px" }}>Немає історії замовлень</td></tr>}
                        {clientSales.map(s => {
                          const itemProfit = s.profit !== undefined ? s.profit : (Number(s.total_price) - Number(s.cost_price));
                          return (
                            <tr key={s.id} className="table-row">
                              <td className="table-cell" style={{ color: "#64748B", fontWeight: 600 }}>{new Date(s.created_at).toLocaleDateString('uk-UA')}</td>
                              <td className="table-cell" style={{ fontWeight: 700, color: "#0F172A" }}>{s.product_name} {s.selected_size ? `(${s.selected_size})` : ""}</td>
                              <td className="table-cell" style={{ fontWeight: 700 }}>{s.quantity}</td>
                              <td className="table-cell" style={{ fontWeight: 800, color: "#0F172A", textAlign: "right" }}><FormatMoney amount={s.total_price} /></td>
                              <td className="table-cell" style={{ fontWeight: 800, color: itemProfit >= 0 ? "#10B981" : "#EF4444", textAlign: "right" }}><FormatMoney amount={itemProfit} /></td>
                              <td className="table-cell">
                                <span style={{ fontSize: "11px", fontWeight: "700", padding: "4px 8px", borderRadius: "6px", backgroundColor: s.status === 'Отримано' ? '#ECFDF5' : s.status === 'Відмова' ? '#FEF2F2' : '#FFFBEB', color: s.status === 'Отримано' ? '#059669' : s.status === 'Відмова' ? '#DC2626' : '#D97706', display: "inline-block", marginBottom: "4px" }}>
                                  {s.status}
                                </span>
                                {s.ttn && <div style={{ fontSize: "11px", color: "#64748B", fontFamily: "monospace" }}>{s.ttn}</div>}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}

          </div>
        </div>
      )}

      {isSupplierModalOpen && (
        <div className="modal-overlay-fixed">
          <div className="modal-box-fixed">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "800", margin: 0 }}>Постачальник</h3>
              <button onClick={() => setIsSupplierModalOpen(false)} style={{ border: "none", backgroundColor: "#F1F5F9", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveSupplier} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <input required type="text" placeholder="Назва компанії / ФОП" value={supplierForm.name} onChange={e => setSupplierForm({...supplierForm, name: e.target.value})} style={{ padding: "14px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "14px", width: "100%" }} />
              <input type="text" placeholder="Контактні дані (Телефон, Telegram)" value={supplierForm.contact} onChange={e => setSupplierForm({...supplierForm, contact: e.target.value})} style={{ padding: "14px", borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "14px", width: "100%" }} />
              <button type="submit" style={{ width: "100%", backgroundColor: "#0D9488", color: "#FFF", border: "none", padding: "16px", borderRadius: "12px", fontWeight: "800", fontSize: "15px", cursor: "pointer", marginTop: "8px", boxShadow: "0 4px 12px rgba(13, 148, 136, 0.3)" }}>Зберегти</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}