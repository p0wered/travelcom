import Svg, {Path} from "react-native-svg";

export function BasketIcon(){
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" fill="none">
            <Path d="M10 11V17" stroke="#207fbf" strokeWidth={2}  strokeLinecap={"round"} strokeLinejoin={"round"}></Path>
            <Path d="M14 11V17" stroke="#207fbf" strokeWidth={2}  strokeLinecap={"round"} strokeLinejoin={"round"}></Path>
            <Path d="M4 7H20" stroke="#207fbf" strokeWidth={2}  strokeLinecap={"round"} strokeLinejoin={"round"}></Path>
            <Path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#207fbf"
                  strokeWidth={2} strokeLinecap={"round"} strokeLinejoin={"round"}></Path>
            <Path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#207fbf"
                  strokeWidth="2"  strokeLinecap={"round"} strokeLinejoin={"round"}></Path>
        </Svg>

    )
}
