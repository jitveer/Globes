import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = ({ phone, text }) => {
  const getWhatsAppNumber = (phoneNum) => {
    const rawNumber = phoneNum || import.meta.env.VITE_WHATSAPP_PHONE_NUMBER || "919945739702";
    const cleanNumber = rawNumber.replace(/\D/g, "");
    return cleanNumber.startsWith("91") || cleanNumber.length > 10 ? cleanNumber : `91${cleanNumber}`;
  };

  const whatsappPhone = getWhatsAppNumber(phone);
  const defaultText = text || "Hello! I'm interested in your properties.";
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(defaultText)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_30px_rgba(37,211,102,0.5)] transition-all duration-300 hover:scale-110 active:scale-90 group"
      title="Chat on WhatsApp"
    >
      {/* Pulse Ripple Effect */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-40"></div>

      {/* 3D Glass Effect Inner Circle */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/10 to-transparent border border-white/20"></div>

      <FaWhatsapp className="text-3xl md:text-4xl relative z-10 drop-shadow-lg" />

      {/* Tooltip for desktop */}
      <span className="absolute right-full mr-4 px-3 py-1.5 bg-white text-gray-800 text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden md:block border border-gray-100">
        Chat with us!
      </span>
    </a>
  );
};

export default WhatsAppButton;
