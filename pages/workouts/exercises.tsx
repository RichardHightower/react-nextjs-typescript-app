import type { NextPage } from "next";
import Link from "next/link";
import { Table } from "react-bootstrap";
import { workoutRoutines } from "../../features/workout/workoutData";

const ExercisesIndexPage: NextPage = () => {
  const exerciseTableView = workoutRoutines.map((exercise, index) => {
    return (
      <tr>
        <td>{index + 1}</td>
        <td>{exercise.name}</td>
        <td>{exercise.slug} </td>
        <td>{exercise.bodyPart} </td>
        <td>{exercise.type}</td>
        <td>{exercise.category}</td>
      </tr>
    );
  });

  return (
    <>
      <h1>Exercises</h1>
      <Link href="/workouts/">Workouts</Link>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Body Part</th>
            <th>Type</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>{exerciseTableView}</tbody>
      </Table>
    </>
  );
};

export default ExercisesIndexPage;
