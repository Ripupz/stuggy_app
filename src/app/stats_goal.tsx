import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { Button, Dimensions, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';
import BottomNavBar from '../lib/utils/navbar'; // adjust the path if needed
import { useScore } from '../lib/utils/userCourses'; // adjust path if needed

const screenWidth = Dimensions.get("window").width;

type ScoreEntry = { semester: string; score: number };
type Course = { id: string; name: string; scoreData: ScoreEntry[] };

// Custom SVG Line Chart Component
const SVGLineChart = ({ data, width, height }: { data: any; width: number; height: number }) => {
  if (!data.datasets[0].data.length || data.datasets[0].data.every((d: number) => d === 0)) {
    return (
      <View style={{ width, height, backgroundColor: '#fff', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
        <Text style={{ color: '#888' }}>No data to display</Text>
      </View>
    );
  }

  const padding = 40;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);
  
  const maxValue = Math.max(...data.datasets[0].data, 100); // Ensure minimum scale of 100
  const minValue = Math.min(...data.datasets[0].data, 0);
  const valueRange = maxValue - minValue || 1;
  
  const points = data.datasets[0].data.map((value: number, index: number) => {
    const x = padding + (index * chartWidth) / (data.datasets[0].data.length - 1 || 1);
    const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
    return { x, y, value };
  });
  
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 16, marginLeft: 20, padding: 10 }}>
      <Svg width={width} height={height}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = padding + chartHeight * (1 - ratio);
          return (
            <Line
              key={`grid-${index}`}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#f0f0f0"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Chart line */}
        <Polyline
          points={pathData.replace(/[ML]/g, '').trim()}
          fill="none"
          stroke="#49250D"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <Circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="#49250D"
            stroke="#fff"
            strokeWidth="2"
          />
        ))}
        
        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = padding + chartHeight * (1 - ratio);
          const value = Math.round(minValue + (valueRange * ratio));
          return (
            <SvgText
              key={`y-label-${index}`}
              x={padding - 10}
              y={y + 4}
              fontSize="12"
              fill="#3A1F0F"
              textAnchor="end"
            >
              {value}
            </SvgText>
          );
        })}
        
        {/* X-axis labels */}
        {data.labels.map((label: string, index: number) => {
          const x = padding + (index * chartWidth) / (data.labels.length - 1 || 1);
          return (
            <SvgText
              key={`x-label-${index}`}
              x={x}
              y={height - 10}
              fontSize="12"
              fill="#3A1F0F"
              textAnchor="middle"
            >
              {label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};

const GoalsStat = () => {
  const router = useRouter();
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
          },
        ],
      }
    : {
        labels: [""],
        datasets: [{ data: [0] }],
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

  // Calculate average scores data
  const averageScoresData = () => {
    if (userCourses.length === 0 || !userCourses.some(c => c.scoreData.length > 0)) {
      return { labels: [""], datasets: [{ data: [0] }] };
    }

    // Collect all unique semesters
    const allSems = userCourses.reduce((acc, course) => {
      course.scoreData.forEach(sd => {
        if (!acc.includes(sd.semester)) acc.push(sd.semester);
      });
      return acc;
    }, [] as string[]);

    // Sort semesters numerically if possible
    const sortedSems = allSems.sort((a, b) => {
      const anum = parseInt(a.replace(/\D/g, ""));
      const bnum = parseInt(b.replace(/\D/g, ""));
      return anum - bnum;
    });

    const averageData = sortedSems.map(sem => {
      // Average score for this semester across all courses
      const scores = userCourses
        .map(c => c.scoreData.find(sd => sd.semester === sem)?.score)
        .filter(score => score !== undefined) as number[];
      if (scores.length === 0) return 0;
      return scores.reduce((a, b) => a + b, 0) / scores.length;
    });

    return {
      labels: sortedSems,
      datasets: [{ data: averageData }],
    };
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Back Button styled like profile page */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.push('/homepage')}
      >
        <AntDesign name="arrowleft" size={28} color="#7B5A36" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
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
                  <MaterialIcons name="more-vert" size={18} color={item.id === selectedCourseId ? "#FFFFFF" : "#49250D"} />
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
            <SVGLineChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
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
          <SVGLineChart
            data={averageScoresData()}
            width={screenWidth - 40}
            height={220}
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
      <BottomNavBar active="stats" />
    </View>
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
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f3e9e2",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  navText: {
    fontSize: 12,
    color: "#49250D",
    marginTop: 2,
  },
  backBtn: {
    marginLeft: 18,
    marginTop: 50,
    marginBottom: 0,
    alignSelf: 'flex-start',
  },
});