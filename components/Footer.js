import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "linear-gradient(135deg, #4e2d96 0%, #6c3fc5 100%)", color: "#fff", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", marginTop: "auto" }}>

      {/* Top perks strip */}
      <div style={{ background: "rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "14px 32px", display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
          {[["🚚","Free Delivery","On orders over $300"],["↩️","Free Returns","On all orders"],["🔒","Secure Payment","100% protected"],["💎","Quality Guaranteed","Premium materials"]].map(([icon,title,sub]) => (
            <div key={title} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>{icon}</span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#fff" }}>{title}</div>
                <div style={{ fontSize: "11px", color: "#c4a8f0" }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 32px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "40px" }}>

          {/* Brand */}
          <div>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "700", letterSpacing: "4px", color: "#fff", display: "block", marginBottom: "16px" }}>GLEAMIA</span>
            <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#c4a8f0", marginBottom: "20px", maxWidth: "260px" }}>
              Jewellery that celebrates your unique style. Quality, Elegance and Timeless beauty in every piece.
            </p>
            {/* Social links */}
            <div style={{ display: "flex", gap: "10px" }}>
              {[["📷", "Instagram", "https://www.instagram.com/gleamia__jewellery/"], ["💬", "WhatsApp", "https://wa.me/263787527809"]].map(([icon, label, url]) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} style={{ width: "34px", height: "34px", background: "rgba(255,255,255,0.12)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "16px", textDecoration: "none", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,157,0.5)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#fff", marginBottom: "18px", letterSpacing: "1px", textTransform: "uppercase" }}>Shop</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[["All Products", "/users/products"], ["Cart", "/users/cart"], ["New Arrivals", "#"], ["Sale Items", "#"]].map(([label, href]) => (
                <li key={label} style={{ marginBottom: "10px" }}>
                  <Link href={href} style={{ color: "#c4a8f0", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "#fff"}
                    onMouseLeave={e => e.target.style.color = "#c4a8f0"}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#fff", marginBottom: "18px", letterSpacing: "1px", textTransform: "uppercase" }}>Support</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[["About Us", "#"], ["FAQs", "#"], ["DeliveryInfo", "#"], ["Return Policy", "#"]].map(([label, href]) => (
                <li key={label} style={{ marginBottom: "10px" }}>
                  <a href={href} style={{ color: "#c4a8f0", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "#fff"}
                    onMouseLeave={e => e.target.style.color = "#c4a8f0"}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#fff", marginBottom: "18px", letterSpacing: "1px", textTransform: "uppercase" }}>Contact</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[["📍", "Bulawayo, Zimbabwe"], ["📧", "info@gleamia.com"], ["📞", "+263 787527809"], ["🕐", "Mon-Sat 9am-6pm"]].map(([icon, text]) => (
                <li key={text} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px", flexShrink: 0 }}>{icon}</span>
                  <span style={{ color: "#c4a8f0", fontSize: "13px" }}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "12px", color: "#c4a8f0" }}>© {new Date().getFullYear()} GLEAMIA. All rights reserved.</p>
          <div style={{ display: "flex", gap: "24px" }}>
            {[["Privacy Policy", "#"], ["Terms of Service", "#"], ["Cookies", "#"]].map(([label, href]) => (
              <a key={label} href={href} style={{ color: "#c4a8f0", fontSize: "12px", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "#c4a8f0"}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}