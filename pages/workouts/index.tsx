import type { NextPage } from "next";
import Link from "next/link";
import { Table, Card, Stack } from "react-bootstrap";

import {  selectWorkouts, setSelectedWorkout} from "../../features/workout/workoutSlice";
import { Exercise, WorkingSet, Workout } from "../../features/workout/model";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useRouter } from "next/router";

const WorkoutIndex: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const workouts = useAppSelector(selectWorkouts);

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
};

export default WorkoutIndex;
