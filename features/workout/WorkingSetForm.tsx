

import 'bootstrap/dist/css/bootstrap.min.css';

import { Row, Form, Col, Button, Modal } from "react-bootstrap";

import { useFormik } from "formik";

import { WorkingSet, WorkingSetSchema } from "./model";
import {FC} from "react";

interface Props {
  showAddSet: boolean;
  setShowAddSet: (x: boolean) => void;
  addWorkingSet: (workingSet: WorkingSet) => void
}

const WorkingSetForm: FC<Props> = (props) => {
  const showAddSet = props.showAddSet;
  const setShowAddSet = props.setShowAddSet;
  const addWorkingSet = props.addWorkingSet;

  const onFormSubmit = (values: WorkingSet, actions: any) => {
  };
  const formik = useFormik({
    validationSchema: WorkingSetSchema,
    onSubmit: onFormSubmit,
    initialValues: { weight: 10, reps: 5 },
    validateOnBlur: true,
  });

  const values = formik.values;
  const touched = formik.touched;
  const errors = formik.errors;

  const onAddSet = ()=> {
    addWorkingSet(values);
  }

  const onSetAddedCancel = () => {
    setShowAddSet(false);
  };

  return (
    <Modal show={showAddSet} onHide={onSetAddedCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Add Set</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" className="position-relative">
              <Form.Label>Reps</Form.Label>
              <Form.Control
                type="text"
                name="reps"
                value={values.reps}
                onChange={formik.handleChange}
                isValid={touched.reps && !errors.reps}
                isInvalid={touched.reps && !!errors.reps}
              />
              <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid" tooltip>
                {errors.reps}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="4" className="position-relative">
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="text"
                name="weight"
                value={values.weight}
                onChange={formik.handleChange}
                isValid={touched.weight && !errors.weight}
                isInvalid={touched.weight && !!errors.weight}
              />
              <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid" tooltip>
                {errors.weight}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onSetAddedCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onAddSet} disabled={!formik.isValid}>
            Add Working Set
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WorkingSetForm;
