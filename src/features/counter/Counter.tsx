import { useState } from 'react'

import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'

import { useAppSelector, useAppDispatch } from '../../app/hooks'
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
} from './counterSlice'
import styles from './Counter.module.css'

function Counter() {
  const dispatch = useAppDispatch()
  const count = useAppSelector(selectCount)
  const [incrementAmount, setIncrementAmount] = useState('2')

  const incrementValue = Number(incrementAmount) || 0

  return (
    <Container>
        <Row >
        <Col md={3} >
                <Button variant="outline-primary"
                    aria-label="Decrement value"
                    onClick={() => dispatch(decrement())}
                >
                    -
                </Button>
                <Badge pill bg="secondary">{count}</Badge>
                <Button variant="outline-primary"
                 aria-label="Increment value"
                    onClick={() => dispatch(increment())}
                >
                    +
                </Button>
        </Col>
      </Row>
      <Row>
          <Col>
            <input
            className={styles.textbox}
            aria-label="Set increment amount"
            value={incrementAmount}
            onChange={(e) => setIncrementAmount(e.target.value)}
            />
            <Button onClick={() => dispatch(incrementByAmount(incrementValue))}
            >
            Add Amount
            </Button>
            <Button onClick={() => dispatch(incrementAsync(incrementValue))}
            >
            Add Async
            </Button>
            <Button onClick={() => dispatch(incrementIfOdd(incrementValue))}>
            Add If Odd
            </Button>
        </Col>
      </Row>
      </Container>
  )
}

export default Counter