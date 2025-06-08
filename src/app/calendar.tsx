import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type EventData = {
  title: string;
  time: string;
  date: string;
  priority: string;
};
type EventsMap = { [date: string]: EventData[] };

const priorities = ["urgent", "less urgent", "important", "less important"];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<EventsMap>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<EventData>({
    title: "",
    time: "",
    date: "",
    priority: ""
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [originalDateKey, setOriginalDateKey] = useState<string | null>(null);

  const router = useRouter();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const calendarDates: (Date | null)[] = [];
  for (let i = 0; i < (startDay === 0 ? 6 : startDay - 1); i++) calendarDates.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDates.push(new Date(year, month, d));
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setFormData((prev) => ({ ...prev, date: date.toISOString().split('T')[0] }));
  };

  const handleAddEvent = () => {
    if (!selectedDate) return;
    setFormData({ title: "", time: "", date: selectedDate.toISOString().split('T')[0], priority: "" });
    setEditIndex(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (index: number) => {
    if (!selectedDate) return;
    const data = events[selectedDate.toDateString()][index];
    setFormData({ ...data });
    setEditIndex(index);
    setOriginalDateKey(selectedDate.toDateString());
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    const newDateKey = new Date(formData.date).toDateString();
    const updated = { ...events };

    if (editIndex !== null && originalDateKey) {
      if (originalDateKey !== newDateKey) {
        updated[originalDateKey].splice(editIndex, 1);
        if (updated[originalDateKey].length === 0) {
          delete updated[originalDateKey];
        }
        if (!updated[newDateKey]) updated[newDateKey] = [];
        updated[newDateKey].push(formData);
      } else {
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
    setOriginalDateKey(null);
  };

  const changeMonth = (offset: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
    setSelectedDate(null);
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/homepage")}>
          <Text style={styles.headerButton}>⬅</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddEvent}>
          <Text style={styles.headerButton}>＋</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.year}>{currentMonth.getFullYear()}</Text>
      <View style={styles.monthNav}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Text style={styles.monthNavButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthName}>
          {currentMonth.toLocaleString("default", { month: "long" })}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Text style={styles.monthNavButton}>›</Text>
        </TouchableOpacity>
      </View>

      {/* WEEKDAYS */}
      <View style={styles.weekdays}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <Text key={day} style={styles.weekday}>
            {day}
          </Text>
        ))}
      </View>

      {/* CALENDAR DATES */}
      <View style={styles.dates}>
        {calendarDates.map((date, idx) => {
          const isToday = date?.toDateString() === new Date().toDateString();
          const isSelected = selectedDate && date?.toDateString() === selectedDate.toDateString();
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => date && handleDateClick(date)}
              style={[styles.date, isSelected && styles.selectedDate, isToday && styles.todayDate]}
            >
              <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                {date ? date.getDate() : ""}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* EVENTS LIST */}
      {selectedDate && (
        <View style={styles.eventsList}>
          <Text style={styles.eventsDate}>
            {selectedDate.getDate()} {selectedDate.toLocaleString("default", { month: "long" })} {selectedDate.getFullYear()}
          </Text>
          {events[selectedDate.toDateString()]?.map((ev, idx) => (
            <View key={idx} style={styles.eventItem}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTime}>{ev.time}</Text>
                <Text style={styles.eventPriority}>{ev.priority}</Text>
                <TouchableOpacity onPress={() => handleEditEvent(idx)}>
                  <Text style={styles.editButton}>✏️</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.eventTitle}>{ev.title}</Text>
            </View>
          ))}
        </View>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <Modal
          transparent
          animationType="slide"
          visible={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>←</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Activity</Text>
              <TextInput
                placeholder="Activity name"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                style={styles.input}
              />
              <TextInput
                placeholder="Date"
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
                style={styles.input}
              />
              <TextInput
                placeholder="Time"
                value={formData.time}
                onChangeText={(text) => setFormData({ ...formData, time: text })}
                style={styles.input}
              />
              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>Priority</Text>
                <View style={styles.select}>
                  {priorities.map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      onPress={() => setFormData({ ...formData, priority })}
                      style={[
                        styles.selectOption,
                        formData.priority === priority && styles.selectedOption,
                      ]}
                    >
                      <Text style={styles.selectOptionText}>{priority}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>DONE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfaf5",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerButton: {
    fontSize: 37,
    color: "#3a1f0f",
    fontWeight: "bold",
  },
  year: {
    textAlign: "center",
    fontSize: 15,
    color: "#7c5a45",
    fontWeight: "bold",
    marginBottom: 10,
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  monthNavButton: {
    fontSize: 30,
    color: "#3a1f0f",
  },
  monthName: {
    fontWeight: "bold",
    backgroundColor: "#a97b5d",
    color: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 10,
    minWidth: 120,
    textAlign: "center",
  },
  weekdays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  weekday: {
    color: "#7c5a45",
    fontSize: 12,
    textAlign: "center",
    flex: 1,
  },
  dates: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  date: {
    height: 40,
    width: "13%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    marginBottom: 10,
  },
  selectedDate: {
    backgroundColor: "#a97b5d",
  },
  todayDate: {
    borderColor: "#a97b5d",
    borderWidth: 1,
  },
  dateText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  selectedDateText: {
    color: "#fff",
  },
  eventsList: {
    marginTop: 30,
    color: "#3a1f0f",
  },
  eventsDate: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  eventItem: {
    backgroundColor: "#f8f1e7",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    position: "relative",
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventTime: {
    fontWeight: "bold",
    fontSize: 14,
  },
  eventPriority: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: "#e9dfc9",
    fontSize: 12,
  },
  editButton: {
    color: "#3a1f0f",
    fontSize: 16,
  },
  eventTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#3a1f0f",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fffaf2",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    maxWidth: 400,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#3a1f0f",
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "#3a1f0f",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 10,
    backgroundColor: "#e9dfc9",
    borderRadius: 8,
    marginBottom: 12,
  },
  selectContainer: {
    width: "100%",
    marginBottom: 16,
  },
  selectLabel: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#3a1f0f",
  },
  select: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  selectOption: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#e9dfc9",
    marginBottom: 10,
    width: "48%",
  },
  selectedOption: {
    backgroundColor: "#a97b5d",
  },
  selectOptionText: {
    textAlign: "center",
    color: "#3a1f0f",
  },
  submitButton: {
    backgroundColor: "#a97b5d",
    padding: 10,
    borderRadius: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
