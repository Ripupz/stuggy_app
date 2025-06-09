import { AntDesign, Entypo } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import BottomNavBar from '../lib/utils/navbar';
import supabase from '../lib/utils/supabase';

type EventData = {
  id?: string;
  title: string;
  time: string;
  date: string;
  priority: string;
};
type EventsMap = { [date: string]: EventData[] };

const priorities = ["urgent", "less urgent", "important", "less important"];

// Helper to get local date string in YYYY-MM-DD
function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Record<string, EventData[]>>({});
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
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [menuVisibleIdx, setMenuVisibleIdx] = useState<number | null>(null);

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
    setFormData((prev) => ({ ...prev, date: toLocalDateString(date) }));
  };

  const handleAddEvent = () => {
    const dateToUse = selectedDate ?? new Date();
    setSelectedDate(dateToUse);
    setFormData({ title: "", time: "", date: toLocalDateString(dateToUse), priority: "" });
    setEditIndex(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (index: number) => {
    if (!selectedDate) return;
    const dateKey = selectedDate.toDateString();
    const data = events[dateKey][index];
    setFormData({ ...data });
    setEditIndex(index);
    setOriginalDateKey(dateKey);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const newDateKey = new Date(formData.date).toDateString();
    const updated = { ...events };

    if (editIndex !== null && originalDateKey !== null) {
      const eventId = events[originalDateKey][editIndex].id;
      await supabase.from('events').update({
        title: formData.title,
        date: formData.date,
        time: formData.time,
        priority: formData.priority,
      }).eq('id', eventId);
    }

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

    if (editIndex !== null && originalDateKey !== null) {
      const eventId = events[originalDateKey][editIndex].id;
      await supabase.from('events').update({
        title: formData.title,
        date: formData.date,
        time: formData.time,
        priority: formData.priority,
      }).eq('id', eventId);
    }

    // Save to Supabase
    if (editIndex === null) {
      await supabase.from('events').insert([
        {
          // user_id: userId, // add if you have user auth
          title: formData.title,
          date: formData.date,
          time: formData.time,
          priority: formData.priority,
        }
      ]);
    } else {
      // For edit, update the event in Supabase (you need to store event id in your data)
      const eventId = events[originalDateKey!][editIndex].id;
      await supabase.from('events').update({
        title: formData.title,
        date: formData.date,
        time: formData.time,
        priority: formData.priority,
      }).eq('id', eventId);
    }

    // Optionally re-fetch events from Supabase here
  };

  

  const handleRemoveEvent = async (idx: number) => {
    if (!selectedDate) return;
    const dateKey = selectedDate.toDateString();
    const eventId = events[dateKey][idx].id;
    await supabase.from('events').delete().eq('id', eventId);

    // Update local state as before
    const updated = { ...events };
    updated[dateKey].splice(idx, 1);
    if (updated[dateKey].length === 0) {
      delete updated[dateKey];
    }
    setEvents(updated);
  };

  const changeMonth = (offset: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
    setSelectedDate(null);
  };

  useEffect(() => {
  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*');
      // .eq('user_id', userId); // Uncomment if needed

    if (error) {
      console.error('Error fetching events:', error.message);
      return;
    }

    if (data) {
      const grouped: EventsByDate = {};
      data.forEach(ev => {
        if (!grouped[ev.date]) grouped[ev.date] = [];
        grouped[ev.date].push(ev);
      });
      setEvents(grouped);
    }
  };

  fetchEvents();
}, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.push("/homepage")}
          >
            <AntDesign name="arrowleft" size={28} color="#7B5A36" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={handleAddEvent}>
            <Text style={styles.addBtnText}>＋</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setIsYearPickerOpen(true)}>
          <Text style={styles.year}>{currentMonth.getFullYear()}</Text>
        </TouchableOpacity>
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <Text style={styles.monthNavButton}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsMonthPickerOpen(true)}>
            <Text style={styles.monthName}>
              {currentMonth.toLocaleString("default", { month: "long" })}
            </Text>
          </TouchableOpacity>
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
            const dateKey = date?.toDateString();
            const isToday = dateKey === new Date().toDateString();
            const isSelected = selectedDate && dateKey === selectedDate.toDateString();
            const hasEvents = dateKey && events[dateKey] && events[dateKey].length > 0;

            return (
              <TouchableOpacity
                key={idx}
                onPress={() => date && handleDateClick(date)}
                style={[
                  styles.date,
                  isSelected && styles.selectedDate,
                  isToday && styles.todayDate,
                  hasEvents && styles.hasEventDate,
                ]}
              >
                <Text
                  style={[
                    styles.dateText,
                    isSelected && styles.selectedDateText,
                    hasEvents && styles.hasEventText,
                  ]}
                >
                  {date ? date.getDate() : ""}
                </Text>
                {hasEvents && (
                  <View style={styles.eventDot} />
                )}
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
                  <View style={styles.eventTimePriority}>
                    <Text style={styles.eventTime}>{ev.time}</Text>
                    <Text style={styles.eventPriority}>{ev.priority}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={styles.eventTitle}>{ev.title}</Text>
                  <TouchableOpacity
                    onPress={() => handleEditEvent(idx)}
                    style={styles.menuButton}
                  >
                    <Entypo name="dots-three-vertical" size={18} color="#3a1f0f" />
                  </TouchableOpacity>
                </View>
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
                  <AntDesign name="arrowleft" size={28} color="#7B5A36" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{editIndex !== null ? "Edit Activity" : "Add Activity"}</Text>
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
                  placeholder="Time (HH:MM)"
                  value={formData.time}
                  onChangeText={(text) => {
                    // Allow only numbers and colon, max length 5, auto-insert colon
                    let formatted = text.replace(/[^0-9:]/g, '').slice(0, 5);
                    // Auto-insert colon after 2 digits if not present
                    if (formatted.length === 2 && !formatted.includes(':')) {
                      formatted += ':';
                    }
                    setFormData({ ...formData, time: formatted });
                  }}
                  keyboardType="numeric"
                  maxLength={5}
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
                {/* In your modalContent, after the close/back button */}
                {editIndex !== null && (
                  <TouchableOpacity
                    onPress={() => {
                      handleRemoveEvent(editIndex);
                      setIsModalOpen(false);
                    }}
                    style={[styles.removeButton, { left: undefined, right: 12 }]} // top right
                  >
                    <AntDesign name="delete" size={24} color="#b22222" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Modal>
        )}

        {/* YEAR PICKER MODAL */}
        {isYearPickerOpen && (
          <Modal
            transparent
            animationType="fade"
            visible={isYearPickerOpen}
            onRequestClose={() => setIsYearPickerOpen(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { alignItems: 'center' }]}>
                <Text style={styles.modalTitle}>Pick a Year</Text>
                <ScrollView style={{ maxHeight: 300 }}>
                  {Array.from({ length: 21 }, (_, i) => {
                    const yearOption = new Date().getFullYear() - 10 + i;
                    return (
                      <TouchableOpacity
                        key={yearOption}
                        onPress={() => {
                          const newDate = new Date(currentMonth);
                          newDate.setFullYear(yearOption);
                          setCurrentMonth(newDate);
                          setIsYearPickerOpen(false);
                        }}
                        style={{
                          padding: 12,
                          backgroundColor: yearOption === currentMonth.getFullYear() ? '#a97b5d' : 'transparent',
                          borderRadius: 8,
                          marginBottom: 4,
                        }}
                      >
                        <Text style={{
                          color: yearOption === currentMonth.getFullYear() ? '#fff' : '#3a1f0f',
                          fontWeight: yearOption === currentMonth.getFullYear() ? 'bold' : 'normal',
                          fontSize: 18,
                          textAlign: 'center',
                        }}>
                          {yearOption}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                <TouchableOpacity onPress={() => setIsYearPickerOpen(false)} style={{ marginTop: 16 }}>
                  <Text style={{ color: '#a97b5d', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* MONTH PICKER MODAL */}
        {isMonthPickerOpen && (
          <Modal
            transparent
            animationType="fade"
            visible={isMonthPickerOpen}
            onRequestClose={() => setIsMonthPickerOpen(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { alignItems: 'center' }]}>
                <Text style={styles.modalTitle}>Pick a Month</Text>
                <ScrollView style={{ maxHeight: 300 }}>
                  {Array.from({ length: 12 }, (_, i) => {
                    const monthName = new Date(2000, i, 1).toLocaleString("default", { month: "long" });
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={() => {
                          const newDate = new Date(currentMonth);
                          newDate.setMonth(i);
                          setCurrentMonth(newDate);
                          setIsMonthPickerOpen(false);
                        }}
                        style={{
                          padding: 12,
                          backgroundColor: i === currentMonth.getMonth() ? '#a97b5d' : 'transparent',
                          borderRadius: 8,
                          marginBottom: 4,
                        }}
                      >
                        <Text style={{
                          color: i === currentMonth.getMonth() ? '#fff' : '#3a1f0f',
                          fontWeight: i === currentMonth.getMonth() ? 'bold' : 'normal',
                          fontSize: 18,
                          textAlign: 'center',
                        }}>
                          {monthName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                <TouchableOpacity onPress={() => setIsMonthPickerOpen(false)} style={{ marginTop: 16 }}>
                  <Text style={{ color: '#a97b5d', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
      <BottomNavBar active="home" />
    </View>
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
    fontSize: 25, // bigger
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
    fontSize: 50, // bigger
    color: "#3a1f0f",
    marginHorizontal: 20, // slightly bigger gap
  },
  monthName: {
    fontWeight: "bold",
    backgroundColor: "#a97b5d",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 10, // bigger
    borderRadius: 10,
    minWidth: 120, // bigger
    textAlign: "center",
    fontSize: 20, 
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
  eventTimePriority: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
  },
  eventPriority: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "#e9dfc9",
    fontSize: 12,
    color: "#3a1f0f",
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
  hasEventDate: {
    borderColor: '#DED193',
    borderWidth: 2,
  },
  hasEventText: {
    color: '#DED193',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DED193',
    marginTop: 2,
  },
  addBtn: {
    marginRight: 18,
    marginTop: 30,
    marginBottom: 0,
    alignSelf: 'flex-start',
  },
  addBtnText: {
    fontSize: 32,
    color: "#7B5A36", // same as back arrow
    fontWeight: "bold",
  },
    backBtn: {
  marginLeft: 18,
  marginTop: 40,
  marginBottom: 0,
  alignSelf: 'flex-start',
},
menuButton: {
  position: 'relative',
},
menuOptions: {
  position: 'absolute',
  top: 28,
  right: 0,
  backgroundColor: '#fff',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#ccc',
  zIndex: 10,
  padding: 6,
  minWidth: 80,
  elevation: 5,
},
menuOptionText: {
  color: '#b22222',
  fontWeight: 'bold',
},
removeButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  padding: 6,
  zIndex: 2,
},
});
