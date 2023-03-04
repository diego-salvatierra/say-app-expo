import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, Modal, Text, StyleSheet, Dimensions} from "react-native";
import Close from '../../assets/close.svg'
import { supabase } from '../lib/supabase';
import SayWhisper from '../whisper/SayWhisper';
import SaveButton from './SaveButton';
import AudioPlayback from "../../assets/audioPlayback.svg"
import MicrophonePlayback from "../../assets/microphonePlayback.svg"
import Playback from "../../assets/playback.svg"
import sentenceSpeak from '../lib/sentenceSpeak';
import playRecording from '../lib/playRecording';

const PAGE_HEIGHT = Dimensions.get('window').height;
const PAGE_WIDTH = Dimensions.get('window').width;

const SayModal = ({ sayVisible, setSayVisible, sentenceWhisper, setSentenceWhisper, lang, langCode, sentenceSaidPercentage, sentenceText}) => {

    useEffect(() => {
    }, [sayVisible])

    // Create variables for modal

    const [topText, setTopText] = useState('Push the record button to practice your sentence!');

    const [bottomText, setBottomText] = useState('Say it!');

    const [saySuccess, setSaySuccess] = useState(false); // temporary testing

    const [attempted, setAttempted] = useState(false);

    const [recordingUri, setRecordingUri] = useState(null);

    const [successVisible, setSuccessVisible] = useState(false);

    const [playSound, setPlaySound] = useState(null);

    // Sets success upon 50% of sentence said
    useEffect (() => {
        console.log("attempted is ", attempted)
        console.log("sentenceSaidPercentage is ", sentenceSaidPercentage)
        if (sentenceSaidPercentage > 0.5) {
            setSaySuccess(true);
        }
    }, [sentenceSaidPercentage])

    useEffect (() => {
        console.log("attempted is HERE ", attempted)
        console.log("sentenceSaidPercentage is HERE ", sentenceSaidPercentage)        
    }, [attempted])

    
    // Set message on success
    useEffect(() => {
        if (attempted === true) {
          if (lang === "Spanish") {
            setTopText("¡Felicidades! We understood you :) Save it to your phrasebook?")
          }  
          if (lang === "Korean") {
            setTopText("축하해요! We understood you :) Save it to your phrasebook?")
          }  
        }                                  
      }, [saySuccess, lang]);

    const close = () => {
        setSayVisible(false);
        setAttempted(false);
        setSaySuccess(false);
        setTopText('Push the record button to practice your sentence!');
        setBottomText('Say it!');
    }

    // Logic for which modal renders
    useEffect(() => {
        if (attempted && saySuccess) {
          setSuccessVisible(true);
          setSayVisible(false);
        } else {
          setSuccessVisible(false);
        }
      }, [attempted, saySuccess]);


    // Output modal

    /// Modals   

    console.log("attempted is ", attempted)
    console.log("saySuccess is ", saySuccess)
    console.log("sayVisible is ", sayVisible)
   
    return (
        <View style={styles.container}>
            <Modal visible={sayVisible} transparent={true}>
                <View style={styles.modalContainer}> 
                    <View style={styles.topContainer}>
                        <TouchableOpacity onPress={() => close()}>
                            <Close/>
                        </TouchableOpacity>                        
                    </View>
                    <View style={styles.smallTextContainer}>
                        <Text style={styles.smallText}>{topText}</Text>
                    </View>
                    
                    <TouchableOpacity style={styles.mikeContainer}>
                        <SayWhisper 
                        sentenceWhisper={sentenceWhisper} 
                        setSentenceWhisper={setSentenceWhisper} 
                        lang={lang}
                        setTopText={setTopText}
                        setBottomText={setBottomText}
                        setRecordingUri={setRecordingUri}
                        setAttempted={setAttempted}
                        setPlaySound={setPlaySound}
                    />
                    </TouchableOpacity>

                    <View style={styles.bigTextContainer}>
                        <Text style={styles.bigText}>{bottomText}</Text>
                    </View>                                        
                </View>
            </Modal>
            <Modal visible={saySuccess} transparent={true}>
                <View style={[styles.modalContainer, { height: PAGE_HEIGHT/2.5,} ]}> 
                    <View style={styles.topContainer}>
                        <TouchableOpacity onPress={() => setSaySuccess(false)}>
                            <Close/>
                        </TouchableOpacity>                        
                    </View>
                    <View style={styles.smallTextContainer}>
                        <Text style={styles.smallText}>{topText}</Text>
                    </View>
                    <View style={styles.playbackContainer}>
                        <TouchableOpacity style={styles.playbackButton} onPress={() => sentenceSpeak(sentenceText, langCode)}>
                            <AudioPlayback/>
                            <Text style={styles.playbackText}>We said</Text>
                            <Playback/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.playbackButton} onPress={() => playRecording(recordingUri)}>
                            <MicrophonePlayback/>
                            <Text style={styles.playbackText}>You said</Text>
                            <Playback/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonsContainer}>    
                        <SaveButton/>                                        
                        <View style={styles.grayButton}>
                            <Text style={[styles.smallText, { paddingLeft: 10} ]}>Continue without saving</Text>
                        </View>                                
                    </View>                                               
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },  
    smallText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#FFFFFF',        
    },

    smallTextContainer: {
        display: "flex",
        flex: 0.8,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: PAGE_WIDTH*.4,
    },
    bigText: {
        fontSize: 25,
        height: 30,
        textAlign: 'center',
        color: "#FFFFFF"
        
    },
    bigTextContainer: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        width: PAGE_WIDTH*.8,
    },
    mikeContainer: {
        display: "flex",
        flex: 0.5,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        width: PAGE_WIDTH*.8,
    },

    
    modalContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        gap: 10,
        
        position: 'absolute',
        height: PAGE_HEIGHT/3,
        width: PAGE_WIDTH*.8,
        top: PAGE_HEIGHT/4,
        left: PAGE_WIDTH/10,

        backgroundColor: "#121212",
        borderColor: "#2E93F2",
        borderWidth: 2,
        borderRadius: 20
    },
    topContainer: {
        display: "flex",
        flex: 0.3,
        flexDirection: "column",        
        padding: 10,
        width: PAGE_WIDTH*.7,
    },
    playbackContainer: {
        flexDirection: "column",
        padding: 0,
        justifyContent: "space-evenly",
        alignItems: "center",
        width: PAGE_WIDTH*.4,
        height: PAGE_HEIGHT/9,
    },
    playbackButton: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: 15,
        width: PAGE_WIDTH*.4,

    },
    playbackText: {
        fontSize: 16,
        color: "#2E92F0"
    },
    buttonsContainer: {
        flexDirection: "column",
        padding: 10,
        justifyContent: "space-evenly",
        alignItems: "center",
        width: PAGE_WIDTH*.5,
        height: PAGE_HEIGHT/7,

    },
    grayButton: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        width: PAGE_WIDTH*.5,

        backgroundColor: "#8B8B8B",
        borderRadius: 10,
    },
})

    

export default SayModal