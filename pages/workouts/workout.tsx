import type { NextPage } from 'next'
import ExerciseForm from '../../features/workout/ExerciseForm'
import WorkoutForm from '../../features/workout/WorkoutForm'

import { useAppSelector } from "../../app/hooks";
import { selectCurrentWorkout } from "../../features/workout/workoutSlice";

const Workout: NextPage = () => {
  const workout = useAppSelector(selectCurrentWorkout);
  

  return (

    <>
    <WorkoutForm workout={workout}/>
    </>
  )
}

export default Workout
