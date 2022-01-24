import "bootstrap/dist/css/bootstrap.min.css";

import { Row, Col, Button, Modal, Card, Form } from "react-bootstrap";

import * as data from "./workoutData";
import { WorkoutRoutine } from "./model";
import { BodyPartsAllowedTypes } from "./model";
import { FC, useState } from "react";

interface Props {
  showRoutines: boolean;
  setShowRoutines: (x: boolean) => void;
  changeWorkoutRoutine: (routine: WorkoutRoutine) => void;
}

const RoutineModalForm: FC<Props> = (props) => {
  const showRoutines = props.showRoutines;
  const changeWorkoutRoutine = props.changeWorkoutRoutine;
  const setShowRoutines = props.setShowRoutines;

  const [bodyPart, setBodyPart] = useState<string>("");
  const [routineNameFilter, setRoutineNameFilter] = useState<string>("");

  function onClick(routine: WorkoutRoutine) {
    changeWorkoutRoutine(routine);
  }

  const routines = data.workoutRoutines
    .filter((r) => {
      const filter = routineNameFilter.toUpperCase();
      const routine = r.name.toUpperCase();
      if (filter.length < 2) {
        return true;
      } else {
        return routine.includes(filter);
      }
    })
    .filter((r) => {
      if (bodyPart.length == 0) {
        return true;
      } else {
        return r.bodyPart == bodyPart;
      }
    })
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .map((routine) => {
      return (
        <Col onClick={() => onClick(routine)}>
          <Card style={{ width: "8rem" }}>
            <Card.Body>
              <Card.Title>{routine.name}</Card.Title>
              <Card.Text>{routine.slug}</Card.Text>
              <Card.Text>{routine.description}</Card.Text>
              <Card.Text>Body Part: {routine.bodyPart}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      );
    });

  const bodyPartsSelection = BodyPartsAllowedTypes.map((bp) => {
    return <option value={bp}>{bp}</option>;
  });

  return (
    <Modal show={showRoutines} onHide={() => setShowRoutines(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Pick Routine</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Form.Select
            aria-label="Body Part"
            onChange={(event) => {
              setBodyPart(event.target.value);
            }}
            value={bodyPart}
          >
            <option value="">Body Part</option>
            {bodyPartsSelection}
          </Form.Select>
          <Form.Control type="text" onChange={(event)=> {
            setRoutineNameFilter(event.target.value);
          }}
          value={routineNameFilter}>
          </Form.Control>
        </Row>
        <Row>{routines}</Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowRoutines(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RoutineModalForm;
