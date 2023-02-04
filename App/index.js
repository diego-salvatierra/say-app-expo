import { StyleSheet, Dimensions} from 'react-native';
import React, { useState, useEffect } from 'react';
//import { Button } from '@rneui/base';
import Words from './screens/Words'
import { NativeBaseProvider } from 'native-base';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Header from './components/Header';
import LogIn from './screens/LogIn';
import { supabase } from './lib/supabase'
import Phrasebook from './screens/Phrasebook';
import Home from './screens/Home';
import { getHeaderTitle } from '@react-navigation/elements';
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'https://5a92132c278b42a79bb122eb9c511e43@o4504618398908416.ingest.sentry.io/4504618595713024',
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});


/*import * as dotenv from 'dotenv' 
import express from 'express'

dotenv.config() */

const PAGE_HEIGHT = Dimensions.get('window').height;

const PAGE_WIDTH = Dimensions.get('window').width;

// data structure: one dict? array of objects? three arrays?



//export default () => <Words/>

// create native base button DONE
// native base button navigates to new screen using stack navigation DONE
// Create state with 150 most common words DONE
// Get an image for each word OR translation for hover LATER
// Pass words to new card DONE
// Generate cards for each image-word pair DONE
// Make cards nicer DONE, scrollable DONE
// Make cards randomized
// Sort cards by type, three sections swipe DONE 
// Create drag and drop boxes DONE
/// https://medium.com/nerd-for-tech/drag-drop-and-swap-between-two-lists-using-react-native-d864dab43aa9
// Create general words state DONE
// Drag and drop boxes DONE
// Connect boxes to dragged words DONE
// Set limits by word type for dragging DONE
// Sentence save button DONE
// Sentence save button saves sentence to state DONE
// Improve Words code organization
// Sentence navigation???
// Shuffle on word double tap???
// Check bugs DONE 
// Save sentence automatically, make it snappy // TODAY
// Check sentence and enable READY when complete DONE
// Enhance sentence with double translate on Google Translate API DONE
// Fix decode bug DONE
// Containerize DONE
// Initial Figma DONE
// Bug: drag off on scrolling DONE
// Switch to Spanish DONE
// New navigation DONE
// Add logo DONE
// Bug: Ready button should refresh sentence
// Integrate GPT3 to Ready button DONE
// Save sentences DONE
// Add translations to words DONE
// Google signin DONE
// Supabase setup DONE
// Save sentence to Supabase DONE
// Set up phrasebook screen DONE
// Retrieve sentences DONE
// Get whisper working DONE
// Card colors by type 
// Add Korean DONE
// Add phrase translations toggle DONE
// Say! button add DONE
// Say! button AI DONE
// Integrate GPT3 DONE
// UI enhancements DONE
// Code cleanup: add context/universal state variables
// Boxes close and open, proper buttons DONE
// New word cards DONE
// Swipe by category DONE
// Colors and styling DONE

/// STARTUP SQUAD CRITICAL DONE
// Whisper sentence check DONE
// Improve login and flow DONE
// Language selection DONE
// Slides DONE
// GPT3 chat response DONE
// Video DONE

// New features
/// Login flow - simple DONE
/// Fix hamburger menu DONE
/// Fix home layout DONE
/// Login flow - context 
/// BUG: Login reset DONE
/// BUG: Fix transcription language
/// Fix button order, Save at the end upon successful Say!, Ready in gray at first
/// BUG: ability to Ready new sentence
/// BUG: New language resets sentence
/// Eliminate audio recording alert DONE
/// Unfilled boxes styling 
/// Wordset generation
/// Add words DONE
/// User list of words with delete TODAY
/// Different sentence structures
/// Leveling and phrasebook completion
/// GPT Chatbot
/// GPT3 sentence coloring
/// Recording playback
/// Debugging/clean up

// Deployment
/// ngrok permanent --> pay
/// flask permanent --> heroku
/// permanent site for google login
/// github reorg

//Other
/// Nudges for spaced repetition
/// Edge cases cleanup
/// Subjects and nouns interchangeable


//CLEANUP

// Remove Draggable
// Solve child warning

// LIBRARIES
/// react-native-drax
/// html-entities

const Drawer = createDrawerNavigator();

// add linear gradient to navigation container 


export default function App() {

  // Sentry try
  
  try {
    // your code

  const [session, setSession] = useState()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  // transparent header: options={{headerTransparent: true}}

  return (
    <NavigationContainer>
    <NativeBaseProvider style={styles.container}>
    <Header />
    <Drawer.Navigator
      screenOptions={{
        header: ({ navigation, route }) => {
          const title = getHeaderTitle(route.name);
          return <Header title={title} navigation={navigation} />;
        },
        drawerPosition: 'left',
        headerRight: () => <Header/>,
        overlayColor: 'transparent',
        headerTransparent: true,
      }}
    > 
      <Drawer.Screen name="Home" component={Home}/>
      <Drawer.Screen name="LogIn" component={LogIn} />
      <Drawer.Screen name="Build" component={Words} />
      <Drawer.Screen name="Phrasebook" component={Phrasebook} />
    </Drawer.Navigator>
    </NativeBaseProvider>
    </NavigationContainer>
  );

  } catch (error) {
    Sentry.Native.captureException(error);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeContainer: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center' 
  },
  linearGradient: {
    position: 'absolute',
    height: PAGE_HEIGHT,
    left: 0,
    right: 0,
    top: 0,    
  },
  buttonStyle: {
    position: 'absolute',
    top: 20,
    right: PAGE_WIDTH/2,
    zIndex: 1,
  },

})