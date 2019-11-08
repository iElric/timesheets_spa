import React from "react";
import ReactDOM from "react-dom";

import { connect } from "react-redux";
import { Table, Form, Button, Alert, Col, Row } from "react-bootstrap";
import { Redirect } from "react-router";
import { show_sheet } from "../ajax";

class ShowTimeSheet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null
    };
  }

  redirect(path) {
    this.setState({
      redirect: path
    });
  }

  date_changed(data) {
    this.props.dispatch({
      type: "CHANGE_SHOW_DATE",
      data: data
    })
  }

  render() {
    let { tasks, errors } = this.props;
    console.log(tasks);
    let error_msg = null;
    if (errors) {
      error_msg = <Alert variant="danger">{errors}</Alert>;
    }
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div>
        <Form>
          <Form.Row>
            <Form.Label>date</Form.Label>
            <input type="date" className="form_control mr-sm-2" onChange={(e) => this.date_changed(e.target.value)} />
          </Form.Row>
          <Button variant="primary" onClick={() => {
            show_sheet(this);
          }}>
            Submit
        	</Button>
        </Form>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Job Code</th>
              <th>Spent Hours</th>
              <th>Description</th>
              <th>Approved</th>
            </tr>
          </thead>
          <tbody>
            {
              tasks.map((t, i) => {
                return (
                <tr>
                  <td>
                    {i + 1}
                  </td>
                  <td>
                    {t.job_code}
                  </td>
                  <td>
                    {t.spent_hours}
                  </td>
                  <td>
                    {t.desc}
                  </td>
                  <td>
                    {t.status.toString()}
                  </td>
                </tr>);
              })
            }
          </tbody>
        </Table>
      </div>

    )
  }
}


function state2props(state) {
  return state.show_timesheets;
}

export default connect(state2props)(ShowTimeSheet);