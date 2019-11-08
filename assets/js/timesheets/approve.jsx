import React from 'react';

import Select from 'react-select'
import { connect } from 'react-redux';
import { Table, Form, Button } from 'react-bootstrap';
import { all_workers } from '../ajax';
import { show_worker_sheet } from '../ajax';
import { approve } from '../ajax';

class ApproveTimeSheet extends React.Component {
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
			type: "CHANGE_APPROVE_DATE",
			data: data
		})
	}

	worker_changed(data) {
		this.props.dispatch({
			type: "CHANGE_WORKER",
			data: data
		})
	}

	render() {
		let { tasks, options } = this.props;
		console.log(this.props);
		if (!options) {
			all_workers();
			return (
				<div>
					<h1>Loading All Workers</h1>
					<p>Loading...</p>
				</div>
			);
		}
		options = _.map(options, (o) => { return { value: o, label: o } });
		return (
			<div>
				<Form>
					<Form.Row>
						<Form.Label>date</Form.Label>
						<input type="date" className="form_control mr-sm-2" onChange={(e) => this.date_changed(e.target.value)} />
					</Form.Row>
					<Form.Row>
						<Select options={options} onChange={(e) => this.worker_changed(e.value)} defaultValue={options[0]} />
					</Form.Row>
					<Button variant="primary" onClick={() => {
						show_worker_sheet(this);
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
				<ApproveButton onButtonClick={() => approve(this)} tasks = {tasks}/>
			</div>
		);
	}
}

function state2props(state) {
	return state.approve_timesheets;
}

function ApproveButton(props) {
	let { onButtonClick, tasks } = props;
	if (tasks.length !== 0 && !tasks[0].status) {
		return (
		<Button variant="primary" onClick={onButtonClick}>
			Approve
		</Button>)
	} else {
		return null;
	}
}

export default connect(state2props)(ApproveTimeSheet);