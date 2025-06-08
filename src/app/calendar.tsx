import { useRouter } from "expo-router";
import React, { useState } from "react";

const router = useRouter();
const priorities = ["urgent", "less urgent", "important", "less important"];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    time: "",
    date: "",
    priority: ""
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [originalDateKey, setOriginalDateKey] = useState(null);


  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const calendarDates = [];
  for (let i = 0; i < (startDay === 0 ? 6 : startDay - 1); i++) calendarDates.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDates.push(new Date(year, month, d));
  }

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setFormData((prev) => ({ ...prev, date: date.toISOString().split('T')[0] }));
  };

  const handleAddEvent = () => {
    if (!selectedDate) return;
    setFormData({ title: "", time: "", date: selectedDate.toISOString().split('T')[0], priority: "" });
    setEditIndex(null);
    setIsModalOpen(true);
  };

const handleEditEvent = (index) => {
    const data = events[selectedDate.toDateString()][index];
    setFormData({ ...data });
    setEditIndex(index);
    setOriginalDateKey(selectedDate.toDateString()); // Save the original date
    setIsModalOpen(true);
    };


const handleSubmit = (e) => {
    e.preventDefault();

    const newDateKey = new Date(formData.date).toDateString();
    const updated = { ...events };

    if (editIndex !== null) {
        // If date changed, remove from old date
        if (originalDateKey !== newDateKey) {
        updated[originalDateKey].splice(editIndex, 1);
        // Clean up if no more events on that date
        if (updated[originalDateKey].length === 0) {
            delete updated[originalDateKey];
        }
        if (!updated[newDateKey]) updated[newDateKey] = [];
        updated[newDateKey].push(formData);
        } else {
        // If date didn't change, just update
        updated[newDateKey][editIndex] = formData;
        }
    } else {
        if (!updated[newDateKey]) updated[newDateKey] = [];
        updated[newDateKey].push(formData);
    }

    updated[newDateKey].sort((a, b) => a.time.localeCompare(b.time));

    setEvents(updated);
    setIsModalOpen(false);
    setEditIndex(null);
    setKey(null);
    };


  const changeMonth = (offset) => {
    const newMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() + offset));
    setCurrentMonth(new Date(newMonth));
    setSelectedDate(null);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", backgroundColor: "#fdfaf5", minHeight: "100vh" }}>
      {/* HEADER */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
        {/* Top Row: Home and Add */}
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 20px", marginBottom: "10px" }}>
            <button
            onClick={() => window.location.href = "/homepage"}
            style={{
                background: "none", border: "none", fontSize: "37px", color: "#3a1f0f", cursor: "pointer", fontWeight: "bold"
            }}
            >
            ⬅ 
            </button>

            <button
            onClick={handleAddEvent}
            style={{
                background: "none", border: "none", fontSize: "30px", color: "#3a1f0f", cursor: "pointer", fontWeight: "bold"
            }}
            >
            ＋ 
            </button>
        </div>

        {/* Year above month */}
        <div style={{ textAlign: "center", fontSize: "15px", color: "#7c5a45", fontWeight: "bold", marginTop:"-4px",marginBottom: "-10px" }}>
        {currentMonth.getFullYear()}
        </div>

        {/* Month and Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
            onClick={() => changeMonth(-1)}
            style={{ background: "none", border: "none", fontSize: "30px", color: "#3a1f0f", cursor: "pointer" }}
        >
            ‹
        </button>

        <h2 style={{
            fontWeight: "bold", backgroundColor: "#a97b5d", color: "#fff",
            padding: "6px 18px", borderRadius: "10px", minWidth: "120px", textAlign: "center"
        }}>
            {currentMonth.toLocaleString("default", { month: "long" })}
        </h2>

        <button
            onClick={() => changeMonth(1)}
            style={{ background: "none", border: "none", fontSize: "30px", color: "#3a1f0f", cursor: "pointer" }}
        >
            ›
        </button>
        </div>

        </div>
      

      {/* WEEKDAYS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginTop: "10px", textAlign: "center" }}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} style={{ color: "#7c5a45", fontSize: "12px" }}>{day}</div>
        ))}
        {calendarDates.map((date, idx) => {
          const isToday = date?.toDateString() === new Date().toDateString();
          const isSelected = selectedDate && date?.toDateString() === selectedDate.toDateString();
          return (
            <div
              key={idx}
              onClick={() => date && handleDateClick(date)}
              style={{
                height: "40px",
                lineHeight: "40px",
                cursor: date ? "pointer" : "default",
                backgroundColor: isSelected ? "#a97b5d" : "transparent",
                color: isSelected ? "#fff" : "#3a1f0f",
                borderRadius: "6px",
                fontWeight: "bold",
                border: isToday ? "1px solid #a97b5d" : "none"
              }}
            >
              {date ? date.getDate() : ""}
            </div>
          );
        })}
      </div>

      {/* EVENTS LIST */}
      {selectedDate && (
        <div style={{ marginTop: "30px", color: "#3a1f0f" }}>
          <h4 style={{ fontWeight: "bold" }}>
            {selectedDate.getDate()} {selectedDate.toLocaleString("default", { month: "long" })} {selectedDate.getFullYear()}
          </h4>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
            {(events[selectedDate.toDateString()] || []).map((ev, idx) => (
              <li key={idx} style={{
            marginBottom: "12px",
            padding: "8px 10px",
            backgroundColor: "#f8f1e7",
            borderRadius: "10px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            position: "relative"
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontWeight: "bold", fontSize: "13px" }}>{ev.time}</span>
                <span style={{
                    padding: "2px 8px",
                    borderRadius: "8px",
                    backgroundColor: "#e9dfc9",
                    fontSize: "12px"
                }}>{ev.priority}</span>
                </div>
                <button
                onClick={() => handleEditEvent(idx)}
                style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#3a1f0f", fontSize: "14px"
                }}
                >✏️</button>
            </div>
            <div style={{ marginTop: "4px", fontSize: "14px", color: "#3a1f0f" }}>
                {ev.title}
            </div>
            </li>


            ))}
          </ul>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: "#fffaf2", padding: "20px", borderRadius: "20px",
              width: "320px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", fontFamily: "sans-serif", position: "relative",
              display: "flex", flexDirection: "column", alignItems: "center"
            }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: "absolute", top: "12px", left: "12px",
                background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#3a1f0f"
              }}
              type="button"
            >←</button>

            <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#3a1f0f", fontWeight: "bold" }}>Add Activity</h3>

            <input
              placeholder="activity name"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{
                width: "89%", padding: "10px", backgroundColor: "#e9dfc9", border: "none",
                borderRadius: "8px", marginBottom: "12px"
              }}
              required
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              style={{
                width: "89%", padding: "10px", backgroundColor: "#e9dfc9", border: "none",
                borderRadius: "8px", marginBottom: "12px"
              }}
              required
            />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              style={{
                width: "89%", padding: "10px", backgroundColor: "#e9dfc9", border: "none",
                borderRadius: "8px", marginBottom: "12px"
              }}
              required
            />
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              style={{
                width: "95%", padding: "10px", backgroundColor: "#e9dfc9", border: "none",
                borderRadius: "8px", marginBottom: "16px"
              }}
              required
            >
              <option value="">Select priority</option>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>

            <button
              type="submit"
              style={{
                backgroundColor: "#a97b5d", color: "#fff", padding: "10px", borderRadius: "16px",
                width: "30%", fontWeight: "bold", border: "none"
              }}
            >
              DONE
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
