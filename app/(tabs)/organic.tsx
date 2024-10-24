import PadsSoundsTemplate from "@/components/PadsSoundsTemplate";
import {SoundMapOrganic} from "@/constants/Chords";

export default function Organic(){
    return (
      <PadsSoundsTemplate
        soundMap={SoundMapOrganic}
        headerImage={require('@/assets/images/cover-organic.jpg')}
      />
    )
}