import { FC, useState } from "react";

import {
  Row,
  Form,
  Col,
  Container,
  Button,
  Card,
  Table,
} from "react-bootstrap";

import { useFormik } from "formik";

import {
  Workout,
  WorkoutSchema,
  Exercise,
  WorkoutType,
  AllowedWorkoutTypes,
  Units,
  WorkingSet,
} from "./model";

import { useAppDispatch } from "../../app/hooks";
import { addWorkout, unselectWorkout } from "./workoutSlice";
import { useRouter } from "next/router";
import RoutineModalForm from "./RoutineModalForm";
import ExerciseForm from "./ExerciseForm";
import { addWorkoutByPost } from "./WorkoutService";

interface WorkoutFormProps {
  workout?: Workout | null;
}

const WorkoutForm: FC<WorkoutFormProps> = (props) => {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const [currentWorkout, setCurrentWorkout] = useState<Workout>(
    !props.workout
      ? {
          name: "",
          description: "",
          workoutType: "chest & shoulders",
          exercises: [],
          time: new Date().toString(),
          defaultUnits: "lbs",
        }
      : { ...props.workout }
  );

  const [showAddExercise, setShowAddExercise] = useState<boolean>(false);
  const [updateModeExercise, setUpdateModeExercise] = useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise|null>();

  const onFormSubmit = (values: Workout, actions: any) => {
    console.log({ values, actions });
    const newWorkout = {
      ...values,
      exercises: currentWorkout.exercises,
      units: currentWorkout.defaultUnits,
    };
    setCurrentWorkout(newWorkout);
    if (props.workout) {
      console.log("Workout unselected");
      dispatch(unselectWorkout());
    }
    dispatch(addWorkout(newWorkout));
    addWorkoutByPost(newWorkout);
    actions.setSubmitting(false);
    router.push("../workouts");
  };

  const cancelWorkoutForm = () => {
    setShowAddExercise(false);
    setSelectedExercise(null);

  };

  const onAddExerciseClicked = () => {
    setUpdateModeExercise(false);
    setShowAddExercise(true);
  };

  const addExercise = (exercise: Exercise) => {
    setCurrentWorkout({
      ...currentWorkout,
      exercises: currentWorkout.exercises.concat(exercise),
    });
    setShowAddExercise(false);
  };

  const updateExercise = (exercise: Exercise) => {
    alert("updateExerciseCalled");
    setShowAddExercise(false);
    setUpdateModeExercise(false);
    setSelectedExercise(null);
  };

  function selectExercise(exercise: Exercise) {
    setSelectedExercise(exercise);
    setUpdateModeExercise(true);
    setShowAddExercise(true);
  }



  const formik = useFormik({
    validationSchema: WorkoutSchema,
    onSubmit: onFormSubmit,
    initialValues: currentWorkout,
    validateOnBlur: true,
  });

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
            {workingSet.weight}
          </td>
        </tr>
      );
    });
  }

  const values = formik.values;
  const touched = formik.touched;
  const errors = formik.errors;

  const time = new Date(currentWorkout.time);

  const handleSelectWorkoutTypeChange = (event: any) => {
    const value = event.currentTarget.value as WorkoutType;
    const newWorkout: Workout = {
      ...currentWorkout,
      workoutType: value,
    };
    setCurrentWorkout(newWorkout);
  };

  const handleSelectUnitsChange = (event: any) => {
    const value = event.currentTarget.value as Units;
    const newWorkout: Workout = {
      ...currentWorkout,
      defaultUnits: value,
    };
    setCurrentWorkout(newWorkout);
  };

  const onRemoveWorkout = () => {
    //dispatch(removeWorkout(currentWorkout));
  };


  const exercisesView = currentWorkout.exercises.map((exercise: Exercise) => {
    return (
      <Card style={{ width: "20rem" }} onClick={()=>{selectExercise(exercise)}}>
        <Card.Body>
          <Card.Title>{exercise.routine.name}</Card.Title>
          <Table>
            <tr>
              <td>Body Part</td>
              <td>{exercise.routine.bodyPart}</td>
            </tr>
            <tr>
              <td>Notes</td>
              <td>{exercise.notes}</td>
            </tr>
            <tr>
              <td>Sets</td>
              <td><Table>
                <thead>
                <tr>
                  <td>#</td>
                  <td>Reps</td>
                  <td>Weight</td>
                </tr>
                </thead>
                <tbody>
                {workingSetsView(exercise)}
                </tbody>
                </Table></td>
            </tr>
            
          </Table>
        </Card.Body>
      </Card>
    );
  });

  const workoutTypeOptions = AllowedWorkoutTypes.map((workoutType) => {
    return <option value={workoutType}>{workoutType}</option>;
  });

  function newExercise(): Exercise {
    return {
      routine: {
        name: "Bench Press",
        slug: "bench-press",
        bodyPart: "Chest",
        type: "barbell",
        category: "Barbell",
        aliases: [],
      },
      time: new Date().toString(),
      workingSets: [],
      notes: "",
      units: currentWorkout.defaultUnits,
    };
  }

  return (
    <Container>
      <h2>Workout</h2>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Row>
          <Col md={3}>Workout: {currentWorkout.workoutType}, {currentWorkout.name}</Col>
          <Col>
            Date: (day/month/year): {time.getDate()}/{time.getMonth() + 1}/
            {time.getFullYear()}
          </Col>
        </Row>

        <Row>
        <Form.Group as={Col} md="4" className="position-relative">
            <Form.Label>Workout Type</Form.Label>
            <Form.Control
              name="workoutType"
              as="select"
              aria-label="Workout type"
              onChange={handleSelectWorkoutTypeChange}
              defaultValue={values.workoutType}
              isValid={touched.workoutType && !errors.workoutType}
              isInvalid={touched.workoutType && !!errors.workoutType}
            >
              {workoutTypeOptions}
            </Form.Control>
            <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid" tooltip>
              Select a workout type
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" className="position-relative">
            <Form.Label>Default Units</Form.Label>
            <Form.Control
              name="defaultUnits"
              as="select"
              aria-label="Select units"
              onChange={handleSelectUnitsChange}
              defaultValue={values.defaultUnits}
              isValid={touched.defaultUnits && !errors.defaultUnits}
              isInvalid={touched.defaultUnits && !!errors.defaultUnits}
              value={currentWorkout.defaultUnits}
            >
              <option value="lbs">Pounds</option>
              <option value="kgs">Kilograms</option>
            </Form.Control>
            <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid" tooltip>
              Select a unit
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
        <Form.Group as={Col} md="4" className="position-relative">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={values.name}
              onChange={formik.handleChange}
              isValid={touched.name && !errors.name}
              isInvalid={touched.name && !!errors.name}
            />
            <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" className="position-relative">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={values.description}
              onChange={(e) => formik.handleChange(e)}
              isValid={touched.description && !errors.description}
              isInvalid={touched.description && !!errors.description}
            />
            <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>


        <Row>

        </Row>
        <Row>
          <h2>Exercises</h2>
          {exercisesView}
          <Col>
            <ExerciseForm
              showAddExercise={showAddExercise}
              setShowAddExercise={setShowAddExercise}
              addExercise={addExercise}
              updateExercise={updateExercise}
              defaultUnits={currentWorkout.defaultUnits}
              currentExercise={selectedExercise ? selectedExercise : newExercise() }
              setCurrentExercise={setSelectedExercise}
              updateMode={updateModeExercise}
              cancel={cancelWorkoutForm}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={onAddExerciseClicked}>Add Exercise</Button>
          </Col>
        </Row>
        <Button variant="primary" type="submit" disabled={!formik.isValid}>
          Add Workout
        </Button>
        <Button
          variant="secondary"
          onClick={onRemoveWorkout}
          disabled={!formik.isValid}
        >
          Remove Workout
        </Button>
      </Form>
    </Container>
  );
};

export default WorkoutForm;
