import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { Form, Button, Alert, Col } from 'react-bootstrap';
import { Redirect } from 'react-router';


class TimesheetsNew extends React.Component {
	constructor(props) {
		super(props);

		console.log(this.props);

		this.state = {
			redirect: null,
		}
	}

	renderTask(index) {
		return (
			<Task key={index} />
		)
	}

	redirect(path) {
		this.setState({ redirect: path });
	}

	renderTasks(num) {
		let tasks = [];
		for (let i = 0; i < num; i++) {
			tasks.push(this.renderTask(i));
		}
		return tasks;
	}

	render() {
		let { jobcodes, hours, descs, errors } = this.props;
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
					{this.renderTasks(8)}
				</Form>
			</div>

		);
	}
}

function Task(props) {
	let { } = props;
	return (
		<Form.Row>
			<Form.Group as={Col} controlId="formGridJob">
				<Form.Label>Job</Form.Label>
				<Form.Control type="job_code" placeholder="Enter Job Code" />
			</Form.Group>

			<Form.Group as={Col} controlId="formGridHour">
				<Form.Label>Hour</Form.Label>
				<Form.Control type="hour" placeholder="Hour" />
			</Form.Group>

			<Form.Group as={Col} controlId="formGridDesc">
				<Form.Label>Desc</Form.Label>
				<Form.Control type="desc" placeholder="Enter Desc" />
			</Form.Group>
		</Form.Row>
	)

}

// hook up redux
function state2props(state) {
	return state.new_timesheets;
}
export default connect(state2props)(TimesheetsNew);