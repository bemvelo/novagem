import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #fdf6f0 0%, #f8ede6 100%)",
        color: "#3a2e2e",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        marginTop: "auto",
      }}
    >
      {/* Top perks strip */}
      <div
        style={{
          background: "rgba(183,110,121,0.08)",
          borderBottom: "1px solid rgba(183,110,121,0.2)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "14px 32px",
            display: "flex",
            justifyContent: "center",
            gap: "48px",
            flexWrap: "wrap",
          }}
        >
          {[
            { title: "Free Delivery", sub: "On orders over $300" },
            { title: "Secure Payment", sub: "" },
            { title: "Quality Guaranteed", sub: "" },
          ].map((item) => (
            <div key={item.title} style={{ display: "flex", gap: "10px" }}>
              <span>•</span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700" }}>
                  {item.title}
                </div>
                {item.sub ? (
                  <div style={{ fontSize: "11px", color: "#b76e79" }}>
                    {item.sub}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "40px",
          }}
        >
          {/* Brand */}
          <div>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "24px",
                letterSpacing: "4px",
                color: "#b76e79",
                fontWeight: "bold",
              }}
            >
              NOVAGEM
            </span>

            <p style={{ fontSize: "13px", color: "#6b5b5b", marginTop: "10px" }}>
              Jewellery that celebrates your unique style. Timeless elegance in
              every piece.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 style={{ fontSize: "14px", marginBottom: "12px" }}>Shop</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                ["All Products", "/users/products"],
                ["Cart", "/users/cart"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    style={{
                      color: "#6b5b5b",
                      textDecoration: "none",
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 style={{ fontSize: "14px", marginBottom: "12px" }}>
              Support
            </h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {["About", "FAQs"].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontSize: "14px", marginBottom: "12px" }}>
              Contact
            </h3>
            <p style={{ fontSize: "13px" }}>Bulawayo, Zimbabwe</p>
            <p style={{ fontSize: "13px" }}>info@novagem.com</p>
             <p style={{ fontSize: "13px" }}>+263780670044</p>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: "1px solid rgba(183,110,121,0.2)",
            marginTop: "30px",
            paddingTop: "20px",
            textAlign: "center",
            fontSize: "12px",
            color: "#6b5b5b",
          }}
        >
          © {new Date().getFullYear()} NOVAGEM. All rights reserved.
        </div>
      </div>
    </footer>
  );
}