import { Workout } from "./model";
import { config } from "../../../config"

export function addWorkoutByPost(workout:Workout) {
    
    console.log("addWorkoutByPost called");
    fetch(
        `${config.dbURL}`,
        {
            method: 'POST',
            body: JSON.stringify(workout),
            headers : {
                "Content-Type" : "application/json"
            }
        }


    ).then(response => {
        console.log("Response " + response.ok);
    }).catch(err=> console.log(err));

}