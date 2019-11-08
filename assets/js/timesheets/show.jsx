import React from "react";
import ReactDOM from "react-dom";

import { connect } from "react-redux";
import { Table, Form, Button, Alert, Col, Row } from "react-bootstrap";
import { Redirect } from "react-router";
import { get_sheet } from "./ajax";

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

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    let { date, status, worker_id, id, job_code, hour, desc } = this.props;
    if (date.length === 0) {
      let current_worker_id = JSON.parse(localStorage.getItem("session"))
        .worker_id;
      get_sheet(current_worker_id);
      return (
        <div>
          <h1>Show Sheet</h1>
          <p>Loading...</p>
        </div>
      );
    }

    //this.renderTableData();
    console.log(Array.isArray(job_code));
    return (
        
      <Table>
        {date.map((x, i) => (
          <div>
            <thead>
              <th>Date: {x}</th> 
              <th>Status: {status[i] == true ? "Approved" : "Not Approved" }</th> 
              <th>worker_id: {worker_id[i]}</th>
            </thead>
            {job_code[i].map((y, j) => {
              return <tbody>
                <tr>
                  {" "}
                  <td>JobCode: {job_code[i][j]}</td> <td>Hour: {hour[i][j]}</td><td> Note:{" "}</td>
              </tr>
              </tbody>;
            })}
          </div>
        ))}
      </Table>
    );
  }
}
function state2props(state) {
  return state.all_sheet;
}

export default connect(state2props)(ShowTimeSheet);