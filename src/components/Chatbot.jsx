import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane, FaTimes, FaQuestionCircle, FaRobot } from "react-icons/fa";
import "./Chatbot.css";

const initialMessages = [
  {
    id: 1,
    sender: "bot",
    text: "Hi! I’m Elvre Assistant. I can help you browse products, compare jaggery options, answer product questions, guide you through orders, and support your shopping experience.",
  },
];

const isHindiText = (text) => /[\u0900-\u097F]/.test(text) || /(kya|kaise|kahan|kitna|aap|mujhe|hai|mein|hoga|ja|dekh|order|cart|wishlist|profile)/i.test(text);

const getBotReply = (input, navigate) => {
  const text = input.trim();
  const lang = isHindiText(text) ? "hi" : "en";
  const lower = text.toLowerCase();
  const isLoggedIn = Boolean(localStorage.getItem("currentUser"));

  if (/(what is jaggery powder|jaggery powder kya hai|jaggery powder kya hota hai)/i.test(lower)) {
    return lang === "hi"
      ? "Jaggery powder natural cane jaggery ka finely ground form hota hai. Ye tea, coffee, milk, baking aur desserts mein use kiya ja sakta hai aur ek natural sweetener ke roop mein popular hai."
      : "Jaggery powder is a finely ground form of natural cane jaggery. It is a natural sweetener that can be used in tea, coffee, milk, baking, desserts, and cooking.";
  }

  if (/(how is jaggery powder made|jaggery powder kaise banta hai|kaise banta hai)/i.test(lower)) {
    return lang === "hi"
      ? "Jaggery powder banane ke liye fresh sugarcane juice ko collect karke usse cook kiya jata hai, phir solid jaggery mein set kiya jata hai aur finally powder mein grind kiya jata hai."
      : "Jaggery powder is made by boiling fresh sugarcane juice, then forming it into jaggery and grinding it into a fine powder.";
  }

  if (/(difference between jaggery powder and sugar|jaggery powder vs sugar|jaggery powder aur sugar mein fark|difference)/i.test(lower)) {
    return lang === "hi"
      ? "Jaggery powder natural cane jaggery ka form hota hai aur sugar ka processing zyada refined hota hai. Jaggery ko natural sweetness ke liye prefer kiya jata hai, jabki sugar ka taste aur texture different hota hai."
      : "Jaggery powder is made from natural cane jaggery and is less refined than white sugar. It is often preferred for its natural taste and traditional use, while sugar is more heavily processed.";
  }

  if (/(natural|is jaggery powder natural|natural hai|natural sweetener)/i.test(lower)) {
    return lang === "hi"
      ? "Haan, jaggery powder natural source se aata hai aur isko minimally processed jaggery se banaya jata hai."
      : "Yes, jaggery powder is derived from natural sugarcane and is typically made through a traditional, minimally processed method.";
  }

  if (/(better than white sugar|white sugar se better|white sugar se achha|better than brown sugar|healthier than brown sugar)/i.test(lower)) {
    return lang === "hi"
      ? "Jaggery powder ko ek natural sweetener ke roop mein dekha jata hai, lekin ye white sugar ka direct replacement nahi hota. Ye taste aur traditional value ke liye popular hai, aur consumption ko moderation mein rakha jana chahiye."
      : "Jaggery powder is often chosen as a natural sweetener, but it is not a direct health replacement for white sugar. It is best used in moderation as part of a balanced diet.";
  }

  if (/(chemicals|chemical|contains chemicals|chemical free|without chemicals)/i.test(lower)) {
    return lang === "hi"
      ? "Hamein apni product quality ko maintain karne ke liye strict standards follow karna hota hai. Agar aap specific ingredient details chahte hain, to main aapko product page ya support team se connect karne ki suggestion de sakta hoon."
      : "We focus on quality and clean processing standards. If you want precise ingredient details for a specific batch, I can help you check the product information or contact support.";
  }

  if (/(organic|is your jaggery powder organic|organic hai|organic jaggery)/i.test(lower)) {
    return lang === "hi"
      ? "ELVRE ke products ko natural aur premium quality ke liye design kiya jata hai. Agar aap specific organic certification details chahte hain, to product information ya support team se confirm karna better hoga."
      : "ELVRE products are crafted with a focus on natural quality and premium standards. If you need specific certification details, I can help you verify them through the product information or support team.";
  }

  if (/(where is your jaggery powder made|made in|kahan banta hai|kahan se aata hai)/i.test(lower)) {
    return lang === "hi"
      ? "ELVRE ka focus premium quality aur natural sourcing par hota hai. Agar aap exact manufacturing origin ke baare mein details chahte hain, to main aapko product info ya support team se confirm karne ki guidance de sakta hoon."
      : "ELVRE focuses on premium quality and natural sourcing. If you need the exact manufacturing origin details, I can help you confirm them through the product information or support team.";
  }

  if (/(ingredients|what are the ingredients|ingredients kya hain)/i.test(lower)) {
    return lang === "hi"
      ? "ELVRE jaggery powder natural sugarcane-based jaggery se banaya jata hai. Agar aap exact ingredient list chahte hain, to product page ya support team se confirm karna best hoga."
      : "ELVRE jaggery powder is made from natural sugarcane-based jaggery. For the exact ingredient list, it is best to verify it through the product page or support team.";
  }

  if (/(why should i choose elvre|why elvre|why should i choose elvre jaggery powder|why choose elvre)/i.test(lower)) {
    return lang === "hi"
      ? "ELVRE jaggery powder ko premium quality, natural sourcing aur trusted product experience ke liye choose kiya ja sakta hai. Ye everyday use ke liye convenient aur practical sweetening option provide karta hai."
      : "ELVRE jaggery powder is a great choice for customers looking for a premium-quality, naturally sourced sweetener that is convenient for everyday use.";
  }

  if (/(health benefit|benefits of jaggery powder|health benefits|immunity|digestion|iron|anemia|winter|children|elderly|energy|bones|minerals|calcium|potassium)/i.test(lower)) {
    return lang === "hi"
      ? "Jaggery powder ko natural sweetener ke roop mein use kiya jata hai aur traditional lifestyle mein iski popularity hai. Ye energy provide kar sakta hai aur digestion ya immunity ke liye support ke roop mein dekha jata hai, lekin medical claims ke liye doctor se consult karna better hota hai."
      : "Jaggery powder is often valued as a natural sweetener and traditional pantry ingredient. It can provide energy and is often associated with digestive and immunity support, though medical claims should always be discussed with a qualified healthcare professional.";
  }

  if (/(use jaggery powder|how do i use|tea|coffee|baking|sweets|milk|smoothies|replace sugar|daily consumption|cooking indian dishes|breakfast recipes|protein shakes|workout|cough|cold|skin)/i.test(lower)) {
    return lang === "hi"
      ? "Jaggery powder ko tea, coffee, milk, smoothies, baking, sweets aur Indian cooking mein use kiya ja sakta hai. Ye sugar ka natural alternative hai, lekin use ko moderation mein rakhein."
      : "Jaggery powder can be used in tea, coffee, milk, smoothies, baking, sweets, Indian cooking, and breakfast recipes. It works well as a natural alternative to sugar when used in moderation.";
  }

  if (/(store|storage|shelf life|expire|hard sometimes|lumps|fresh for longer|preservatives|quality|tested|batch|color different|colour different)/i.test(lower)) {
    return lang === "hi"
      ? "Jaggery powder ko cool, dry aur airtight container mein rakhna chahiye. Agar powder thick ya hard ho jaye to ye storage conditions ya humidity ke karan ho sakta hai. Product quality maintain karne ke liye proper packaging aur testing important hoti hai."
      : "Store jaggery powder in a cool, dry, and airtight container. If it becomes hard or lumpy, that can happen due to humidity or storage conditions. Proper packaging and quality checks help maintain freshness.";
  }

  if (/(diabetic|pregnant|weight loss|gluten free|vegan|allergen|babies|daily use)/i.test(lower)) {
    return lang === "hi"
      ? "Jaggery powder ko moderation mein use karna better hota hai. Diabetes, pregnancy, weight loss ya baby nutrition ke baare mein personal medical advice lena best hota hai."
      : "Jaggery powder should be used in moderation. For diabetes, pregnancy, weight loss, or baby nutrition, it is best to follow personal medical advice.";
  }

  if (/(pack sizes|available pack sizes|pack size|order|how can i order|where can i buy|buy elvre|cash on delivery|cod|delivery take|return the product|track my order|contact customer support|discount available|offer|offer available)/i.test(lower)) {
    return lang === "hi"
      ? "Aap hamare products page se order kar sakte hain. Humare paas different pack sizes available hain aur delivery, returns aur support ke liye aap contact page par ja sakte hain."
      : "You can place an order from our products page. We offer different pack sizes, and you can also check delivery, returns, and support details on the contact page.";
  }

  if (/(show|search|browse|buy|want to buy|find).*(product|products|jaggery|powder|block)/i.test(lower) || /(products|jaggery powder|jaggery block|1kg|500g|250g)/i.test(lower)) {
    navigate("/products");
    return lang === "hi"
      ? "Main aapko hamare products page par le ja raha hoon. Aap wahan se jaggery powder, blocks aur festive packs dekh sakte hain."
      : "I’m opening our products page for you now. You can browse jaggery powder, blocks, and festive packs there.";
  }

  if (/(what is|tell me about|benefits|health|nutrition|ingredients|storage|shelf|recipe|use|tea|coffee|milk|baking|dessert|smoothie)/i.test(lower)) {
    if (/(diabet|cancer|bp|obesity|cure)/i.test(lower)) {
      return lang === "hi"
        ? "Jaggery ko balanced diet ka hissa mana ja sakta hai. Medical advice ke liye qualified healthcare professional se consult karna better hoga."
        : "Jaggery can be part of a balanced diet, but for medical advice it is best to consult a qualified healthcare professional.";
    }

    if (/(jaggery powder|powder)/i.test(lower)) {
      return lang === "hi"
        ? "Jaggery powder natural cane jaggery ka finely ground form hota hai jo tea, coffee, milk, baking aur desserts mein use kiya ja sakta hai."
        : "Jaggery powder is a finely ground form of natural cane jaggery that can be used in tea, coffee, milk, baking, and desserts.";
    }

    return lang === "hi"
      ? "Main aapki question ko helpfully explain kar sakta hoon. Agar aap jaggery ke benefits, storage, nutrition ya use ke baare mein puch rahe hain, to main aapko simple aur practical guidance de sakta hoon."
      : "I can help explain that clearly. If you’re asking about benefits, nutrition, storage, or everyday use of jaggery, I can guide you with practical details.";
  }

  if (/(open|go to|show me|take me to).*(cart|checkout|orders|order|contact|profile|wishlist|reviews|products|home)/i.test(lower)) {
    const routeMap = {
      cart: "/cart",
      checkout: "/checkout",
      orders: "/my-orders",
      order: "/my-orders",
      contact: "/contact",
      profile: "/profile",
      wishlist: "/profile",
      reviews: "/",
      products: "/products",
      home: "/",
    };

    const matchedRoute = Object.entries(routeMap).find(([key]) => lower.includes(key));
    if (matchedRoute) {
      const [key, route] = matchedRoute;
      if ((key === "orders" || key === "order" || key === "profile" || key === "wishlist") && !isLoggedIn) {
        navigate("/login");
        return lang === "hi"
          ? "Aapka account access chahiye. Main aapko login page par le ja raha hoon."
          : "You’ll need to sign in to view that section. I’m opening the login page for you.";
      }
      navigate(route);
      return lang === "hi"
        ? `Main aapko ${key === "orders" ? "aapke orders" : key === "wishlist" ? "wishlist" : key} page par le ja raha hoon.`
        : `I’m opening the ${key} page for you now.`;
    }
  }

  if (/(my order|track my order|where is my order|show my orders|order status|previous orders)/i.test(lower)) {
    if (!isLoggedIn) {
      navigate("/login");
      return lang === "hi"
        ? "Order details dekhne ke liye login karna hoga. Main aapko login page par le ja raha hoon."
        : "To view your order details, you’ll need to sign in first. I’m opening the login page for you.";
    }
    navigate("/my-orders");
    return lang === "hi"
      ? "Main aapke orders page par le ja raha hoon. Aap wahan apni order history dekh sakte hain."
      : "I’m opening your orders page so you can view your order history.";
  }

  if (/(show my cart|my cart|cart)/i.test(lower)) {
    navigate("/cart");
    return lang === "hi"
      ? "Main aapke cart page par le ja raha hoon."
      : "I’m opening your cart for you now.";
  }

  if (/(wishlist|profile|my profile)/i.test(lower)) {
    if (!isLoggedIn) {
      navigate("/login");
      return lang === "hi"
        ? "Profile dekhne ke liye login karna hoga."
        : "To view your profile, you’ll need to sign in first.";
    }
    navigate("/profile");
    return lang === "hi"
      ? "Main aapke profile page par le ja raha hoon."
      : "I’m opening your profile page for you now.";
  }

  if (/(price|prices|cost|rate|₹|rupee|rupees|discount|offer|sale)/i.test(lower)) {
    return lang === "hi"
      ? "Hamare current prices ke liye products page check karen. Pure jaggery block 250g ₹149, 500g ₹299, 1kg ₹549, aur 2kg ₹999 par available hai."
      : "You can view current pricing on our products page. Pure Jaggery Block is available in 250g for ₹149, 500g for ₹299, 1kg for ₹549, and 2kg for ₹999.";
  }

  if (/(delivery|shipping|arrive|track|return|refund|payment|upi|cod|card)/i.test(lower)) {
    return lang === "hi"
      ? "Delivery usually 2–3 working days mein hoti hai, aur ₹499 se upar ke orders par free delivery milti hai. Agar aap return ya payment ke baare mein puch rahe hain, to main aapko relevant guidance de sakta hoon."
      : "Delivery is usually within 2–3 working days, and free delivery is available for orders above ₹499. I can also help with returns and payment-related questions.";
  }

  if (/(contact|support|email|help)/i.test(lower)) {
    navigate("/contact");
    return lang === "hi"
      ? "Main aapko contact page par le ja raha hoon. Aap support@elvre.com par bhi contact kar sakte hain."
      : "I’m opening the contact page for you. You can also reach our support team at support@elvre.com.";
  }

  if (/(hello|hi|hey|good morning|good evening)/i.test(lower)) {
    return lang === "hi"
      ? "Namaste! Main ELVRE ka shopping assistant hoon. Aap products, pricing, orders, ya support ke baare mein kuch bhi pooch sakte hain."
      : "Hello! I’m ELVRE’s shopping assistant. You can ask me about products, pricing, orders, or support.";
  }

  return lang === "hi"
    ? "Main aapki help karne ke liye yahan hoon. Aap products, jaggery powder, orders, delivery, ya returns ke baare mein pooch sakte hain."
    : "I can help with products, jaggery questions, orders, delivery, returns, and support. Ask me anything you need.";
};

const Chatbot = ({ isOpen = false, setIsOpen = () => {} }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-elvre-chatbot", handleOpenChat);
    return () => window.removeEventListener("open-elvre-chatbot", handleOpenChat);
  }, [setIsOpen]);

  const quickReplies = [
    "Show me products",
    "What are your prices?",
    "Where is my order?",
    "Open contact support",
  ];

  const handleSend = (messageText = input) => {
    const text = messageText.trim();
    if (!text) return;

    const userMessage = { id: Date.now(), sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(() => {
      const reply = getBotReply(text, navigate);
      const botMessage = { id: Date.now() + 1, sender: "bot", text: reply };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      <button className="chatbot-help-btn" onClick={() => setIsOpen(true)} aria-label="Open help assistant">
        <FaQuestionCircle />
        <span>Help</span>
      </button>

      {isOpen && (
        <div className="chatbot-shell" role="dialog" aria-label="Elvre assistant chat">
          <div className="chatbot-header">
            <div className="chatbot-title-wrap">
              <div className="chatbot-icon">
                <FaRobot />
              </div>
              <div>
                <h3>Elvre Assistant</h3>
                <p>Always here to help</p>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <FaTimes />
            </button>
          </div>

          <div className="chatbot-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}

            {isTyping && <div className="chat-bubble bot typing">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-quick-replies">
            {quickReplies.map((item) => (
              <button key={item} onClick={() => handleSend(item)}>
                {item}
              </button>
            ))}
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, orders, or support..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={() => handleSend()} aria-label="Send message">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
