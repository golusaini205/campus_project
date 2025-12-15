import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client.js";
import BookForm from "../components/BookForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ResourceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [resource, setResource] = useState(null);

  useEffect(() => {
    apiFetch(`/api/resources/${id}`).then(({ resource }) => setResource(resource)).catch(err => alert(err.message));
  }, [id]);

  return resource ? (
    <div>
      <h2>{resource.name}</h2>
      <div style={{ color: "#555" }}>{resource.type} • {resource.location} • cap {resource.capacity}</div>
      <div style={{ marginTop: 16 }}>
        {user ? <BookForm resourceId={resource.id} onBooked={() => {}} /> : <p>Login to book this resource.</p>}
      </div>
    </div>
  ) : <p>Loading...</p>;
}
