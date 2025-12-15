import React, { useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";

// Fallback placeholder image as data URI
const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect fill='%23e5e7eb' width='640' height='360'/%3E%3Ctext fill='%236b7280' font-family='system-ui,-apple-system' font-size='24' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E" + encodeURIComponent("No Image") + "%3C/text%3E%3C/svg%3E";

export default function ResourceCard({ r }) {
  const [failedImages, setFailedImages] = useState(new Set());
  const settings = { dots: true, infinite: true, speed: 300, slidesToShow: 1, slidesToScroll: 1 };

  const handleImageError = (index) => {
    setFailedImages(prev => new Set([...prev, index]));
  };

  const images = r.images && r.images.length > 0 ? r.images : [];
  const validImages = images.filter((_, i) => !failedImages.has(i));

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, backgroundColor: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <h3 style={{ marginTop: 0 }}>{r.name}</h3>
      <div style={{ marginBottom: 8, color: "#555" }}>{r.type} • {r.location} • cap {r.capacity}</div>
      <div style={{ marginBottom: 8, minHeight: 220 }}>
        {images.length > 0 ? (
          <Slider {...settings}>
            {images.map((src, i) => (
              <div key={i}>
                <img 
                  src={failedImages.has(i) ? placeholderImage : src} 
                  alt={`${r.name} - Image ${i + 1}`}
                  style={{ width: "100%", height: 220, objectFit: "cover", backgroundColor: "#e5e7eb" }}
                  onError={() => handleImageError(i)}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <div style={{ width: "100%", height: 220, backgroundColor: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4 }}>
            <img src={placeholderImage} alt="No image available" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
      </div>
      <div style={{ marginBottom: 8 }}>
        {r.amenities?.map(a => <span key={a} style={{ marginRight: 8, fontSize: 12, background: "#a4c0de", padding: "4px 8px", borderRadius: 12 }}>{a}</span>)}
      </div>
      <Link to={`/resources/${r.id}`}>View & Book</Link>
    </div>
  );
}
