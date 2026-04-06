"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Page() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const [slug, setSlug] = useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  async function handleCreateEvent(e) {
    e.preventDefault();
    setCreatingEvent(true);

    const finalSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const { error } = await supabase.from("events").insert([
      {
        title,
        location,
        category,
        start_date: startDate || null,
        end_date: endDate || null,
        description,
        slug: finalSlug,
        access_password: accessPassword || "familie123",
        admin_password: adminPassword || "admin123",
      },
    ]);

    if (error) {
      console.error("Fehler beim Erstellen:", error);
      alert("Ereignis konnte nicht erstellt werden: " + error.message);
    } else {
      alert("Ereignis erstellt.");

      setTitle("");
      setLocation("");
      setCategory("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setSlug("");
      setAccessPassword("");
      setAdminPassword("");
      setShowCreateForm(false);
    }

    setCreatingEvent(false);
  }
