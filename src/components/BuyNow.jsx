import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "./BuyNow.css";

const initialState = {
  name: "",
  email: "",
  phone_number: "",
  address: "",
  pincode: "",
  quantity: 1,
};

export default function BuyNow() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setStatus("");

    try {
      // 1️⃣ SAVE ORDER IN DATABASE
      const { error: dbError } = await supabase.from("BuyNow").insert([
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone_number: form.phone_number.trim(),
          address: form.address.trim(),
          pincode: form.pincode.trim(),
          quantity: Number(form.quantity) || 1,
        },
      ]);

      if (dbError) throw dbError;

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone_number,
        address: form.address,
        pincode: form.pincode,
        quantity: form.quantity,
      };

      // 2️⃣ SEND CUSTOMER EMAIL
      const { error: customerError } =
        await supabase.functions.invoke("send-customer-email", {
          body: payload,
        });

      if (customerError) {
        console.error("Customer email error:", customerError);
        throw customerError;
      }


      setStatus("✅ Order placed successfully! Emails sent.");
      setForm(initialState);
    } catch (err) {
      console.error("Order error:", err);
      setStatus("❌ Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="buy-now-page"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/buynow.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="buy-now-card">
        <div className="logo-container">
          <img
            src={`${process.env.PUBLIC_URL}/assets/Blackelvre.png`}
            alt="Elvre Logo"
            className="buy-now-logo"
          />
        </div>

        <h2 className="buy-now-title">Buy Now</h2>

        <form onSubmit={onSubmit} className="buy-now-form">
          <div className="form-row">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="form-row">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-row">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={form.phone_number}
              onChange={onChange}
              placeholder="10+ digit number"
              pattern="[0-9]{10,}"
              title="Please enter at least 10 digits"
              required
            />
          </div>

          <div className="form-row">
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={onChange}
              placeholder="6-digit pincode"
              pattern="[0-9]{6}"
              title="Please enter a valid 6 digit pincode"
              required
            />
          </div>

          <div className="form-row">
            <label>Address</label>
            <input
              name="address"
              value={form.address}
              onChange={onChange}
              placeholder="Your Address"
              title="House/ Street/ City"
              rows={3}
              required
            />
          </div>

          <div className="form-row">
            <label>Quantity (1 packet = 500g)</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={onChange}
              min="1"
              step="1"
              required
            />
          </div>

          <button type="submit" className="buy-now-submit" disabled={loading}>
            {loading ? "Placing order..." : "Place Order"}
          </button>

          {status && <p className="buy-now-status">{status}</p>}
        </form>
      </div>
    </section>
  );
}
