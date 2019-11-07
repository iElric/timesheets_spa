import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { Form, Button, Alert, Col } from 'react-bootstrap';
import { Redirect } from 'react-router';
import { all_jobcodes } from '../ajax';


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

	renderTask(index, options) {
		console.log(options);
		return (
			<Task key={index} options={options}
				onJobcode={(event, index) => this.jobcode_changed(event.target.value, index)}
				onHour={(event, index) => this.hour_changed(event.target.value, index)}
				onDesc={(event, index) => this.desc_changed(event.target.value, index)} />
		)
	}

	redirect(path) {
		this.setState({ redirect: path });
	}

	renderTasks(num, options) {
		let tasks = [];
		for (let i = 0; i < num; i++) {
			tasks.push(this.renderTask(i, options));
		}
		return tasks;
	}

	render() {
		let { options, jobcodes, hours, descs, errors } = this.props;
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
		console.log(this.props);
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
					<Task onJobCode={e => this.jobcode_changed(e.target.value, 0)}
						onHour={e => this.hour_changed(e.target.value, 0)}
						onDesc={e => this.desc_changed(e.target.value, 0)}
						options={options} />
					<Task onJobCode={e => this.jobcode_changed(e.target.value, 1)}
						onHour={e => this.hour_changed(e.target.value, 1)}
						onDesc={e => this.desc_changed(e.target.value, 1)}
						options={options} />
					<Task onJobCode={e => this.jobcode_changed(e.target.value, 2)}
						onHour={e => this.hour_changed(e.target.value, 2)}
						onDesc={e => this.desc_changed(e.target.value, 2)}
						options={options} />
					<Task onJobCode={e => this.jobcode_changed(e.target.value, 3)}
						onHour={e => this.hour_changed(e.target.value, 3)}
						onDesc={e => this.desc_changed(e.target.value, 3)}
						options={options} />
					<Task onJobCode={e => this.jobcode_changed(e.target.value, 4)}
						onHour={e => this.hour_changed(e.target.value, 4)}
						onDesc={e => this.desc_changed(e.target.value, 4)}
						options={options} />
					<Task onJobCode={e => this.jobcode_changed(e.target.value, 5)}
						onHour={e => this.hour_changed(e.target.value, 5)}
						onDesc={e => this.desc_changed(e.target.value, 5)}
						options={options} />
					<Task onJobCode={e => this.jobcode_changed(e.target.value, 6)}
						onHour={e => this.hour_changed(e.target.value, 6)}
						onDesc={e => this.desc_changed(e.target.value, 6)}
						options={options} />
					<Task onJobCode={e => this.jobcode_changed(e.target.value, 7)}
						onHour={e => this.hour_changed(e.target.value, 7)}
						onDesc={e => this.desc_changed(e.target.value, 7)}
						options={options} />
				</Form>
			</div>

		);
	}
}


function Task(props) {
	let { options, onJobCode, onHour, onDesc } = props;
	//console.log(options);
	return (
		<Form.Row>
			<Form.Group as={Col} controlId="formGridJob">
				<Form.Label>Job</Form.Label>
				{/* <Form.Control as="select" multiple={true} value={options} onChange={onJobCode}>
					{options.map(option => (
						<option value={option.value}>
							{option.displayValue}
						</option>
					))} */}
				<Form.Control type="job_code" placeholder="Enter Job Code" onChange={onJobCode} />

			</Form.Group >

			<Form.Group as={Col} controlId="formGridHour">
				<Form.Label>Hour</Form.Label>
				<Form.Control type="hour" placeholder="Hour" onChange={onHour} />
			</Form.Group>

			<Form.Group as={Col} controlId="formGridDesc">
				<Form.Label>Desc</Form.Label>
				<Form.Control type="desc" placeholder="Enter Desc" onChange={onDesc} />
			</Form.Group>
		</Form.Row >
	)

}

// hook up redux
function state2props(state) {
	return state.new_timesheets;
}
export default connect(state2props)(TimesheetsNew);