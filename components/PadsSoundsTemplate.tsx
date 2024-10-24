import {Audio, InterruptionModeAndroid, InterruptionModeIOS} from "expo-av";
import React, {useCallback, useEffect, useState} from "react";
import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import {ThemedView} from "@/components/ThemedView";
import GridView from "@/components/GridView";
import {ThemedText} from "@/components/ThemedText";
import {addOpacityToColor, Colors} from "@/constants/Colors";
import {Chords} from "@/constants/Chords";
import PlaySoundButton from "@/components/sound/PlaySoundButton";
import {TabBarIcon} from "@/components/navigation/TabBarIcon";
import {AudioLines, HeadphoneOffIcon, Headphones} from "lucide-react-native";
import Animated, {FadeIn, FadeOut} from "react-native-reanimated";


interface Props {
  soundMap: { [p: string]: any };
  headerImage: any;
}

export default function PadsSoundsTemplate({soundMap, headerImage}: Props) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentKey, setCurrentKey] = useState<string | null>(null);

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

    configureAudioMode();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  async function playSound(key: string) {
    const soundResource = soundMap[key];
    if (!soundResource) {
      console.warn(`No sound found for key: ${key}`);
      return null;
    }

    if (key === currentKey && sound) {
      await sound.unloadAsync();
      setCurrentKey(null)
      return null;
    }

    Audio.Sound.createAsync(soundResource).then(async (_sound) => {
      const {sound: newSound} = _sound;
      await newSound.playAsync();
      setSound(newSound)
      setCurrentKey(key);
    })
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
          sound?.unloadAsync();
        }
      };
    }, [sound])
  );


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
            <PlaySoundButton title={item} currentKey={currentKey} onPress={() => playSound(item)}/>
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
              <Pressable onPress={() => playSound(currentKey)}>
                <Headphones  size={22} color="#ef4444"/>
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