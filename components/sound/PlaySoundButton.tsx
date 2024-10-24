import {useEffect, useState} from "react";
import {Image, Pressable, View} from "react-native";
import {addOpacityToColor} from "@/constants/Colors";
import {ThemedText} from "@/components/ThemedText";

interface PlaySoundButtonProps {
  title: string;
  currentKey: string | null;
  onPress?: () => void;
}


export default function PlaySoundButton(props: PlaySoundButtonProps) {
  const {title, currentKey, onPress} = props;

  const colors = ['#0081f1', '#f76808', '#30a46c', '#8b5cf6', '#f43f5e'];
  const isPlaying = currentKey === title;
  const [color, setColor] = useState<string>('#0081f1');

  useEffect(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(randomColor);
  }, []);

  return (
    <Pressable
      style={{
        borderStyle: 'solid',
        borderWidth: isPlaying ? 2 : 1,
        borderColor: color,
        borderRadius: 10,
        minHeight: 80,
        paddingVertical: 5,
        paddingHorizontal: 2,
        display: 'flex',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: isPlaying ? addOpacityToColor(color, 0.1) : 'transparent',
      }}
      onPress={onPress}
    >
      <View>
        <ThemedText style={{
          textAlign: 'center',
          textTransform: 'capitalize',
        }}>{title}</ThemedText>
        <View style={{
          minHeight: 25,
          display: 'flex',
          alignItems: 'flex-end'
        }}>{isPlaying && (
          <Image
            source={require('@/assets/images/playing-unscreen.gif')}
            style={{
              width: 40,
              height: 40,
            }}
          />
        )}</View>
      </View>
    </Pressable>
  );
}