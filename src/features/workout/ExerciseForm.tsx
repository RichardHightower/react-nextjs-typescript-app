import { FC, useState } from "react";

import { Row, Form, Col, Modal, Button, Card, Table } from "react-bootstrap";

import { useFormik } from "formik";

import {
  WorkingSet,
  Exercise,
  ExerciseSchema,
  WorkoutRoutine,
  Units,
} from "./model";

import styles from "./Exercise.module.css";
import WorkingSetForm from "./WorkingSetForm";
import RoutineModalForm from "./RoutineModalForm";


interface ExerciseProps {
  showAddExercise: boolean;
  setShowAddExercise: (x: boolean) => void;
  addExercise: (exercise: Exercise) => void;
  updateExercise: (exercise: Exercise) => void;
  defaultUnits: Units;
  currentExercise: Exercise;
  cancel: () => void;
  updateMode : boolean;
  setCurrentExercise: (exercise:Exercise)=>void;
}

import { useAppSelector, useAppDispatch } from "../../app/hooks";

const ExerciseForm: FC<ExerciseProps> = (props) => {
  const currentExercise = props.currentExercise;
  const setCurrentExercise = props.setCurrentExercise;



  const [showAddSet, setShowAddSet] = useState<boolean>(false);
  const [showRoutines, setShowRoutines] = useState<boolean>(false);

  const onFormSubmit = (values: Exercise, actions: any) => {};

  const onAddExercise = () => {
    const editedExercise = {
      ...values,
      routine: currentExercise.routine,
      workingSets: currentExercise.workingSets,
      units: currentExercise.units,
    };

    if (!props.updateMode) {
      props.addExercise(editedExercise);
    } else {
      props.updateExercise(editedExercise);
    }
  };

  const onAddSetClicked = () => {
    setShowAddSet(true);
  };

  const onShowWorkoutRoutines = () => {
    setShowRoutines(true);
  };

  const addWorkingSet = (workingSet: WorkingSet) => {
    setCurrentExercise({
      ...currentExercise,
      workingSets: currentExercise.workingSets.concat(workingSet),
    });
    setShowAddSet(false);
  };

  const changeWorkoutRoutine = (workoutRoutine: WorkoutRoutine) => {
    setCurrentExercise({
      ...currentExercise,
      routine: workoutRoutine,
    });
    setShowRoutines(false);
  };

  const formik = useFormik({
    validationSchema: ExerciseSchema,
    onSubmit: onFormSubmit,
    initialValues: currentExercise,
    validateOnBlur: true,
  });

  const values = formik.values;
  const touched = formik.touched;
  const errors = formik.errors;

  const time = new Date(currentExercise.time);

  const handleSelectChange = (event: any) => {
    const value = event.currentTarget.value as Units;
    const newWorkout = {
      ...currentExercise,
      units: value,
    };
    //WorkoutSchema.isValid(newWorkout);
    setCurrentExercise(newWorkout);
  };

  const onRemoveWorkout = () => {
    //dispatch(removeWorkout(currentWorkout));
  };

  const workingSetsView = currentExercise.workingSets.map(
    (workingSet: WorkingSet, index: number) => {
      return (
        <Card style={{ width: "12rem" }}>
          <Card.Body>
            <Card.Title>Set {index + 1}</Card.Title>
            <Table>
              <tr>
                <td>Reps</td>
                <td>{workingSet.reps}</td>
              </tr>
              <tr>
                <td>Weight</td>
                <td>{workingSet.weight}</td>
              </tr>
            </Table>
          </Card.Body>
        </Card>
      );
    }
  );

  const addUpdateText = props.updateMode ? "Update Exercise" : "Add Exercise";

  return (
    <Modal
      show={props.showAddExercise}
      onHide={() => props.cancel()}
    >
      <Modal.Header closeButton>
        <Modal.Title>{addUpdateText}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Row>
            <h2>{currentExercise.routine.name}</h2>
            <Col md={3}>Description: {currentExercise.routine.description}</Col>
            <Col>
              <RoutineModalForm
                showRoutines={showRoutines}
                setShowRoutines={setShowRoutines}
                changeWorkoutRoutine={changeWorkoutRoutine}
              />
              <Button onClick={onShowWorkoutRoutines}>Change Routine</Button>
            </Col>
            <Col>
              Date (day/month/year): {time.getDate()}/{time.getMonth()+1}/
              {time.getFullYear()}
            </Col>
          </Row>
          <Row className="mb-3">
            <h2>Exercise</h2>
            <Form.Group as={Col} md="4" className="position-relative">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                type="text"
                name="notes"
                value={values.notes}
                onChange={formik.handleChange}
                isValid={touched.notes && !errors.notes}
                isInvalid={touched.notes && !!errors.notes}
              />
              <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid" tooltip>
                {errors.notes}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md="4" className="position-relative">
              <Form.Label>Units</Form.Label>
              <Form.Control
                as="select"
                aria-label="Select units"
                onChange={handleSelectChange}
                defaultValue={values.units}
                isValid={touched.units && !errors.units}
                isInvalid={touched.units && !!errors.units}
                value={currentExercise.units}
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
          <Row>
            <h2>Sets</h2>
            {workingSetsView}
            <Col>
              <WorkingSetForm
                showAddSet={showAddSet}
                setShowAddSet={setShowAddSet}
                addWorkingSet={addWorkingSet}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button onClick={onAddSetClicked}>Add Set</Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            props.cancel();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onAddExercise}
          disabled={!formik.isValid}
        >
          {addUpdateText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExerciseForm;
