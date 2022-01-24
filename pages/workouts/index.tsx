import type { NextPage } from "next";
import Link from "next/link";
import { Table, Card, Stack } from "react-bootstrap";
import {config} from "../../config"

import {  selectWorkouts, setSelectedWorkout} from "../../src/features/workout/workoutSlice";
import { Exercise, WorkingSet, Workout, WorkoutsResult } from "../../src/features/workout/model";
import { useState, useEffect } from "react";

import { useRouter } from "next/router";
import { useAppDispatch } from "../../src/app/hooks";

const WorkoutIndex: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  // const workouts = useAppSelector(selectWorkouts);
  const [isLoading, setIsLoading] = useState(true);
  const [workouts, setWorkouts] = useState<Array<Workout>>([]);


  useEffect( () => { 
    setIsLoading(true);
    fetch(
      `${config.dbURL}`,
    ).then((response:Response) =>  {
       return response.json();
    })
    .then((data)=> {

      console.log("data", data, JSON.stringify(data));
      const workoutResult = data as unknown as WorkoutsResult;
      const newWorkouts : Array<Workout> = [];
      for (const key in data) {

          const sentWorkout = workoutResult[key] as Workout;
          const workout : Workout = {
            id:key,
            ...sentWorkout
          };
          newWorkouts.push(workout);
      }

      console.log("newWorkouts", newWorkouts, JSON.stringify(newWorkouts));
      setWorkouts(newWorkouts);
      setIsLoading(false);
    }
    );
  }, []);


  function workoutSelected(workout: Workout) {
    dispatch(setSelectedWorkout(workout));
    console.log(JSON.stringify(workout));
    router.push("../workouts/workout");
  }

  function workingSetsView(exercise: Exercise) {
    return exercise.workingSets.map((workingSet: WorkingSet, index: number) => {
      const otherWeight =
        exercise.units == "lbs"
          ? 2.20462 * workingSet.weight
          : 0.453592 * workingSet.weight;
      const otherUnits = exercise.units == "lbs" ? "kgs" : "lbs";
      return (
        <tr>
          <td>{index + 1}</td>
          <td>{workingSet.reps}</td>
          <td>
            {workingSet.weight} {exercise.units}
          </td>
          <td>
            {otherWeight} {otherUnits}
          </td>
        </tr>
      );
    });
  }

  function exercisesView(workout: Workout) {
    return workout.exercises.map((exercise) => {
      return (
        <Stack gap={3}>
          <Card
            style={{ width: "36rem" }}
          >
            <Card.Body>
              <Card.Title>{exercise.routine.name} </Card.Title>
              <Card.Text>Notes: {exercise.notes}</Card.Text>
              <Card.Text>Units: {exercise.units}</Card.Text>
              <Stack gap={3} direction="horizontal">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Reps</th>
                      <th>Weight</th>
                      <th>Converted</th>
                    </tr>
                  </thead>
                  <tbody>{workingSetsView(exercise)}</tbody>
                </Table>
              </Stack>
            </Card.Body>
          </Card>
        </Stack>
      )
    });
  }

  const workoutsView = workouts.map((workout) => {
    return ( <Card onClick={()=>workoutSelected(workout)}> 
      <Card.Body>
      <Card.Title>Workout: {workout.workoutType} </Card.Title>
        {exercisesView(workout)} 
      </Card.Body>
    </Card>);
  });

  if (isLoading) {
    return (
      <>
            <h1>Workouts</h1>
            <Stack gap={3} direction="horizontal">
              <Link href="/workouts/workout">Add Workout</Link>
              <Link href="/workouts/exercises">Exercises</Link>
            </Stack>
            Loading...
      </>
    );
  } else {
  return (
        <>
          <h1>Workouts</h1>

          <Stack gap={3} direction="horizontal">
            <Link href="/workouts/workout">Add Workout</Link>
            <Link href="/workouts/exercises">Exercises</Link>
          </Stack>
          {workoutsView}
        </>
      );
  }
};

export default WorkoutIndex;
