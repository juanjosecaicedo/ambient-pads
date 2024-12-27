import {Audio, InterruptionModeAndroid, InterruptionModeIOS} from "expo-av";
import React, {useCallback, useEffect, useState} from "react";
import {AppState, AppStateStatus, Image, Platform, Pressable, StyleSheet, Text, View} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import {ThemedView} from "@/components/ThemedView";
import GridView from "@/components/GridView";
import {addOpacityToColor} from "@/constants/Colors";
import {Chords} from "@/constants/Chords";
import PlaySoundButton from "@/components/sound/PlaySoundButton";
import {Headphones} from "lucide-react-native";
import Animated, {FadeIn, FadeOut} from "react-native-reanimated";
import * as Notifications from 'expo-notifications';
import {activateKeepAwakeAsync, deactivateKeepAwake} from 'expo-keep-awake';

interface Props {
  soundMap: { [p: string]: any };
  headerImage: any;
}

export default function PadsSoundsTemplate({soundMap, headerImage}: Props) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [permissionToNotifications, setPermissionToNotifications] = useState<boolean>(true);
  const TIME = 100;

  const handleFadeAndUnload = async () => {
    try {
      for (let volume = 1; volume >= 0; volume -= 0.1) {
        await sound?.setVolumeAsync(volume);
        await new Promise(resolve => setTimeout(resolve, TIME));
      }
      await sound?.unloadAsync();
    } catch (e) {
    }
  };

  useEffect(() => {
    const configureAudioMode = async () => {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
        shouldDuckAndroid: true,
        interruptionModeIOS: InterruptionModeIOS.DuckOthers,
        playsInSilentModeIOS: true,
      });
    };

    const askNotification = async () => {
      const {status} = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        setPermissionToNotifications(false);
        console.warn('Permission to access notifications was denied');
      }
    }

    configureAudioMode();
    askNotification()


    return () => {
      if (sound) {
        //setSound(sound)
        sound?.unloadAsync();
      }
    };
  }, [sound]);


  async function playStopSound(key: string) {
    const soundResource = soundMap[key];
    if (!soundResource) {
      console.warn(`No sound found for key: ${key}`);
      return null;
    }

    if (key === currentKey && sound) {
      await handleFadeAndUnload();
      await deactivateKeepAwake();
      setCurrentKey(null);
      setSound(null);
      return null;
    }

    Audio.Sound.createAsync(soundResource).then(async (_sound) => {
      const {sound: newSound} = _sound;

      if (sound) {
        await handleFadeAndUnload()
      }

      await newSound.playAsync();
      await newSound.setVolumeAsync(0);
      await newSound.setIsLoopingAsync(true);

      setSound(newSound)
      setCurrentKey(key);

      for (let volume = 0; volume <= 1; volume += 0.1) {
        await newSound.setVolumeAsync(volume);
        await new Promise(resolve => setTimeout(resolve, TIME));
      }
      await activateKeepAwakeAsync();
    })
  }

  const stopSound = async () => {
    const status = await sound?.getStatusAsync();
    if (!status?.isLoaded) {
      return;
    }

    for (let volume = 1; volume >= 0; volume -= 0.1) {
      await sound?.setVolumeAsync(volume);
      await new Promise(resolve => setTimeout(resolve, TIME));
    }
  }

  useFocusEffect(
    useCallback(() => {
      sound?.getStatusAsync().then(r => {
        if (!r.isLoaded) {
          setCurrentKey(null);
        }
      });
      return () => {
        if (sound) {
          stopSound().then(() => {
            sound?.unloadAsync();
          })
        }
      };
    }, [sound])
  );

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (Platform.OS !== 'web' && permissionToNotifications && nextAppState === "background" && currentKey) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Ambient Pads',
            body: `The key sound is playing: ${currentKey}`
          },
          trigger: null,
        });
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [currentKey]);

  return (
    <ParallaxScrollView
      headerImage={
        <Image
          source={headerImage}
          style={styles.img}
        />
      }
      headerBackgroundColor={{light: '#A1CEDC', dark: '#1D3D47'}}>
      <ThemedView>
        <View style={{paddingTop: 10}}>
          <GridView data={Chords} renderItem={(item) => (
            <PlaySoundButton title={item} currentKey={currentKey} onPress={() => playStopSound(item)}/>
          )}/>
        </View>
        <View style={{
          marginTop: 25,
        }}>
          {currentKey && (
            <Animated.View
              entering={
                FadeIn.duration(200)
              }

              exiting={
                FadeOut.duration(200)
              }
              style={{
                paddingHorizontal: 10,
                paddingVertical: 20,
                backgroundColor: addOpacityToColor('#A1CEDC', 0.1),
                borderRadius: 10,
                borderWidth: 2,
                borderColor: '#A1CEDC',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
              <Text>Playing key: <Text style={{
                textTransform: 'capitalize',
                fontWeight: '700'
              }}>{currentKey}</Text></Text>
              <Pressable onPress={() => playStopSound(currentKey)}>
                <Headphones size={22} color="#ef4444"/>
              </Pressable>
            </Animated.View>
          )}
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  img: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {}
});