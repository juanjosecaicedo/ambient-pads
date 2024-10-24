import {SoundMapFoundation} from "@/constants/Chords";
import PadsSoundsTemplate from "@/components/PadsSoundsTemplate";

export default function Index() {
  return (
    <PadsSoundsTemplate
      soundMap={SoundMapFoundation}
      headerImage={require('@/assets/images/cover-foundations.jpg')}
    />
  )
}
