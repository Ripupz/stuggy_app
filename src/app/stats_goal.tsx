import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from "react";
import { Button, Dimensions, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useScore } from './lib/utils/userCourses'; // adjust path if needed

const screenWidth = Dimensions.get("window").width;

type ScoreEntry = { semester: string; score: number };
type Course = { id: string; name: string; scoreData: ScoreEntry[] };

const GoalsStat = () => {
  const { userCourses, setUserCourses } = useScore();
  const [modalVisible, setModalVisible] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [showScoreInput, setShowScoreInput] = useState(false);
  const [scoreInputs, setScoreInputs] = useState<{ semester: string; score: string }[]>([{ semester: "Sem 1", score: "" }]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [menuVisibleId, setMenuVisibleId] = useState<string | null>(null);

  const selectedCourse = userCourses.find(c => c.id === selectedCourseId);

  const chartData = selectedCourse && selectedCourse.scoreData.length > 0
    ? {
        labels: selectedCourse.scoreData.map((item) => item.semester),
        datasets: [
          {
            data: selectedCourse.scoreData.map((item) => item.score),
            strokeWidth: 2,
          },
        ],
      }
    : {
        labels: [""],
        datasets: [{ data: [0] }],
      };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(58, 31, 15, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(58, 31, 15, ${opacity})`,
    strokeWidth: 2,
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#49250D",
    },
  };

  // Add new course
  const handleAddCourse = () => {
    if (courseName.trim() !== "") {
      const newCourse: Course = {
        id: Date.now().toString(),
        name: courseName,
        scoreData: [],
      };
      setUserCourses([...userCourses, newCourse]);
      setSelectedCourseId(newCourse.id);
      setShowScoreInput(true);
      setEditMode(false);
    }
  };

  // Add new semester input
  const handleAddSemesterInput = () => {
    const nextSem = `Sem ${scoreInputs.length + 1}`;
    setScoreInputs([...scoreInputs, { semester: nextSem, score: "" }]);
  };

  // Remove last semester input
  const handleRemoveSemesterInput = () => {
    if (scoreInputs.length > 1) {
      setScoreInputs(scoreInputs.slice(0, -1));
    }
  };

  // Change score input
  const handleScoreChange = (index: number, value: string) => {
    setScoreInputs((prev) =>
      prev.map((input, i) =>
        i === index ? { ...input, score: value } : input
      )
    );
  };

  // Save scores (add or edit)
  const handleSaveScores = () => {
    if (
      selectedCourseId &&
      scoreInputs.every(
        (input) => input.score.trim() !== "" && !isNaN(Number(input.score))
      )
    ) {
      setUserCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === selectedCourseId
            ? {
                ...course,
                name: courseName,
                scoreData: scoreInputs.map((input) => ({
                  semester: input.semester,
                  score: Number(input.score),
                })),
              }
            : course
        )
      );
      setModalVisible(false);
      setCourseName("");
      setScoreInputs([{ semester: "Sem 1", score: "" }]);
      setShowScoreInput(false);
      setEditMode(false);
    }
  };

  // When pressing a course, open modal in edit mode
  const handleEditCourse = (course: Course) => {
    setSelectedCourseId(course.id);
    setCourseName(course.name);
    setScoreInputs(
      course.scoreData.length > 0
        ? course.scoreData.map(sd => ({
            semester: sd.semester,
            score: sd.score.toString(),
          }))
        : [{ semester: "Sem 1", score: "" }]
    );
    setModalVisible(true);
    setShowScoreInput(true);
    setEditMode(true);
  };

  // Remove course handler
  const handleRemoveCourse = (courseId: string) => {
    setUserCourses(prev => prev.filter(c => c.id !== courseId));
    setMenuVisibleId(null);
    setModalVisible(false);
    setShowScoreInput(false);
    setCourseName("");
    setScoreInputs([{ semester: "Sem 1", score: "" }]);
    setEditMode(false);
    if (selectedCourseId === courseId) setSelectedCourseId(null);
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Your Courses</Text>
      {userCourses.length === 0 && (
        <Text style={styles.placeholderText}>add your Courses!</Text>
      )}
      <FlatList
        data={userCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }}>
            <TouchableOpacity
              style={[
                styles.courseItem,
                item.id === selectedCourseId && styles.selectedCourse,
                { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }
              ]}
              onPress={() => setSelectedCourseId(item.id)}
              activeOpacity={0.7}
            >
              <Text style={{ color: item.id === selectedCourseId ? "#fff" : "#49250D" }}>
                {item.name}
              </Text>
              <TouchableOpacity
                onPress={() => handleEditCourse(item)}
                style={{ padding: 8 }}
              >
                <MaterialIcons name="more-vert" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </TouchableOpacity>
            {menuVisibleId === item.id && (
              <View style={styles.menuBox}>
                <TouchableOpacity
                  onPress={() => {
                    handleEditCourse(item);
                    setMenuVisibleId(null);
                  }}
                  style={styles.menuItem}
                >
                  <Text>Edit Scores</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRemoveCourse(item.id)}
                  style={styles.menuItem}
                >
                  <Text style={{ color: "#B4656F" }}>Remove Course</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        style={{ marginLeft: 20, marginBottom: 20 }}
        scrollEnabled={false}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setModalVisible(true);
          setShowScoreInput(false);
          setCourseName("");
          setScoreInputs([{ semester: "Sem 1", score: "" }]);
          setEditMode(false);
        }}
      >
        <Text style={styles.addButtonText}>+ Add Course</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Score Progress</Text>
      {selectedCourse ? (
        selectedCourse.scoreData.length > 0 ? (
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={{ marginLeft: 20, borderRadius: 16 }}
          />
        ) : (
          <Text style={styles.placeholderText}>
            Add score data to see your progress!
          </Text>
        )
      ) : (
        <Text style={styles.placeholderText}>
          Select a course to see its score progress!
        </Text>
      )}

      <Text style={styles.title}>Average Score per Semester</Text>
      {userCourses.length > 0 && userCourses.some(c => c.scoreData.length > 0) ? (
        <LineChart
          data={{
            labels: (() => {
              // Collect all unique semesters
              const allSems = userCourses.reduce((acc, course) => {
                course.scoreData.forEach(sd => {
                  if (!acc.includes(sd.semester)) acc.push(sd.semester);
                });
                return acc;
              }, [] as string[]);
              // Sort semesters numerically if possible
              return allSems.sort((a, b) => {
                const anum = parseInt(a.replace(/\D/g, ""));
                const bnum = parseInt(b.replace(/\D/g, ""));
                return anum - bnum;
              });
            })(),
            datasets: [
              {
                data: (() => {
                  const allSems = userCourses.reduce((acc, course) => {
                    course.scoreData.forEach(sd => {
                      if (!acc.includes(sd.semester)) acc.push(sd.semester);
                    });
                    return acc;
                  }, [] as string[]);
                  return allSems.sort((a, b) => {
                    const anum = parseInt(a.replace(/\D/g, ""));
                    const bnum = parseInt(b.replace(/\D/g, ""));
                    return anum - bnum;
                  }).map(sem => {
                    // Average score for this semester across all courses
                    const scores = userCourses
                      .map(c => c.scoreData.find(sd => sd.semester === sem)?.score)
                      .filter(score => score !== undefined) as number[];
                    if (scores.length === 0) return 0;
                    return scores.reduce((a, b) => a + b, 0) / scores.length;
                  });
                })(),
                strokeWidth: 2,
              },
            ],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={{ marginLeft: 20, borderRadius: 16 }}
        />
      ) : (
        <Text style={styles.placeholderText}>
          Add scores to see the average per semester!
        </Text>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setShowScoreInput(false);
          setCourseName("");
          setScoreInputs([{ semester: "Sem 1", score: "" }]);
          setEditMode(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {!showScoreInput ? (
              <>
                <Text style={styles.modalTitle}>Add Course</Text>
                <TextInput
                  placeholder="Course Name"
                  value={courseName}
                  onChangeText={setCourseName}
                  style={styles.input}
                />
                <Button title="Next" onPress={handleAddCourse} />
              </>
            ) : (
              <>
                <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                  <Text style={styles.modalTitle}>{editMode ? "Edit Scores" : "Add Your Scores!"}</Text>
                  {editMode && (
                    <TouchableOpacity
                      onPress={() => {
                        if (selectedCourseId) handleRemoveCourse(selectedCourseId);
                      }}
                      style={{ marginLeft: 10, backgroundColor: "#B4656F", padding: 8, borderRadius: 8 }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>Remove Course</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <ScrollView style={{ width: "100%" }}>
                  <TextInput
                    placeholder="Course Name"
                    value={courseName}
                    onChangeText={setCourseName}
                    style={styles.input}
                  />
                  {scoreInputs.map((input, idx) => (
                    <View key={input.semester} style={{ marginBottom: 12 }}>
                      <Text style={{ fontSize: 16, marginBottom: 4 }}>{input.semester}</Text>
                      <TextInput
                        placeholder="Score"
                        value={input.score}
                        onChangeText={(val) => handleScoreChange(idx, val)}
                        style={styles.input}
                        keyboardType="numeric"
                      />
                    </View>
                  ))}
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity
                      style={styles.addSemButton}
                      onPress={handleAddSemesterInput}
                    >
                      <Text style={styles.addSemButtonText}>+ Add Semester</Text>
                    </TouchableOpacity>
                    {scoreInputs.length > 1 && (
                      <TouchableOpacity
                        style={[styles.addSemButton, { backgroundColor: "#B4656F" }]}
                        onPress={handleRemoveSemesterInput}
                      >
                        <Text style={[styles.addSemButtonText, { color: "#fff" }]}>- Remove Semester</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <Button title="Save Scores" onPress={handleSaveScores} />
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default GoalsStat;

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  courseItem: {
    fontSize: 20,
    marginLeft: 10,
    marginBottom: 5,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f3e9e2",
    marginRight: 20,
    marginVertical: 4,
  },
  selectedCourse: {
    backgroundColor: "#49250D",
  },
  addButton: {
    backgroundColor: "#49250D",
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginLeft: 20,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  addSemButton: {
    backgroundColor: "#e0c7b7",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    marginRight: 8,
  },
  addSemButtonText: {
    color: "#49250D",
    fontSize: 14.8,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 16,
  },
  placeholderText: {
    fontSize: 18,
    color: "#888",
    marginLeft: 20,
    marginBottom: 20,
  },
  menuBox: {
    position: "absolute",
    right: 0,
    top: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
    minWidth: 120,
  },
  menuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    color: "#ffff",
  },
});