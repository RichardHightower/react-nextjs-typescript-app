import type { NextPage } from 'next'
import ExerciseForm from '../../src/features/workout/ExerciseForm'
import WorkoutForm from '../../src/features/workout/WorkoutForm'

import { useAppSelector } from "../../src/app/hooks";
import { selectCurrentWorkout } from "../../src/features/workout/workoutSlice";

const Workout: NextPage = () => {
  const workout = useAppSelector(selectCurrentWorkout);
  

  return (

    <>
    <WorkoutForm workout={workout}/>
    </>
  )
}

export default Workout
