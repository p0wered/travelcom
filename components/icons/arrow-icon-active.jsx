import Svg, {Path} from "react-native-svg";

export default function ArrowActive({color}){
    return (
        <Svg width="15" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M2 2L12 12L22 2" stroke={color} stroke-width="4" stroke-linecap="round"/>
        </Svg>
    )
}