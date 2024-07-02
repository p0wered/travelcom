import Svg, {Path} from "react-native-svg";

export function StarIcon({color, stroke}){
    return (
        <Svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path
                d="M7 1.61803L8.09607 4.99139L8.20833 5.33688H8.5716H12.1186L9.24901 7.42173L8.95511 7.63526L9.06737 7.98075L10.1634 11.3541L7.29389 9.26925L7 9.05573L6.70611 9.26925L3.83656 11.3541L4.93263 7.98075L5.04489 7.63526L4.75099 7.42173L1.88145 5.33688H5.4284H5.79167L5.90393 4.99139L7 1.61803Z"
                fill={color} stroke={stroke}/>
        </Svg>
    )
}