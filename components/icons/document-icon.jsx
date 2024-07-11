import Svg, {Path} from "react-native-svg";

export function DocumentIcon(){
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor"
             className="bi bi-file-earmark" viewBox="0 0 16 16">
            <Path
                d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
        </Svg>
    )
}