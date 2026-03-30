"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";

const CATEGORIES = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Anklets", "Sets"];
const EMOJI_MAP  = { Rings:"💍", Necklaces:"📿", Earrings:"✨", Bracelets:"📿", Anklets:"⭐", Sets:"💎", default:"💎" };

export default function AdminProductsPage() {
  const [products, setProducts]     = useState([]);
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("All");
  const [loading, setLoading]       = useState(true);
  const [deleting, setDeleting]     = useState({});
  const [imgErrors, setImgErrors]   = useState({});
  const [confirm, setConfirm]       = useState(null);
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState({ name:"", price:"", description:"", category:"Rings" });
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState("");
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading]   = useState(false);
  const fileInputRef                = useRef(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) { console.error(error); setProducts([]); }
      else setProducts(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width:"100%", padding:"10px 14px", border:"2px solid #c9b37e", borderRadius:"10px",
    fontSize:"14px", color:"#1b2e2b", background:"#ffffff", outline:"none",
    boxSizing:"border-box", fontFamily:"inherit", marginBottom:"14px"
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0f2027 0%,#203a43 100%)", fontFamily:"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif", color:"#e8f6f3" }}>

      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#0f3d3e 0%,#14532d 100%)", padding:"44px 32px 60px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-80px", right:"-60px", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
        <div style={{ maxWidth:"1200px", margin:"0 auto", position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"16px" }}>
          <div>
            <p style={{ fontSize:"11px", letterSpacing:"4px", color:"#d4af37", textTransform:"uppercase", fontWeight:"600", marginBottom:"10px" }}>
              <Link href="/admin" style={{ color:"#d4af37", textDecoration:"none" }}>Admin</Link> / Products
            </p>
            <h1 style={{ fontSize:"clamp(24px,4vw,40px)", fontFamily:"Georgia,serif", fontWeight:"300", color:"#fff", margin:"0 0 8px", letterSpacing:"2px" }}>💍 Manage Products</h1>
            <p style={{ color:"#d4af37", fontSize:"14px" }}>{products.length} products in catalogue</p>
          </div>
          <button
            style={{ background:"#d4af37", color:"#0f2027", border:"none", padding:"13px 28px", borderRadius:"12px", fontSize:"14px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(212,175,55,0.4)" }}>
            + Add Product
          </button>
        </div>
      </div>

      <div style={{ maxWidth:"1200px", margin:"-32px auto 0", padding:"0 32px 48px" }}>

        {/* Filter bar */}
        <div style={{ background:"#ffffff", borderRadius:"16px", padding:"20px 24px", marginBottom:"24px", border:"1px solid #e6e6e6", boxShadow:"0 2px 12px rgba(0,0,0,0.08)", display:"flex", gap:"16px", flexWrap:"wrap", alignItems:"center" }}>
          
          <input type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle }}
          />

          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding:"7px 16px",
                  borderRadius:"20px",
                  fontSize:"12px",
                  fontWeight:"600",
                  cursor:"pointer",
                  border:"2px solid #14532d",
                  background: category===cat ? "#14532d" : "transparent",
                  color: category===cat ? "#fff" : "#14532d"
                }}>
                {cat}
              </button>
            ))}
          </div>

          <span style={{ fontSize:"13px", color:"#444" }}>
            <strong style={{ color:"#14532d" }}>{products.length}</strong> results
          </span>
        </div>

        {/* Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"18px" }}>
          {products.map(product => (
            <div key={product.id}
              style={{
                background:"#ffffff",
                borderRadius:"16px",
                border:"1px solid #e6e6e6",
                boxShadow:"0 2px 8px rgba(0,0,0,0.06)"
              }}>

              <div style={{ height:"200px", background:"linear-gradient(135deg,#f5f5f5,#eeeeee)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:"72px" }}>{EMOJI_MAP[product.category] || EMOJI_MAP.default}</span>
              </div>

              <div style={{ padding:"16px" }}>
                <h3>{product.name}</h3>
                <p style={{ color:"#14532d", fontWeight:"700" }}>${product.price}</p>

                <div style={{ display:"flex", gap:"8px" }}>
                  <button style={{ flex:1, background:"#14532d", color:"#fff", border:"none", padding:"8px", borderRadius:"8px" }}>
                    Edit
                  </button>
                  <button style={{ flex:1, background:"#b91c1c", color:"#fff", border:"none", padding:"8px", borderRadius:"8px" }}>
                    Delete
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
export default function AdminProductsPage() {
  const [products, setProducts]     = useState([]);
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("All");
  const [loading, setLoading]       = useState(true);
  const [deleting, setDeleting]     = useState({});
  const [imgErrors, setImgErrors]   = useState({});
  const [confirm, setConfirm]       = useState(null);
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState({ name:"", price:"", description:"", category:"Rings" });
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState("");
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading]   = useState(false);
  const fileInputRef                = useRef(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) { console.error(error); setProducts([]); }
      else setProducts(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width:"100%", padding:"10px 14px", border:"2px solid #c9b37e", borderRadius:"10px",
    fontSize:"14px", color:"#1b2e2b", background:"#ffffff", outline:"none",
    boxSizing:"border-box", fontFamily:"inherit", marginBottom:"14px"
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0f2027 0%,#203a43 100%)", fontFamily:"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif", color:"#e8f6f3" }}>

      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#0f3d3e 0%,#14532d 100%)", padding:"44px 32px 60px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-80px", right:"-60px", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
        <div style={{ maxWidth:"1200px", margin:"0 auto", position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"16px" }}>
          <div>
            <p style={{ fontSize:"11px", letterSpacing:"4px", color:"#d4af37", textTransform:"uppercase", fontWeight:"600", marginBottom:"10px" }}>
              <Link href="/admin" style={{ color:"#d4af37", textDecoration:"none" }}>Admin</Link> / Products
            </p>
            <h1 style={{ fontSize:"clamp(24px,4vw,40px)", fontFamily:"Georgia,serif", fontWeight:"300", color:"#fff", margin:"0 0 8px", letterSpacing:"2px" }}>💍 Manage Products</h1>
            <p style={{ color:"#d4af37", fontSize:"14px" }}>{products.length} products in catalogue</p>
          </div>
          <button
            style={{ background:"#d4af37", color:"#0f2027", border:"none", padding:"13px 28px", borderRadius:"12px", fontSize:"14px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(212,175,55,0.4)" }}>
            + Add Product
          </button>
        </div>
      </div>

      <div style={{ maxWidth:"1200px", margin:"-32px auto 0", padding:"0 32px 48px" }}>

        {/* Filter bar */}
        <div style={{ background:"#ffffff", borderRadius:"16px", padding:"20px 24px", marginBottom:"24px", border:"1px solid #e6e6e6", boxShadow:"0 2px 12px rgba(0,0,0,0.08)", display:"flex", gap:"16px", flexWrap:"wrap", alignItems:"center" }}>
          
          <input type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle }}
          />

          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding:"7px 16px",
                  borderRadius:"20px",
                  fontSize:"12px",
                  fontWeight:"600",
                  cursor:"pointer",
                  border:"2px solid #14532d",
                  background: category===cat ? "#14532d" : "transparent",
                  color: category===cat ? "#fff" : "#14532d"
                }}>
                {cat}
              </button>
            ))}
          </div>

          <span style={{ fontSize:"13px", color:"#444" }}>
            <strong style={{ color:"#14532d" }}>{products.length}</strong> results
          </span>
        </div>

        {/* Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"18px" }}>
          {products.map(product => (
            <div key={product.id}
              style={{
                background:"#ffffff",
                borderRadius:"16px",
                border:"1px solid #e6e6e6",
                boxShadow:"0 2px 8px rgba(0,0,0,0.06)"
              }}>

              <div style={{ height:"200px", background:"linear-gradient(135deg,#f5f5f5,#eeeeee)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:"72px" }}>{EMOJI_MAP[product.category] || EMOJI_MAP.default}</span>
              </div>

              <div style={{ padding:"16px" }}>
                <h3>{product.name}</h3>
                <p style={{ color:"#14532d", fontWeight:"700" }}>${product.price}</p>

                <div style={{ display:"flex", gap:"8px" }}>
                  <button style={{ flex:1, background:"#14532d", color:"#fff", border:"none", padding:"8px", borderRadius:"8px" }}>
                    Edit
                  </button>
                  <button style={{ flex:1, background:"#b91c1c", color:"#fff", border:"none", padding:"8px", borderRadius:"8px" }}>
                    Delete
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}