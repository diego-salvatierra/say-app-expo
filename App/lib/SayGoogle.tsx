import * as React from "react";
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { Button } from "@rneui/themed"
import { Audio } from "expo-av";
import FormData from "form-data";
import axios from "axios";
import Mode from './Mode';
import TranscribedOutput from "./TranscribeOutput";
import * as FileSystem from 'expo-file-system';



export default ({sentenceWhisper, setSentenceWhisper, langCode}) => {
  console.log("sentenceWhisper First is ", sentenceWhisper)
  const [recording, setRecording] = React.useState(false as any);
  const [recordingDone, setRecordingDone] = React.useState(false);
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [transcribedData, setTranscribedData] = React.useState([] as any);
  const [interimTranscribedData] = React.useState("");
  const [isRecording, setIsRecording] = React.useState(false);
  const [isTranscribing, setIsTranscribing] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState("english");
  const [selectedModel, setSelectedModel] = React.useState(1);
  const [transcribeTimeout, setTranscribeTimout] = React.useState(5);
  const [stopTranscriptionSession, setStopTranscriptionSession] =
    React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const intervalRef: any = React.useRef(null);

  const stopTranscriptionSessionRef = React.useRef(stopTranscriptionSession);
  stopTranscriptionSessionRef.current = stopTranscriptionSession;

  const selectedLangRef = React.useRef(selectedLanguage);
  selectedLangRef.current = selectedLanguage;

  const selectedModelRef = React.useRef(selectedModel);
  selectedModelRef.current = selectedModel;

  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech');
  const fs = require('fs')

  // Creates a client
  const client = new speech.SpeechClient();

  const supportedLanguages = [
    "english",
    "chinese",
    "german",
    "spanish",
    "russian",
    "korean",
    "french",
    "japanese",
    "portuguese",
    "turkish",
    "polish",
    "catalan",
    "dutch",
    "arabic",
    "swedish",
    "italian",
    "indonesian",
    "hindi",
    "finnish",
    "vietnamese",
    "hebrew",
    "ukrainian",
    "greek",
    "malay",
    "czech",
    "romanian",
    "danish",
    "hungarian",
    "tamil",
    "norwegian",
    "thai",
    "urdu",
    "croatian",
    "bulgarian",
    "lithuanian",
    "latin",
    "maori",
    "malayalam",
    "welsh",
    "slovak",
    "telugu",
    "persian",
    "latvian",
    "bengali",
    "serbian",
    "azerbaijani",
    "slovenian",
    "kannada",
    "estonian",
    "macedonian",
    "breton",
    "basque",
    "icelandic",
    "armenian",
    "nepali",
    "mongolian",
    "bosnian",
    "kazakh",
    "albanian",
    "swahili",
    "galician",
    "marathi",
    "punjabi",
    "sinhala",
    "khmer",
    "shona",
    "yoruba",
    "somali",
    "afrikaans",
    "occitan",
    "georgian",
    "belarusian",
    "tajik",
    "sindhi",
    "gujarati",
    "amharic",
    "yiddish",
    "lao",
    "uzbek",
    "faroese",
    "haitian creole",
    "pashto",
    "turkmen",
    "nynorsk",
    "maltese",
    "sanskrit",
    "luxembourgish",
    "myanmar",
    "tibetan",
    "tagalog",
    "malagasy",
    "assamese",
    "tatar",
    "hawaiian",
    "lingala",
    "hausa",
    "bashkir",
    "javanese",
    "sundanese",
  ];

  const modelOptions = ["tiny", "base", "small", "medium", "large"];

  React.useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  function handleTranscribeTimeoutChange(newTimeout: any) {
    setTranscribeTimout(newTimeout);
  }

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        // alert("Starting recording..");
        const RECORDING_OPTIONS_PRESET_LOW_QUALITY: any = {
          android: {
            extension: ".mp4",
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB,
            sampleRate: 10000,
            numberOfChannels: 2,
            bitRate: 3000,
          },
          ios: {
            extension: ".wav",
            audioQuality: 0,
            //audioQuality: IOSAudioQuality.MIN,
            sampleRate: 44000,
            numberOfChannels: 2,
            bitRate: 12000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
        };
        const { recording }: any = await Audio.Recording.createAsync(
          RECORDING_OPTIONS_PRESET_LOW_QUALITY
        );
        setRecording(recording);
        console.log("Recording started");
        setStopTranscriptionSession(false);
        setIsRecording(true);
        /*intervalRef.current = setInterval(
          transcribeInterim,
          transcribeTimeout * 1000
        );*/
        console.log("erer", recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error(" Failed to start recording", err);
    }
  }
  async function stopRecording() {
    console.log("Stopping recording..");
    //setRecording(undefined);
    console.log("recording is ", recording);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    const getFileSize = async uri => {
      let fileInfo = await FileSystem.getInfoAsync(uri)
      console.log("size is ", fileInfo.size)
    };
    getFileSize(uri);
    let updatedRecordings = [...recordings] as any;
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });
    setRecordings(updatedRecordings);
    setRecordingDone(true); // Added to change the button to play
    console.log("Recording stopped and stored at", uri);
    // Fetch audio binary blob data

    clearInterval(intervalRef.current);
    setStopTranscriptionSession(true);
    setIsRecording(false);
    setIsTranscribing(false);
    transcribeRecording()
  }

  function getDurationFormatted(millis: any) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round(minutes - minutesDisplay) * 60;
    const secondDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine: any, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            {" "}
            Recording {index + 1} - {recordingLine.duration}
          </Text>
          <Button
            onPress={() => recordingLine.sound.replayAsync()}
            title={index.toString()}
          ></Button>
        </View>
      );
    });
  }

  function transcribeInterim() {
    clearInterval(intervalRef.current);
    setIsRecording(false);
    console.log("transcribeInterim called");
  }

  async function transcribeRecording() {
    console.log("recording in transcribe is ", recording)
    const uri = recording.getURI();
    const gcsUri = uri;

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      uri: gcsUri,
    };

    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: langCode,
    };
    const audioBytes = fs.readFileSync('test.flac').toString('base64');

    const request = {
        config: config,
        audio: {
            content: audioBytes
        }
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);

  // Old Whisper code
  /*
  async function transcribeRecording() {
    const uri = recording.getURI();
    const filetype = uri.split(".").pop();
    const filename = uri.split("/").pop();
    setLoading(true);
    const formData: any = new FormData();
    formData.append("language", langCode);
    formData.append("model_size", "small");
    formData.append(
      "audio_data",
      {
        uri,
        type: `audio/${filetype}`,
        name: filename,
      },
      "temp_recording"
    );
    console.log("formData sent is", formData)
    axios({
      url: "https://backendsay-wkdnx77abq-uw.a.run.app/transcribe", // IMPORTANT! must equal current server
      method: "POST",
      data: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        console.log("response.data :", response.data);
        setTranscribedData((oldData: any) => [...oldData, response.data]);
        setLoading(false);
        setIsTranscribing(false);
        setRecordingDone(false)
        setSentenceWhisper(response.data) // Sets the sentence check to be shown
        console.log("sentenceWhisper in Response is ", sentenceWhisper)
      })
      .catch(function (error) {
        console.log("error : error");
      }); */

    if (!stopTranscriptionSessionRef.current) {
      setIsRecording(true);
    }
  }
  return (
    <View style={styles.container}>
        {!isRecording && !isTranscribing && !recordingDone && (
          <Button buttonStyle={{ backgroundColor: '#FFC107' }} onPress={startRecording} title="Say it!" />
        )}
        {(isRecording || isTranscribing) && !recordingDone && (
          <Button
            onPress={stopRecording}
            disabled={stopTranscriptionSessionRef.current}
            title="Done!"
            buttonStyle={{ backgroundColor: 'red' }}
          />
        )}
        {/*recordingDone && (
          <Button title="Transcribe" buttonStyle={{ backgroundColor: '#FFC107' }} onPress={() => transcribeRecording()} />
        )*/}
        
        {/*getRecordingLines()*/}

      { isLoading !== false ? (
        <ActivityIndicator
          size="large"
          color="#00ff00"
          hidesWhenStopped={true}
          animating={true}
        />
      ) : (
        <View></View>
      ) }
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    flexDirection: "column",
  },
  container: {
  },
  title: {
    marginTop: 40,
    fontWeight: "400",
    fontSize: 30,
  },
  settingsSection: {
    flex: 1,
  },
  buttonsSection: {
    flex: 1,
    flexDirection: "row",
  },
  transcription: {
    flex: 1,
    flexDirection: "row",
  },
  recordIllustration: {
    width: 100,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 16,
  },
});