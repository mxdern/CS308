import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

import { AuthContext } from "../context/auth-context";
import { postRequest } from "../fetchComponents";
import { getRequest } from "../fetchComponents";

export default function ProfileScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [posts, setPosts] = useState([]);

  const [connections, setConnections] = useState([]);
  const [topics, setTopics] = useState([]);
  const [locations, setLocations] = useState([]);

  const [ModalVisibility, setModalVisibility] = useState(false);
  const [ModalVisibility2, setModalVisibility2] = useState(false);
  const [ModalVisibility3, setModalVisibility3] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const [addConnection, setAddConnection] = useState("");
  const [addTopic, setAddTopic] = useState("");
  const [addLocation, setAddLocation] = useState("");

  function like(email, post_id) {
    var data = {
      email: email,
      postId: post_id,
    };
    postRequest(data, "like", false);
    setRefresh(true);
  }

  function dislike(email, post_id) {
    var data = {
      email: email,
      postId: post_id,
    };
    setRefresh(true);
    postRequest(data, "dislike", false);
  }

  function deletePost(email, post_id) {
    var data = {
      email: email,
      _id: post_id,
    };
    postRequest(data, "deletePost", false);
    setRefresh(true);
  }

  function deleteAlert(post_id) {
    Alert.alert(
      "Are you sure?",
      "Your post will be deleted forever if you press OK.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => deletePost(email, post_id) },
      ],
      { cancelable: false }
    );
  }

  function submitConnection(email, addConnection) {
    var data = {
      email: email,
      username: addConnection,
    };
    setModalVisibility(false);
    setRefresh(true);
    setAddConnection("");
    postRequest(data, "addConnection", false);
  }

  function submitTopic(email, addTopic) {
    var data = {
      email: email,
      topic: addTopic,
    };

    postRequest(data, "subscribeTopic", false);
    setModalVisibility2(false);
    setRefresh(true);
    setAddTopic("");
  }

  function deleteTopic(email, topic) {
    var data = {
      email: email,
      topic: topic,
    };
    postRequest(data, "unsubscribeTopic", false);
    setRefresh(true);
  }

  function deleteLocation(email, location) {
    var data = {
      email: email,
      location: location,
    };
    postRequest(data, "unsubscribeLocation", false);
    setRefresh(true);
  }

  function deleteConnection(email, connection) {
    var data = {
      email: email,
      connection: connection,
    };
    postRequest(data, "deleteConnection", false);
    setRefresh(true);
  }

  function submitLocation(email, addLocation) {
    var data = {
      email: email,
      location: addLocation,
    };
    postRequest(data, "subscribeLocation", false);

    setAddLocation("");
    setModalVisibility3(false);
    setRefresh(true);
  }

  function getPosts(id) {
    var data = { id: id };
    postRequest(data, "showMyPosts", true).then((result) => {
      setPosts(result.posts.reverse());
    });
  }

  function getUserInfo(email) {
    getRequest(email).then((result) => {
      setId(result.user._id);
      setUsername(result.user.username);
      setProfileImage(result.user.profileImage);
      setConnections(result.user.friends);
      setLocations(result.user.locations);
      setTopics(result.user.topics);
      getPosts(result.user._id);
    });
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@logged_in_email");
      setEmail(value);
      getUserInfo(value);
      console.log(profileImage);

      if (value !== null) {
        // value previously stored
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  useEffect(() => {
    getData();
    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    const reRender = navigation.addListener("focus", () => {
      setRefresh(true);
    });

    return reRender;
  }, [navigation]);

  const Bio = () => (
    <View style={{ margin: 10 }}>
      <TouchableOpacity
        style={{ width: 120, alignSelf: "flex-end" }}
        onPress={() => signOut({ email })}
      >
        <LinearGradient
          start={[0, 0.5]}
          end={[1, 0.5]}
          colors={["#5f2c82", "#49a09d"]}
          style={{ borderRadius: 15 }}
        >
          <View style={styles.circleGradient}>
            <Text style={styles.visit}>Sign out 👋🏼 </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        {profileImage != "" ? (
          <Image
            source={{
              uri: `http://192.168.207.209:3000/${profileImage}`,
            }}
            style={{ width: 120, height: 120, borderRadius: 40 }}
          />
        ) : (
          <Image
            source={require("../assets/profile_icon.png")}
            style={{ width: 120, height: 120, borderRadius: 40 }}
          />
        )}

        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => setModalVisibility(true)}
          style={{ flex: 1, alignItems: "center" }}
        >
          <Text style={styles.bigNumber}>{connections.length}</Text>
          <Text>connections</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisibility2(true)}
          style={{ flex: 1, alignItems: "center" }}
        >
          <Text style={styles.bigNumber}>{topics.length}</Text>
          <Text>followed</Text>
          <Text>topics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisibility3(true)}
          style={{ flex: 1, alignItems: "center" }}
        >
          <Text style={styles.bigNumber}>{locations.length}</Text>
          <Text>followed</Text>
          <Text>locations</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          margin: 20,
          alignItems: "center",
          borderRadius: 15,
          borderColor: "#B39E8D",
          borderWidth: 3,
          padding: 5,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Post")}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#393939" }}>
            CREATE A NEW POST
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 10,
            fontWeight: "700",
            color: "#393939",
            margin: 10,
          }}
        >
          My Posts
        </Text>
      </View>
    </View>
  );

  const MyPost = ({ item }) => (
    <LinearGradient
      style={{ flex: 1, margin: 10, borderRadius: 10, padding: 20 }}
      colors={["#2980b9", "#6dd5fa"]}
    >
      <View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              flex: 1,
              fontSize: 19,
              marginBottom: 10,
              fontWeight: "700",
              margin: 10,
              color: "#fefefe",
            }}
          >
            {username}
          </Text>
          <Text
            style={{
              fontSize: 17,
              marginBottom: 10,
              fontWeight: "700",
              margin: 10,
              color: "#fefefe",
            }}
          >
            📍{item.location}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 18,
            marginBottom: 10,
            fontWeight: "700",
            margin: 10,
            color: "#fefefe",
          }}
        >
          {item.caption}
        </Text>
        <View>
          {item.image != "" ? (
            <Image
              source={{
                uri: `http://192.168.207.209:3000/${item.image}`,
              }}
              style={{ width: 300, height: 300, alignSelf: "center" }}
            />
          ) : (
            <Text></Text>
          )}
        </View>
        <Text
          style={{
            fontSize: 17,
            marginBottom: 10,
            fontWeight: "700",
            margin: 10,
          }}
        >
          {item.topics}
        </Text>
        <View style={{ flexDirection: "row", margin: 10 }}>
          {Array.isArray(item.likes) && (
            <Text
              style={{
                fontSize: 20,
                marginBottom: 10,
                fontWeight: "700",
                margin: 10,
                color: "#2E875D",
              }}
            >
              {JSON.stringify(item.likes.length)}
            </Text>
          )}
          <TouchableOpacity
            style={{
              alignSelf: "center",
            }}
            onPress={() => like(email, item._id)}
          >
            <Icon
              name="md-thumbs-up"
              color={"#2E875D"}
              size={26}
              style={{
                marginRight: 10,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: "center",
            }}
            onPress={() => dislike(email, item._id)}
          >
            <Icon name="md-thumbs-down" color={"#B5493E"} size={26} />
          </TouchableOpacity>
          {Array.isArray(item.likes) && (
            <Text
              style={{
                fontSize: 20,
                marginBottom: 10,
                fontWeight: "700",
                margin: 10,
                color: "#B5493E",
              }}
            >
              {JSON.stringify(item.dislikes.length)}
            </Text>
          )}
          <TouchableOpacity
            style={{
              alignSelf: "center",
            }}
            onPress={() =>
              navigation.navigate("Comment", { item, username, id })
            }
          >
            <Icon
              name="md-text"
              color={"#f5f5f5"}
              size={26}
              style={{
                marginLeft: 30,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => deleteAlert(item._id)}
            style={{
              alignItems: "flex-end",
              alignSelf: "flex-end",
              flex: 1,
              marginLeft: 100,
            }}
          >
            <Icon name="md-trash" color={"#b51d25"} size={30} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  const renderItem = ({ email, username, item }) => <MyPost item={item} />;

  return (
    <View style={{ margin: 10 }}>
      <Modal visible={ModalVisibility} animationType="slide">
        <TouchableOpacity
          style={styles.modelTouchable}
          onPress={() => setModalVisibility(false)}
        >
          <Text style={{ fontSize: 20, color: "red", margin: 20 }}>close</Text>
        </TouchableOpacity>

        <FlatList
          data={connections}
          ListHeaderComponent={
            <View>
              <View style={{ marginBottom: 40, alignItems: "center" }}>
                <Text style={styles.title}>Add a connection</Text>
                <TextInput
                  style={styles.flatListInput}
                  onChangeText={(text) => setAddConnection(text)}
                  value={addConnection}
                />
                <TouchableOpacity
                  style={{ margin: 15 }}
                  onPress={() => submitConnection(email, addConnection)}
                >
                  <LinearGradient
                    start={[0, 0.5]}
                    end={[1, 0.5]}
                    colors={["#5f2c82", "#49a09d"]}
                    style={{ borderRadius: 15 }}
                  >
                    <View style={styles.circleGradient}>
                      <Text style={styles.visit}>SUBMIT</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.title}>Your connections</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.greenItemView}>
              <LinearGradient
                start={[0, 0.5]}
                end={[1, 0.5]}
                colors={["#1cd8d2", "#93edc7"]}
                style={{
                  backgroundColor: "red",
                  borderRadius: 20,
                  margin: 10,
                  width: 150,
                }}
              >
                <Text style={styles.greenItem}>{item.username}</Text>
              </LinearGradient>
              <TouchableOpacity
                style={styles.deleteTouchable}
                onPress={() => deleteConnection(email, item.username)}
              >
                <Text style={{ color: "red", fontSize: 20, fontWeight: "700" }}>
                  X
                </Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      </Modal>
      <Modal visible={ModalVisibility2} animationType="slide">
        <TouchableOpacity
          style={{
            alignContent: "stretch",
            alignItems: "flex-end",
          }}
          onPress={() => setModalVisibility2(false)}
        >
          <Text style={{ fontSize: 20, color: "red", margin: 20 }}>close</Text>
        </TouchableOpacity>

        <FlatList
          data={topics}
          ListHeaderComponent={
            <View>
              <View style={{ marginBottom: 40, alignItems: "center" }}>
                <Text style={styles.title}>Subscribe to a topic</Text>
                <TextInput
                  style={styles.flatListInput}
                  onChangeText={(text) => setAddTopic(text)}
                  value={addTopic}
                />
                <TouchableOpacity
                  style={{ margin: 15 }}
                  onPress={() => submitTopic(email, addTopic)}
                >
                  <LinearGradient
                    start={[0, 0.5]}
                    end={[1, 0.5]}
                    colors={["#5f2c82", "#49a09d"]}
                    style={{ borderRadius: 15 }}
                  >
                    <View style={styles.circleGradient}>
                      <Text style={styles.visit}>SUBMIT</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.title}>Your topics</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <LinearGradient
                start={[0, 0.5]}
                end={[1, 0.5]}
                colors={["#1cd8d2", "#93edc7"]}
                style={{
                  backgroundColor: "red",
                  borderRadius: 20,
                  margin: 10,
                  width: 150,
                }}
              >
                <Text style={styles.greenItem}>{item}</Text>
              </LinearGradient>
              <TouchableOpacity
                style={styles.deleteItem}
                onPress={() => deleteTopic(email, item)}
              >
                <Text style={{ color: "red", fontSize: 20, fontWeight: "700" }}>
                  X
                </Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item}
        />
      </Modal>
      <Modal visible={ModalVisibility3} animationType="slide">
        <TouchableOpacity
          style={{
            alignContent: "stretch",
            alignItems: "flex-end",
          }}
          onPress={() => setModalVisibility3(false)}
        >
          <Text style={{ fontSize: 20, color: "red", margin: 20 }}>close</Text>
        </TouchableOpacity>

        <FlatList
          data={locations}
          ListHeaderComponent={
            <View>
              <View style={{ marginBottom: 40, alignItems: "center" }}>
                <Text style={styles.title}>Subscribe to a location</Text>
                <TextInput
                  style={styles.flatListInput}
                  onChangeText={(text) => setAddLocation(text)}
                  value={addLocation}
                />
                <TouchableOpacity
                  style={{ margin: 15 }}
                  onPress={() => submitLocation(email, addLocation)}
                >
                  <LinearGradient
                    start={[0, 0.5]}
                    end={[1, 0.5]}
                    colors={["#5f2c82", "#49a09d"]}
                    style={{ borderRadius: 15 }}
                  >
                    <View style={styles.circleGradient}>
                      <Text style={styles.visit}>SUBMIT</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.title}>Your locations</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <LinearGradient
                start={[0, 0.5]}
                end={[1, 0.5]}
                colors={["#1cd8d2", "#93edc7"]}
                style={{
                  backgroundColor: "red",
                  borderRadius: 20,
                  margin: 10,
                  width: 150,
                }}
              >
                <Text style={styles.greenItem}>{item}</Text>
              </LinearGradient>

              <TouchableOpacity
                style={styles.deleteItem}
                onPress={() => deleteLocation(email, item)}
              >
                <Text style={{ color: "red", fontSize: 20, fontWeight: "700" }}>
                  X
                </Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item}
        />
      </Modal>

      <FlatList
        data={posts}
        ListHeaderComponent={Bio}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  visit: {
    margin: 2,
    padding: 3,
    textAlign: "center",
    color: "#393939",
    fontSize: 16,
    fontWeight: "700",
  },
  circleGradient: {
    margin: 3,
    backgroundColor: "white",
    borderRadius: 10,
  },
  deleteItem: {
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: "center",
  },
  delete: {
    fontSize: 18,
    margin: 5,
    textAlign: "right",
    color: "red",
  },
  bigNumber: {
    fontSize: 40,
    marginBottom: 10,
    fontWeight: "700",
    color: "#393939",
    margin: 3,
  },
  square: {
    width: 100,
    height: 100,
    backgroundColor: "grey",
    marginBottom: 10,
  },
  post: {
    backgroundColor: "grey",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "700",
    margin: 10,
    color: "#393939",
  },
  whiteTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "700",
    margin: 10,
    color: "#fefefe",
  },
  username: {
    fontSize: 40,
    marginBottom: 10,
    fontWeight: "700",
    color: "#393939",
    marginBottom: 10,
    textAlign: "center",
  },

  itemView: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    padding: 20,
  },
  modelTouchable: {
    alignContent: "stretch",
    alignItems: "flex-end",
  },

  flatListInput: {
    fontSize: 18,
    margin: 5,
    width: 300,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    textAlign: "center",
  },

  greenItem: {
    borderRadius: 20,
    margin: 10,
    width: 150,
    textAlign: "center",
    alignSelf: "center",
    fontSize: 20,
  },

  greenItemView: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },

  deleteTouchable: {
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: "center",
  },
});
