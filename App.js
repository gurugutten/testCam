import { StatusBar } from "expo-status-bar";
import { StyleSheet, Dimensions, View, Button, Text } from "react-native";
import { Camera } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { Video, AVPlaybackStatus } from "expo-av";

export default function App() {
  const cam = useRef(null);
  const video = useRef(null);
  const [cameraType, setCameraType] = useState("front");
  const [recording, setRecording] = useState(false);
  const [uri, setUri] = useState("");
  const [playing, setPlaying] = useState(false);
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    const _handlePermissions = async () => {
      const status = await Camera.requestCameraPermissionsAsync();
      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      if (status.granted === true && audioStatus.granted === true) {
        setPermission(true);
      }
    };
    _handlePermissions();
  }, []);

  const _stopRecord = async () => {
    setRecording(false);
    cam.current.stopRecording();
  };

  const _startRecord = async () => {
    setRecording(true);
    const video = await cam.current.recordAsync({});
    setUri(video.uri);
  };

  useEffect(() => {
    if (playing) {
      video.current && video.current.pauseAsync();
    } else {
      video.current && video.current.playAsync();
    }
  }, [playing]);

  useEffect(() => console.log(cam.current), [cam.current]);

  return (
    <>
      {uri === "" && (
        <View style={styles.container}>
          <Camera
            ref={cam}
            type={
              cameraType === "front"
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            }
            style={{
              flexDirection: "column",
              flex: 1,
              height: 300,
              width: 400,
            }}
          ></Camera>
        </View>
      )}
      <View>
        {recording ? (
          <Button title="stop" onPress={() => _stopRecord()}></Button>
        ) : (
          <Button title="record" onPress={() => _startRecord()}></Button>
        )}
      </View>
      {uri !== "" && (
        <View style={{ flex: 0.9 }}>
          <Video
            ref={video}
            source={{
              uri: uri,
            }}
            resizeMode="contain"
            style={{ width: "100%", height: "95%" }}
            isLooping
            useNativeControls
          />
          <Button
            title={"play/pause"}
            onPress={() => setPlaying(!playing)}
          ></Button>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
  },
});
