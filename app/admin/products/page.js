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

  const openAdd = () => {
    setEditing(null);
    setForm({ name:"", price:"", description:"", category:"Rings" });
    setImageFile(null);
    setImagePreview("");
    setFormError("");
    setModal(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({ name: product.name || "", price: product.price || "", description: product.description || "", category: product.category || "Rings" });
    setImageFile(null);
    setImagePreview(product.image_url || "");
    setFormError("");
    setModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setFormError("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { setFormError("Image must be under 5MB."); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormError("");
  };

  const uploadImage = async (file) => {
    const ext      = file.name.split(".").pop();
    const filename = `${Date.now()}.${ext}`;

    console.log("Uploading:", filename, file.size, file.type);

    const uploadPromise = supabase.storage
      .from("product-images")
      .upload(filename, file, { cacheControl: "3600", upsert: true });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Upload timed out after 15 seconds. Check your storage policies.")), 15000)
    );

    const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);

    console.log("Upload result:", { data, error });

    if (error) throw new Error(`Storage error: ${error.message}`);

    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(data.path);

    console.log("Public URL:", publicUrl);
    return publicUrl;
  };

  const saveProduct = async () => {
    if (!form.name || !form.price) { setFormError("Name and price are required."); return; }
    if (isNaN(Number(form.price)) || Number(form.price) <= 0) { setFormError("Enter a valid price."); return; }
    if (!editing && !imageFile) { setFormError("Please select a product image."); return; }

    setSaving(true);
    setFormError("");

    try {
      let image_url = editing?.image_url || "";

      if (imageFile) {
        setUploading(true);
        try {
          image_url = await uploadImage(imageFile);
        } finally {
          setUploading(false);
        }
      }

      const payload = {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        category: form.category,
        image_url,
      };

      if (editing) {
        const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
        if (error) throw error;
        setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...payload } : p));
      } else {
        const { data, error } = await supabase.from("products")
          .insert({ ...payload, created_at: new Date().toISOString() })
          .select().single();
        if (error) throw error;
        setProducts(prev => [data, ...prev]);
      }
      setModal(false);
    } catch (e) {
      console.error("Save error:", e);
      setFormError(e.message || "Save failed.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const deleteProduct = async (id) => {
    setDeleting(prev => ({ ...prev, [id]: true }));
    try {
      const product = products.find(p => p.id === id);
      if (product?.image_url) {
        const path = product.image_url.split("/product-images/")[1];
        if (path) await supabase.storage.from("product-images").remove([path]);
      }
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) { alert(e.message); }
    finally { setDeleting(prev => ({ ...prev, [id]: false })); setConfirm(null); }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  const inputStyle = {
    width:"100%", padding:"10px 14px", border:"2px solid #d4c8f0", borderRadius:"10px",
    fontSize:"14px", color:"#1a1a2e", background:"#fff", outline:"none",
    boxSizing:"border-box", fontFamily:"inherit", marginBottom:"14px"
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#f0ebf8 0%,#e8dff5 100%)", fontFamily:"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif", color:"#1a1a2e" }}>

      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#4e2d96 0%,#6c3fc5 100%)", padding:"44px 32px 60px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-80px", right:"-60px", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />
        <div style={{ maxWidth:"1200px", margin:"0 auto", position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"16px" }}>
          <div>
            <p style={{ fontSize:"11px", letterSpacing:"4px", color:"#c4a8f0", textTransform:"uppercase", fontWeight:"600", marginBottom:"10px" }}>
              <Link href="/admin" style={{ color:"#c4a8f0", textDecoration:"none" }}>Admin</Link> / Products
            </p>
            <h1 style={{ fontSize:"clamp(24px,4vw,40px)", fontFamily:"Georgia,serif", fontWeight:"300", color:"#fff", margin:"0 0 8px", letterSpacing:"2px" }}>💍 Manage Products</h1>
            <p style={{ color:"#c4a8f0", fontSize:"14px" }}>{products.length} products in catalogue</p>
          </div>
          <button onClick={openAdd}
            style={{ background:"#ff6b9d", color:"#fff", border:"none", padding:"13px 28px", borderRadius:"12px", fontSize:"14px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(255,107,157,0.4)" }}>
            + Add Product
          </button>
        </div>
      </div>

      <div style={{ maxWidth:"1200px", margin:"-32px auto 0", padding:"0 32px 48px" }}>

        {/* Filter bar */}
        <div style={{ background:"#fff", borderRadius:"16px", padding:"20px 24px", marginBottom:"24px", border:"1px solid #e4d8f8", boxShadow:"0 2px 12px rgba(108,63,197,0.08)", display:"flex", gap:"16px", flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ position:"relative", flex:1, minWidth:"200px" }}>
            <svg style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9b72e0" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft:"38px", marginBottom:0 }}
              onFocus={e => e.target.style.borderColor="#6c3fc5"}
              onBlur={e => e.target.style.borderColor="#d4c8f0"} />
          </div>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{ padding:"7px 16px", borderRadius:"20px", fontSize:"12px", fontWeight:"600", cursor:"pointer", border:"2px solid #6c3fc5", fontFamily:"inherit",
                  background: category===cat ? "#6c3fc5" : "transparent",
                  color: category===cat ? "#fff" : "#6c3fc5" }}>
                {cat}
              </button>
            ))}
          </div>
          <span style={{ fontSize:"13px", color:"#6b6b8a" }}>
            <strong style={{ color:"#6c3fc5" }}>{filtered.length}</strong> results
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign:"center", padding:"80px 0" }}>
            <div style={{ fontSize:"48px", marginBottom:"16px" }}>💍</div>
            <p style={{ color:"#6b6b8a" }}>Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background:"#fff", borderRadius:"16px", padding:"60px 40px", textAlign:"center", border:"1px solid #e4d8f8" }}>
            <div style={{ fontSize:"52px", marginBottom:"16px" }}>🔍</div>
            <p style={{ fontSize:"18px", fontWeight:"700", marginBottom:"8px" }}>No products found</p>
            <button onClick={openAdd} style={{ background:"linear-gradient(135deg,#6c3fc5,#9b72e0)", color:"#fff", border:"none", padding:"12px 28px", borderRadius:"10px", fontSize:"14px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" }}>
              + Add First Product
            </button>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"18px" }}>
            {filtered.map(product => (
              <div key={product.id} style={{ background:"#fff", borderRadius:"16px", overflow:"hidden", border:"1px solid #e4d8f8", boxShadow:"0 2px 8px rgba(108,63,197,0.06)", transition:"all 0.2s", display:"flex", flexDirection:"column" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 24px rgba(108,63,197,0.14)"; e.currentTarget.style.transform="translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow="0 2px 8px rgba(108,63,197,0.06)"; e.currentTarget.style.transform="none"; }}>
                <div style={{ height:"200px", background:"linear-gradient(135deg,#f5f0ff,#ede5f8)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", flexShrink:0 }}>
                  {product.image_url && !imgErrors[product.id] ? (
                    <img src={product.image_url} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}
                      onError={() => setImgErrors(p => ({ ...p, [product.id]: true }))} />
                  ) : (
                    <span style={{ fontSize:"72px" }}>{EMOJI_MAP[product.category] || EMOJI_MAP.default}</span>
                  )}
                  {product.category && (
                    <span style={{ position:"absolute", top:"10px", left:"10px", background:"rgba(78,45,150,0.85)", color:"#fff", fontSize:"11px", fontWeight:"700", padding:"3px 10px", borderRadius:"20px" }}>
                      {product.category}
                    </span>
                  )}
                </div>
                <div style={{ padding:"16px 18px", flex:1, display:"flex", flexDirection:"column" }}>
                  <h3 style={{ fontSize:"15px", fontWeight:"700", marginBottom:"4px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{product.name}</h3>
                  {product.description && (
                    <p style={{ fontSize:"12px", color:"#6b6b8a", marginBottom:"10px", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", flex:1 }}>{product.description}</p>
                  )}
                  <p style={{ fontSize:"20px", fontWeight:"700", color:"#6c3fc5", marginBottom:"14px", marginTop:"auto" }}>${Number(product.price).toFixed(2)}</p>
                  <div style={{ display:"flex", gap:"8px" }}>
                    <button onClick={() => openEdit(product)}
                      style={{ flex:1, background:"rgba(108,63,197,0.08)", color:"#6c3fc5", border:"2px solid rgba(108,63,197,0.2)", padding:"9px", borderRadius:"10px", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit", transition:"all 0.18s" }}
                      onMouseEnter={e => { e.currentTarget.style.background="#6c3fc5"; e.currentTarget.style.color="#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="rgba(108,63,197,0.08)"; e.currentTarget.style.color="#6c3fc5"; }}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => setConfirm(product.id)}
                      style={{ flex:1, background:"rgba(239,68,68,0.08)", color:"#ef4444", border:"2px solid rgba(239,68,68,0.2)", padding:"9px", borderRadius:"10px", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit", transition:"all 0.18s" }}
                      onMouseEnter={e => { e.currentTarget.style.background="#ef4444"; e.currentTarget.style.color="#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="rgba(239,68,68,0.08)"; e.currentTarget.style.color="#ef4444"; }}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {confirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000, padding:"16px" }}>
          <div style={{ background:"#fff", borderRadius:"20px", padding:"36px 32px", maxWidth:"380px", width:"100%", textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize:"48px", marginBottom:"16px" }}>🗑️</div>
            <h3 style={{ fontSize:"18px", fontWeight:"700", marginBottom:"8px" }}>Delete Product?</h3>
            <p style={{ fontSize:"13px", color:"#6b6b8a", marginBottom:"24px" }}>This will also delete the image from storage. This cannot be undone.</p>
            <div style={{ display:"flex", gap:"12px" }}>
              <button onClick={() => setConfirm(null)} style={{ flex:1, background:"#f0ebf8", color:"#6c3fc5", border:"none", padding:"12px", borderRadius:"10px", fontSize:"14px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
              <button onClick={() => deleteProduct(confirm)} disabled={deleting[confirm]}
                style={{ flex:1, background:"#ef4444", color:"#fff", border:"none", padding:"12px", borderRadius:"10px", fontSize:"14px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" }}>
                {deleting[confirm] ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000, padding:"16px" }}>
          <div style={{ background:"#fff", borderRadius:"20px", padding:"36px 32px", maxWidth:"480px", width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.2)", maxHeight:"90vh", overflowY:"auto" }}>
            <h3 style={{ fontSize:"20px", fontWeight:"700", marginBottom:"24px", color:"#1a1a2e" }}>{editing ? "✏️ Edit Product" : "➕ Add Product"}</h3>

            {formError && (
              <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderLeft:"4px solid #ef4444", color:"#991b1b", padding:"10px 14px", borderRadius:"8px", fontSize:"13px", marginBottom:"16px" }}>
                {formError}
              </div>
            )}

            <label style={{ fontSize:"13px", fontWeight:"600", color:"#4a4a6a", display:"block", marginBottom:"6px" }}>Product Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Gold Chain Necklace" style={inputStyle}
              onFocus={e => e.target.style.borderColor="#6c3fc5"} onBlur={e => e.target.style.borderColor="#d4c8f0"} />

            <label style={{ fontSize:"13px", fontWeight:"600", color:"#4a4a6a", display:"block", marginBottom:"6px" }}>Price ($) *</label>
            <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="e.g. 19.99" style={inputStyle}
              onFocus={e => e.target.style.borderColor="#6c3fc5"} onBlur={e => e.target.style.borderColor="#d4c8f0"} />

            <label style={{ fontSize:"13px", fontWeight:"600", color:"#4a4a6a", display:"block", marginBottom:"6px" }}>Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={inputStyle}
              onFocus={e => e.target.style.borderColor="#6c3fc5"} onBlur={e => e.target.style.borderColor="#d4c8f0"}>
              {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label style={{ fontSize:"13px", fontWeight:"600", color:"#4a4a6a", display:"block", marginBottom:"6px" }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Optional product description..." rows={3}
              style={{ ...inputStyle, resize:"vertical" }}
              onFocus={e => e.target.style.borderColor="#6c3fc5"} onBlur={e => e.target.style.borderColor="#d4c8f0"} />

            <label style={{ fontSize:"13px", fontWeight:"600", color:"#4a4a6a", display:"block", marginBottom:"8px" }}>
              Product Image {!editing && <span style={{ color:"#ef4444" }}>*</span>}
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor="#6c3fc5"; e.currentTarget.style.background="rgba(108,63,197,0.04)"; }}
              onDragLeave={e => { e.currentTarget.style.borderColor="#d4c8f0"; e.currentTarget.style.background="#faf8fe"; }}
              onDrop={e => {
                e.preventDefault();
                e.currentTarget.style.borderColor="#d4c8f0";
                e.currentTarget.style.background="#faf8fe";
                const file = e.dataTransfer.files[0];
                if (file) { const evt = { target: { files: [file] } }; handleFileChange(evt); }
              }}
              style={{ border:"2px dashed #d4c8f0", borderRadius:"12px", padding:"28px 20px", textAlign:"center", cursor:"pointer", background:"#faf8fe", marginBottom:"14px", transition:"all 0.2s" }}>
              <div style={{ fontSize:"32px", marginBottom:"8px" }}>📁</div>
              <p style={{ fontSize:"14px", fontWeight:"600", color:"#6c3fc5", marginBottom:"4px" }}>Click to browse or drag & drop</p>
              <p style={{ fontSize:"12px", color:"#9b72e0" }}>PNG, JPG, WEBP up to 5MB</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display:"none" }} />
            </div>

            {imagePreview && (
              <div style={{ position:"relative", marginBottom:"16px", borderRadius:"12px", overflow:"hidden", height:"160px", background:"#f5f0ff" }}>
                <img src={imagePreview} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                <button onClick={() => { setImageFile(null); setImagePreview(editing?.image_url || ""); }}
                  style={{ position:"absolute", top:"8px", right:"8px", background:"rgba(0,0,0,0.6)", color:"#fff", border:"none", width:"28px", height:"28px", borderRadius:"50%", cursor:"pointer", fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  ✕
                </button>
                {imageFile && <div style={{ position:"absolute", bottom:"8px", left:"8px", background:"rgba(16,185,129,0.9)", color:"#fff", fontSize:"11px", fontWeight:"700", padding:"3px 10px", borderRadius:"20px" }}>New image selected</div>}
              </div>
            )}

            {/* Upload progress indicator */}
            {uploading && (
              <div style={{ background:"rgba(108,63,197,0.06)", border:"1px solid #d4c8f0", borderRadius:"10px", padding:"12px 16px", marginBottom:"14px", display:"flex", alignItems:"center", gap:"10px" }}>
                <div style={{ width:"18px", height:"18px", border:"3px solid #d4c8f0", borderTop:"3px solid #6c3fc5", borderRadius:"50%", animation:"spin 0.8s linear infinite", flexShrink:0 }} />
                <span style={{ fontSize:"13px", color:"#6c3fc5", fontWeight:"600" }}>Uploading image to storage...</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            <div style={{ display:"flex", gap:"12px", marginTop:"8px" }}>
              <button onClick={() => setModal(false)} disabled={saving} style={{ flex:1, background:"#f0ebf8", color:"#6c3fc5", border:"none", padding:"13px", borderRadius:"10px", fontSize:"14px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
              <button onClick={saveProduct} disabled={saving || uploading}
                style={{ flex:2, background: (saving || uploading) ? "#9b72e0" : "linear-gradient(135deg,#6c3fc5,#9b72e0)", color:"#fff", border:"none", padding:"13px", borderRadius:"10px", fontSize:"14px", fontWeight:"700", cursor: (saving || uploading) ? "not-allowed" : "pointer", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(108,63,197,0.3)" }}>
                {uploading ? "⬆️ Uploading..." : saving ? "💾 Saving..." : editing ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
