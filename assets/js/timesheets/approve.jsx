import React from 'react';
import ReactDOM from 'react-dom';

import Select from 'react-select'
import { connect } from 'react-redux';
import { Form, Button, Alert, Col } from 'react-bootstrap';
import { Redirect } from 'react-router';
import { all_workers } from '../ajax';
import { show_worker_sheet} from '../ajax';

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
			type: "CHANGE_DATE",
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
		let { options } = this.props;
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
						<Select options={options} onChange={(e)=>this.worker_changed(e.value)} defaultValue={options[0]} />
					</Form.Row>
					<Button variant="primary" onClick={() => {
						
					}}>
						Submit
        	</Button>
				</Form>

			</div>
		);
	}
}

function state2props(state) {
	return state.approve_timesheets;
}

export default connect(state2props)(ApproveTimeSheet);