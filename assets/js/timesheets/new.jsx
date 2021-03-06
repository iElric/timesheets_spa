import React from 'react';
import ReactDOM from 'react-dom';

import Select from 'react-select'
import { connect } from 'react-redux';
import { Form, Button, Alert, Col } from 'react-bootstrap';
import { Redirect } from 'react-router';
import { all_jobcodes } from '../ajax';
import { create_sheet } from '../ajax';
import _ from 'lodash';


class TimesheetsNew extends React.Component {
  constructor(props) {
    super(props);

    console.log(this.props);

    this.state = {
      redirect: null,
    }
  }

  jobcode_changed(data, index) {
    console.log(data);
    this.props.dispatch({
      type: "CHANGE_JOBCODE",
      data: data,
      index: index
    })
  }

  hour_changed(data, index) {
    this.props.dispatch({
      type: "CHANGE_HOUR",
      data: data,
      index: index
    })
  }

  desc_changed(data, index) {
    this.props.dispatch({
      type: "CHANGE_DESC",
      data: data,
      index: index
    })
  }

  date_changed(data) {
    this.props.dispatch({
      type: "CHANGE_DATE",
      data: data
    })
  }

  handle_plus() {
    if (this.props.task_num < 8) {
      let new_num = this.props.task_num + 1;
      this.props.dispatch({
        type: "PLUS",
        data: new_num
      })
    }
  }
  handle_minus() {
    if (this.state.task_num > 1) {
      let new_num = this.props.task_num - 1;
      this.props.dispatch({
        type: "MINUS",
        data: new_num
      })
    }
  }


  redirect(path) {
    this.setState({ redirect: path });
  }

  renderTasks(index, options) {
    let tasks = [];
    for (let i = 0; i < index; i++) {
      tasks.push(
        <Task
          options={options}
          onJobCode={e => this.jobcode_changed(e.value, i)}
          onHour={e => this.hour_changed(e.target.value, i)}
          onDesc={e => this.desc_changed(e.target.value, i)} />
      )
    }
    return tasks;
  }

  render() {
    let { options, jobcodes, hours, descs, errors, task_num} = this.props;
    console.log(this.props);
    /* Important!!!!!!!!!!! */
    if (!options) {
      all_jobcodes();
      return (
        <div>
          <h1>Loading Job Codes</h1>
          <p>Loading...</p>
        </div>
      );
    }
    options = options.jobcodes;
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
          <button onClick={() => this.handle_plus()}>+</button>
          <button onClick={() => this.handle_minus()}>-</button>
          {this.renderTasks(task_num, options)}
          {/* <Task onJobCode={e => this.jobcode_changed(e.value, 0)}
            onHour={e => this.hour_changed(e.target.value, 0)}
            onDesc={e => this.desc_changed(e.target.value, 0)}
            options={options} />
          <Task onJobCode={e => this.jobcode_changed(e.value, 1)}
            onHour={e => this.hour_changed(e.target.value, 1)}
            onDesc={e => this.desc_changed(e.target.value, 1)}
            options={options} />
          <Task onJobCode={e => this.jobcode_changed(e.value, 2)}
            onHour={e => this.hour_changed(e.target.value, 2)}
            onDesc={e => this.desc_changed(e.target.value, 2)}
            options={options} />
          <Task onJobCode={e => this.jobcode_changed(e.value, 3)}
            onHour={e => this.hour_changed(e.target.value, 3)}
            onDesc={e => this.desc_changed(e.target.value, 3)}
            options={options} />
          <Task onJobCode={e => this.jobcode_changed(e.value, 4)}
            onHour={e => this.hour_changed(e.target.value, 4)}
            onDesc={e => this.desc_changed(e.target.value, 4)}
            options={options} />
          <Task onJobCode={e => this.jobcode_changed(e.value, 5)}
            onHour={e => this.hour_changed(e.target.value, 5)}
            onDesc={e => this.desc_changed(e.target.value, 5)}
            options={options} />
          <Task onJobCode={e => this.jobcode_changed(e.value, 6)}
            onHour={e => this.hour_changed(e.target.value, 6)}
            onDesc={e => this.desc_changed(e.target.value, 6)}
            options={options} />
          <Task onJobCode={e => this.jobcode_changed(e.value, 7)}
            onHour={e => this.hour_changed(e.target.value, 7)}
            onDesc={e => this.desc_changed(e.target.value, 7)}
            options={options} /> */}
          <Form.Row>
            <Form.Group as={Col} controlId="formGridJob">
              <Form.Label>date </Form.Label>
              <input type="date" className="date_new" onChange={(e) => this.date_changed(e.target.value)} />
            </Form.Group >
          </Form.Row>
          <Button size="lg" variant="primary" onClick={() => {
            create_sheet(this);
          }}>
            Submit
        			</Button>
        </Form>
      </div>

    );
  }
}


function Task(props) {
  let { options, onJobCode, onHour, onDesc } = props;
  options = _.map(options, (o) => { return { value: o, label: o } });
  //console.log(options);
  return (
    <Form.Row>
      <Form.Group as={Col} controlId="formGridJob">
        <Form.Label>Job</Form.Label>
        <Select className="select" options={options} onChange={onJobCode} defaultValue={options[0]} />
      </Form.Group >

      <Form.Group as={Col} controlId="formGridHour">
        <Form.Label>Hour</Form.Label>
        <Form.Control type="hour" className="input_box" placeholder="Spent Hours" onChange={onHour} />
      </Form.Group>

      <Form.Group as={Col} controlId="formGridDesc">
        <Form.Label>Desc</Form.Label>
        <Form.Control type="desc" className="input_box" placeholder="Enter a Description" onChange={onDesc} />
      </Form.Group>
    </Form.Row >
  )

}

// hook up redux
function state2props(state) {
  return state.new_timesheets;
}
export default connect(state2props)(TimesheetsNew);